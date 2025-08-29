// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract BNBRFPresale is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    IERC20 public token;
    IERC20Metadata public tokenMetadata;
    AggregatorV3Interface public priceFeed;
    address public paymentAddress;
    uint256 public presaleTokenAmount = 1000000000000000000000000000;
    bool public presaleActive = true;
    uint256 public totalSold = 0;
    uint256 public minimumBuyUsd = 5 * 10**18; // $5 minimum
    

    // Progressive Tier System - Users advance by accumulating referrals:
    // Tier 1 (0-5): 10% | Tier 2 (6-15): 15% | Tier 3 (16-40): 20% | Tier 4 (41-80): 25%
    // Tier 5 (81-180): 30% | Tier 6 (181-430): 40% | Tier 7 (431-930): 50% | Tier 8 (931+): 70%

    // —— Referral state ——
    uint256[] public referralBuyerTiers = [930, 430, 180, 80, 40, 15, 5, 0];
    uint256[] public referralBonuses    = [ 70,  50,  40, 30, 25, 20, 15, 10];


    mapping(address => uint256) public referralCounts;
    mapping(address => uint256) public referralBonus; // Stores ETH/BNB amounts
    uint256 public referralLiability;
    mapping(address => uint256) public lastWithdrawal;

    uint256 public withdrawalCooldown = 2 minutes;
    
    /// @notice Minimum payout in token‐smallest‐units (0.03 tokens)
    uint256 public minReferralPayoutEth;
    uint256 public minReferralPayoutBnb;


    // Withdrawal history tracking
    struct WithdrawalRecord {
    uint256 amount;
    uint256 timestamp;
    uint256 blockNumber;
    }

    struct BuyVars {
    uint256 referralCashback;
    uint256 referralPct;
    uint256 effectiveGlobalCount;
    uint256 localAfter;
    uint8 fromTier;
    uint8 toTier;
    bool attOk;
    }

    mapping(address => WithdrawalRecord[]) public withdrawalHistory;
    mapping(address => uint256) public totalWithdrawn;

    using ECDSA for bytes32;

    // Cross-project replay
    bytes32 public constant REFERRAL_PROJECT_ID = keccak256("BNBRF-REFERRAL-v1");

    // Backend signer
    address public aggregatorSigner;

    // Buyer-funded sync fee
    address public stampFeeRecipient;

    // Cap for the buyer-funded sync fee, in basis points of msg.value (1 bp = 0.01%)
    // e.g. 300 = 3%. Owner can tune this. Defaults to 3%.
    uint16 public maxSyncFeeBps = 300;

    // Global count
    mapping(address => uint256) public lastGlobalCount;


    event ReferralPurchase(address indexed referrer, address indexed buyer, uint256 usdAmount, uint256 nativeCurrencyPaid, uint256 cashbackAmount, uint256 bonusPercent, uint256 newReferralCount);    
    event ReferralWithdrawn(address indexed referrer, uint256 amount, uint256 timestamp, uint256 totalWithdrawnToDate);

    event TierCrossed(
    address indexed referrer,
    uint8 fromTier,
    uint8 toTier,
    uint256 syncFee,
    uint256 attestedGlobalCount
    );


    // —— Owner withdrawal events ——
   event FundsWithdrawn(address indexed to, uint256 amount);
   event TokensWithdrawn(address indexed to, uint256 amount);

    struct Stage {
        uint256 id;
        uint256 bonus;
        uint256 price;
        uint256 start;
        uint256 end;
    }
    mapping(uint256 => Stage) public stages;
    uint256 public maxStage = 9;
    uint256 currentStageId = 0;
	
	//  Set Time Update
    event StageTimeUpdated(uint256 indexed id, uint256 newStart, uint256 newEnd);

    // constructor
    constructor(
        address _payment,
        address _token,
        address _priceFeed,
        uint256 _minReferralPayoutEth,
        uint256 _minReferralPayoutBnb
    ) Ownable(msg.sender) {
        // ——— Validate inputs ———
       require(_payment    != address(0), "Payment address is zero");
       require(_token      != address(0), "Token address is zero");
       require(_priceFeed  != address(0), "PriceFeed is zero");
     // ——— Sanity-check min payouts ———
    require(_minReferralPayoutEth > 0,    "Eth min payout must be > 0");
    require(_minReferralPayoutBnb > 0,    "Bnb min payout must be > 0");
        token = IERC20(_token);
        tokenMetadata = IERC20Metadata(_token);
        paymentAddress = _payment;
        priceFeed = AggregatorV3Interface(_priceFeed);
        require(priceFeed.decimals() <= 18, "feed decimals > 18");

        // stage data
        stages[1] = Stage(1, 50, 3000000000000000, 1754830800, 1757509200);    // 0.003
        stages[2] = Stage(2, 35, 5000000000000000, 1757509201, 1760101200);    // 0.005
        stages[3] = Stage(3, 30, 6000000000000000, 1760101201, 1761138000);    // 0.006
        stages[4] = Stage(4, 22, 7000000000000000, 1761138001, 1761310800);    // 0.007
        stages[5] = Stage(5, 15, 8000000000000000, 1761310801, 1761573600);    // 0.008
        stages[6] = Stage(6, 12, 9000000000000000, 1761573601, 1761746400);    // 0.009
        stages[7] = Stage(7, 10, 10000000000000000, 1761746401, 1761832800);   // 0.010
        stages[8] = Stage(8, 10, 12000000000000000, 1761832801, 1762956000);   // 0.012
        stages[9] = Stage(9, 8, 15000000000000000, 1762956001, 1763128800);    // 0.015
        currentStageId = 9;       
   
     minReferralPayoutEth = _minReferralPayoutEth;
     minReferralPayoutBnb = _minReferralPayoutBnb;
     

    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function setAggregatorSigner(address _signer) external onlyOwner {
    require(_signer != address(0), "invalid signer");
    aggregatorSigner = _signer;
    }

    function setStampFeeRecipient(address _recipient) external onlyOwner {
    require(_recipient != address(0), "invalid fee recipient");
    stampFeeRecipient = _recipient;
     }
    
    function setMaxSyncFeeBps(uint16 bps) external onlyOwner {
    require(bps <= 10_000, "bps > 100%");
    maxSyncFeeBps = bps;
   }


    // Get the latest ETH/USD price from the Aggregator with staleness check
    function getNativeCurrencyPrice() public view returns (int256) {
    (
        uint80 roundId,
        int256 price,
        ,
        uint256 updatedAt,
        uint80 answeredInRound
    ) = priceFeed.latestRoundData();
    
    // Check if price is positive
    require(price > 0, "Invalid price from oracle");
    
    // Check if price is not stale (within last hour)
    require(block.timestamp - updatedAt <= 3600, "Price data is stale");
    
    // Check if round is complete
    require(answeredInRound >= roundId, "Round not complete");
    
    // Additional safety: check if updatedAt is not zero
    require(updatedAt > 0, "Round not complete");
    
    return price;
    }

    // Convert native currency (ETH/BNB) to USD based on the latest price
    function weiToUsd(uint256 weiAmount) public view returns (uint256) {
    int256 nativePriceUsd = getNativeCurrencyPrice();
    
    // Scale to 18 decimals: multiply by price and scale difference, then divide by 1e18
    uint256 usdAmount = (weiAmount * uint256(nativePriceUsd) * 10**(18 - priceFeed.decimals())) / 1e18;
    
    return usdAmount;  // Now always returns 18 decimals
    }

    /// @notice Determine referral bonus % based on how many successful referrals
    function getReferralBonusPercentage(uint256 totalBuyers) public view returns (uint256) {
    for (uint256 i = 0; i < referralBuyerTiers.length; i++) {
        if (totalBuyers >= referralBuyerTiers[i]) {
            return referralBonuses[i];
        }
    }
    return 0;
   } 

    /// @dev Convert a referral count to a "tier level" 1..8 matching your arrays
    /// referralBuyerTiers = [930,430,180,80,40,15,5,0] -> referralBonuses = [70,50,40,30,25,20,15,10]
    /// Level 1 = 10% ... Level 8 = 70%
    function _tierLevel(uint256 count) internal view returns (uint8) {
    for (uint8 i = 0; i < referralBuyerTiers.length; i++) {
        if (count >= referralBuyerTiers[i]) {
            return uint8(referralBuyerTiers.length - i); // 8..1
        }
    }
    return 1;
    }

    /// @dev Signature digest (EIP-191 personal-sign) over projectId+referrer+globalCount+deadline+syncFee
    /// SAME message must be used on both chains so the same signature verifies everywhere.
    function _digest(
    address referrer,
    uint256 attestedGlobalCount,
    uint256 deadline,
    uint256 syncFee
    ) internal pure returns (bytes32) {
    bytes32 inner = keccak256(abi.encode(
        REFERRAL_PROJECT_ID,
        referrer,
        attestedGlobalCount,
        deadline,
        syncFee
    ));
    // Personal-sign of a 32-byte value
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", inner));
   }
   
    

    function buyToken(address _referrer) public payable whenNotPaused {
    // Wrapper for backwards compatibility (no attestation params)
    buyToken(_referrer, 0, 0, 0, hex""); // or: new bytes(0)
}

  function buyToken(
    address _referrer,
    uint256 attestedGlobalCount,
    uint256 deadline,
    uint256 syncFee,
    bytes memory sig
) public payable nonReentrant whenNotPaused {
    // 1) CHECKS
    require(tx.origin == msg.sender, "Contracts not allowed");
    require(presaleActive, "Presale is not active");
    require(msg.value > 0, "Must send ETH/BNB");

    uint256 id = getCurrentStageIdActive();
    require(id > 0, "No active stage");
    Stage memory s = stages[id];
    require(block.timestamp >= s.start && block.timestamp <= s.end, "Not in sale window");

    // --------------- REFERRAL / ATTESTATION ---------------
    BuyVars memory v;

    if (_referrer != address(0) && _referrer != msg.sender) {
        uint256 localBefore = referralCounts[_referrer];
        v.localAfter = localBefore + 1;

        // Validate attestation if provided
        if (sig.length > 0) {
            require(aggregatorSigner != address(0), "signer unset");
            require(block.timestamp <= deadline, "attestation expired");
            address signer = _digest(_referrer, attestedGlobalCount, deadline, syncFee).recover(sig);
            if (signer == aggregatorSigner && attestedGlobalCount >= v.localAfter) {
                v.attOk = true;
            }
        }

        // Choose effective global count (monotonic against lastGlobalCount)
        uint256 prevGlobal = lastGlobalCount[_referrer];
        v.effectiveGlobalCount = v.attOk
            ? attestedGlobalCount
            : (prevGlobal > v.localAfter ? prevGlobal : v.localAfter);

        v.fromTier = _tierLevel(prevGlobal);
        v.toTier   = _tierLevel(v.effectiveGlobalCount);

        // If tier-up AND attestation present, validate sync fee here (no transfer yet)
        if (v.attOk && v.toTier > v.fromTier) {
            require(stampFeeRecipient != address(0), "fee recipient unset");
            require(syncFee > 0, "sync fee required");
            require(msg.value >= syncFee, "sync fee missing");
            // Enforce sync fee cap: syncFee ≤ (maxSyncFeeBps / 10_000) * msg.value
        require(syncFee <= (msg.value * maxSyncFeeBps) / 10_000, "sync fee too high");
        } else {
            // If no tier-up OR att is invalid/absent, syncFee must be zero
            require(syncFee == 0, "no tier-up: syncFee not allowed");
        }

        // Compute referral pct from effective global count
        v.referralPct = getReferralBonusPercentage(v.effectiveGlobalCount);
    } else {
        // No referrer => we must not accept any sync fee
        require(syncFee == 0, "no referrer: syncFee not allowed");
    }

    // --------------- PURCHASE MATH (after syncFee) ---------------
    uint256 purchaseValue = msg.value - syncFee;
    require(purchaseValue > 0, "no value left after syncFee");

    uint256 usdValue = weiToUsd(purchaseValue);
    require(usdValue >= minimumBuyUsd, "Below minimum buy amount");

    uint256 tokens = (usdValue * (10**tokenMetadata.decimals()) * (100 + s.bonus)) / (s.price * 100);

    require(
        tokens <= token.balanceOf(address(this)) &&
        totalSold + tokens <= presaleTokenAmount,
        "Not enough tokens"
    );

    // Effects
    totalSold += tokens;

    if (_referrer != address(0) && _referrer != msg.sender) {
        if (v.referralPct > 0) {
            v.referralCashback = (purchaseValue * v.referralPct) / 100;
            referralBonus[_referrer] += v.referralCashback;
            referralLiability += v.referralCashback;
        }
        // Update local count always
        referralCounts[_referrer] = v.localAfter;

        // Only update the GLOBAL checkpoint when the attestation is valid
        if (v.attOk && v.effectiveGlobalCount > lastGlobalCount[_referrer]) {
            lastGlobalCount[_referrer] = v.effectiveGlobalCount;
        }
    }

    // After state updates, transfer the sync fee to the relayer (if any)
    if (v.attOk && v.toTier > v.fromTier) {
        (bool ok, ) = payable(stampFeeRecipient).call{value: syncFee}("");
        require(ok, "sync fee xfer failed");
        emit TierCrossed(_referrer, v.fromTier, v.toTier, syncFee, v.effectiveGlobalCount);
    }

    // Interactions
    token.safeTransfer(msg.sender, tokens);

    uint256 paymentToAddress = purchaseValue - v.referralCashback;
    require(paymentAddress != address(0), "payment addr unset");
    (bool sent, ) = payable(paymentAddress).call{ value: paymentToAddress }("");
    require(sent, "Payment transfer failed");

    if (_referrer != address(0) && v.referralPct > 0) {
        emit ReferralPurchase(_referrer, msg.sender, usdValue, purchaseValue, v.referralCashback, v.referralPct, v.effectiveGlobalCount);
    }
    }
   
    // Overloaded version without referrer
    function buyToken() external payable whenNotPaused {
    buyToken(address(0));
    }
    
    // update token address
    function setToken(address _token) public onlyOwner {
        require(_token != address(0), "Token is zero address!");
        token = IERC20(_token);
        tokenMetadata = IERC20Metadata(_token);
    }

    // update price feed address
    function setPriceFeed(address _priceFeed) public onlyOwner {
        require(_priceFeed != address(0), "Price feed is zero address!");
        priceFeed = AggregatorV3Interface(_priceFeed);
        require(priceFeed.decimals() <= 18, "feed decimals > 18");
    }

    // update paementAddress
    function setPaymentAddress(address _paymentAddress) public onlyOwner {
    require(_paymentAddress != address(0), "payment is zero address");
    paymentAddress = _paymentAddress;
   }

    // update presaleTokenAmount
    function setPresaleTokenAmount(uint256 _amount) public onlyOwner {
        presaleTokenAmount = _amount;
    }

    // flip presaleActive as true/false
    function flipPresaleActive() public onlyOwner {
        presaleActive = !presaleActive;
    }

    // update maximum stage
    function setMaxStage(uint256 _maxStage) public onlyOwner {
        maxStage = _maxStage;
    }

    // update totalSold
    function setTotalSold(uint256 _totalSold) public onlyOwner {
        totalSold = _totalSold;
    }

    // update minimum buy amount
    function setMinimumBuyUsd(uint256 _minimumUsd) public onlyOwner {
        require(_minimumUsd > 0, "Minimum must be greater than 0");
        minimumBuyUsd = _minimumUsd;
    }

    // adding stage info
    function addStage(
        uint256 _bonus,
        uint256 _price,
        uint256 _start,
        uint256 _end
    ) public onlyOwner {
        uint256 _id = currentStageId + 1;
        require(_id <= maxStage, "Maximum stage excceds!");
        require(_bonus <= 100, "Bonus should be between 0 and 100");
        require(_start > 0 && _end > 0, "Invalid date!");
        require(_start < _end, "End date smaller than start!");
        currentStageId += 1;
        stages[_id] = Stage(_id, _bonus, _price, _start, _end);
    }

    // update stage info
     function setStage(
         uint256 _id,
         uint256 _bonus,
         uint256 _price,
         uint256 _start,
         uint256 _end
     ) public onlyOwner {
         require(stages[_id].id == _id, "ID doesn't exist!");
         require(_bonus <= 100, "Bonus should be between 0 and 100");
         require(_start > 0 && _end > 0, "Invalid date!");
         require(_start < _end, "End date smaller than start!");
         stages[_id] = Stage(_id, _bonus, _price, _start, _end);
     }
    

    /**
     * @notice Updates the end time for a given stage.
     * @dev Can be used for an active stage (to extend it) or a future stage.
     * @param _id The ID of the stage to update.
     * @param _newEnd The new end timestamp.
     */
    function updateStageEndTime(uint256 _id, uint256 _newEnd) public onlyOwner {
        require(_id > 0 && _id <= currentStageId, "Stage does not exist");
        Stage storage stageToUpdate = stages[_id];

        // Ensure the stage has not already ended.
        require(block.timestamp < stageToUpdate.end, "Stage has already ended");
        
        // Ensure the new end time is after the stage's start time.
        require(_newEnd > stageToUpdate.start, "End time must be after start time");

        stageToUpdate.end = _newEnd;
        
        // It's good practice to emit an event to log the change.
        emit StageTimeUpdated(_id, stageToUpdate.start, stageToUpdate.end);
    }

    /**
     * @notice Updates the start time for a given stage.
     * @dev Can only be used for a stage that has not started yet.
     * @param _id The ID of the stage to update.
     * @param _newStart The new start timestamp.
     */
    function updateStageStartTime(uint256 _id, uint256 _newStart) public onlyOwner {
        require(_id > 0 && _id <= currentStageId, "Stage does not exist");
        Stage storage stageToUpdate = stages[_id];

        // Ensure the stage has not started. You can't change the start of an active stage.
        require(block.timestamp < stageToUpdate.start, "Stage has already started");

        // Ensure the new start time is in the future.
        require(_newStart > block.timestamp, "New start time must be in the future");
        
        // Ensure the new start time is before the existing end time.
        require(_newStart < stageToUpdate.end, "Start time must be before end time");

        stageToUpdate.start = _newStart;

        emit StageTimeUpdated(_id, stageToUpdate.start, stageToUpdate.end);
    }

    // Optional: Add a helper function to calculate how many tokens user will get
    function calculateTokenAmount(uint256 weiAmount) public view returns (uint256) {
    uint256 id = getCurrentStageIdActive();
    if (id == 0) return 0;
    
    Stage memory s = stages[id];
    uint256 usdValue = weiToUsd(weiAmount);
    uint256 decimals = tokenMetadata.decimals();
    uint256 tokens = (usdValue * (10**decimals) * (100 + s.bonus)) / (s.price * 100);
    
    return tokens;
}

   // Optional: Add a helper function to calculate how much ETH/BNB needed for X tokens
   function calculateRequiredPayment(uint256 tokenAmount) public view returns (uint256) {
    uint256 id = getCurrentStageIdActive();
    if (id == 0) return 0;
    
    Stage memory s = stages[id];
    uint256 decimals = tokenMetadata.decimals();
    
    // Remove bonus to get base tokens
    uint256 baseTokens = (tokenAmount * 100) / (100 + s.bonus);
    
    // Calculate USD value
    uint256 usdValue = (baseTokens * s.price) / (10**decimals);
    
    // Convert to ETH/BNB
    uint256 requiredWei = (usdValue * 1e18) / weiToUsd(1e18);
    
    return requiredWei;
}

    // Helper function to get minimum ETH/BNB required for minimum buy
    function getMinimumBuyWei() public view returns (uint256) {
        // Convert minimum USD to ETH/BNB
        return (minimumBuyUsd * 1e18) / weiToUsd(1e18);
    }

    // get current stage id active
    function getCurrentStageIdActive() public view returns (uint256) {
        uint256 _id = 0;
        if (currentStageId == 0) {
            _id = 0;
        } else {
            for (uint256 i = 1; i <= currentStageId; i++) {
                if (
                    (block.timestamp >= stages[i].start) &&
                    (block.timestamp <= stages[i].end)
                ) {
                    _id = i;
                }
            }
        }
        return _id;
    }

    function updateReferralAttestation(
    address referrer,
    uint256 attestedGlobalCount,
    uint256 deadline,
    uint256 syncFee,   // pass the SAME syncFee used in the buy signature
    bytes calldata sig
) external whenNotPaused {
    require(aggregatorSigner != address(0), "signer unset");
    require(block.timestamp <= deadline, "attestation expired");

    // Verify the SAME signature tuple used in the buy
    address signer = _digest(referrer, attestedGlobalCount, deadline, syncFee).recover(sig);
    require(signer == aggregatorSigner, "bad signature");

    // Monotonic update
    require(attestedGlobalCount >= lastGlobalCount[referrer], "non-monotonic");
    lastGlobalCount[referrer] = attestedGlobalCount;
    // No funds move here.
}


    // withdrawFunds functions to get remaining funds transfer
    function withdrawExcess() public onlyOwner nonReentrant {
    uint256 bal = address(this).balance;
    require(bal > referralLiability, "no excess");
    uint256 amount = bal - referralLiability;
    (bool ok, ) = payable(msg.sender).call{value: amount}("");
    require(ok, "withdraw failed");
    emit FundsWithdrawn(msg.sender, amount);
    }


    // withdrawTokens functions to get remaining tokens transfer
    function withdrawTokens(address _to, uint256 _amount) public onlyOwner nonReentrant {
    // you can drop the explicit balance check if you like,
    // since safeTransfer will revert on underflow.
       require(_to != address(0), "to is zero address");
       token.safeTransfer(_to, _amount);
        emit TokensWithdrawn(_to, _amount);
    }

    /// @notice Withdraw accumulated referral cashback (ETH/BNB)
    function withdrawReferralBonus() external nonReentrant whenNotPaused {
    require(block.timestamp >= lastWithdrawal[msg.sender] + withdrawalCooldown, "Cooldown active");

    uint256 bonus = referralBonus[msg.sender];

    // Pick the right minimum payout based on current chain
    uint256 floor;
    if (block.chainid == 1 || block.chainid == 11155111) {
        floor = minReferralPayoutEth;
    } else if (block.chainid == 56 || block.chainid == 97) {
        floor = minReferralPayoutBnb;
    } else {
        revert("Unsupported chain");
    }
    require(bonus >= floor, "Below minimum payout");
    require(referralLiability >= bonus, "accounting underflow");

    // Effects
    referralBonus[msg.sender] = 0;
    referralLiability -= bonus;
    lastWithdrawal[msg.sender] = block.timestamp;
    withdrawalHistory[msg.sender].push(WithdrawalRecord({
        amount: bonus,
        timestamp: block.timestamp,
        blockNumber: block.number
    }));
    totalWithdrawn[msg.sender] += bonus;

    // Interaction
    (bool success, ) = msg.sender.call{value: bonus}("");
    require(success, "Referral payout failed");

    emit ReferralWithdrawn(msg.sender, bonus, block.timestamp, totalWithdrawn[msg.sender]);
}

    
   /// @notice Get referrer info
   function getReferrerInfo(address _referrer) external view returns (
    uint256 totalReferrals,
    uint256 pendingCashback,
    uint256 bonusPercentage,
    uint256 nextWithdrawalTime,
    uint256 totalEarned,
    uint256 withdrawalCount
) {
    totalReferrals = referralCounts[_referrer];
    pendingCashback = referralBonus[_referrer];
    bonusPercentage = getReferralBonusPercentage(totalReferrals);
    nextWithdrawalTime = lastWithdrawal[_referrer] + withdrawalCooldown;
    totalEarned = totalWithdrawn[_referrer] + pendingCashback;
    withdrawalCount = withdrawalHistory[_referrer].length;
    }

        /// @notice Global (cross-chain) referral info based on lastGlobalCount (attested)
    function getGlobalReferralInfo(address referrer) external view returns (
        uint256 globalCount,
        uint256 bonusPercentage,
        uint8 tierLevel
    ) {
        globalCount = lastGlobalCount[referrer];
        bonusPercentage = getReferralBonusPercentage(globalCount);
        tierLevel = _tierLevel(globalCount);
    }

    /// @notice Emergency withdrawal for owner (in case of stuck referral funds)
    function emergencyWithdrawReferralFunds() external onlyOwner nonReentrant whenPaused {
    uint256 bal = address(this).balance;
    require(bal > referralLiability, "no excess");
    uint256 amount = bal - referralLiability;
    (bool ok, ) = payable(owner()).call{value: amount}("");
    require(ok, "Emergency withdrawal failed");
    emit FundsWithdrawn(owner(), amount);
    }

    // New view functions for withdrawal history
    function getWithdrawalHistory(address _user) external view returns (WithdrawalRecord[] memory) {
    return withdrawalHistory[_user];
    }

    function getWithdrawalCount(address _user) external view returns (uint256) {
    return withdrawalHistory[_user].length;
   }

    function getLatestWithdrawal(address _user) external view returns (WithdrawalRecord memory) {
    require(withdrawalHistory[_user].length > 0, "No withdrawals");
    return withdrawalHistory[_user][withdrawalHistory[_user].length - 1];
   }

    function getWithdrawalsPaginated(
    address _user, 
    uint256 _offset, 
    uint256 _limit
) external view returns (WithdrawalRecord[] memory) {
    WithdrawalRecord[] storage userHistory = withdrawalHistory[_user];
    require(_offset < userHistory.length, "Offset out of bounds");
    
    uint256 end = _offset + _limit;
    if (end > userHistory.length) {
        end = userHistory.length;
    }
    
    WithdrawalRecord[] memory result = new WithdrawalRecord[](end - _offset);
    for (uint256 i = _offset; i < end; i++) {
        result[i - _offset] = userHistory[i];
    }
    
    return result;
    }   

}


