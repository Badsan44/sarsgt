import { useEffect, useState } from "react";
import { PresaleContext } from "./PresaleContext";
import Notification from "../components/notification/Notification";
import { useAggregatedPresaleData } from "./AggregatedPresaleContextProvider";
import { chainInfo, chainConfig } from "../contracts/chainConfig";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { formatEther, formatUnits, parseEther } from "viem";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PropTypes from "prop-types";
import { getReferrerForPurchase, processReferralFromURL } from "./referralManager";
import { prepareAttestedBuyTokenCall } from "./attestedReferralBuy";

const PresaleContextProvider = ({ children }) => {
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const currentConfig = chainConfig(chainId);
  const [configModule, setConfigModule] = useState(currentConfig.configModule);
  const [buyConfigModule, setBuyConfigModule] = useState(currentConfig.buyConfigModule);

  // Since we now support only the BNB testnet, we use the only entry from chainInfo.
  const ethChainId = chainInfo.find((c) => c.payWith === "ETH").chainId;
  const bnbChainId = chainInfo.find((c) => c.payWith === "BNB").chainId;

  // For network-related UI, we keep a single state for BNB (active by default)
  const [buyOnItem, setBuyOnItem] = useState(currentConfig.buyChainId);
  const [buyOnText, setBuyOnText] = useState(currentConfig.buyTitle);
  const [buyOnIcon, setBuyOnIcon] = useState(currentConfig.buyIcon);
  const [selectedImg, setSelectedImg] = useState(currentConfig.icon);
  const [payWithText, setPayWithText] = useState(currentConfig.payWith);
  const [titleText, setTitleText] = useState(currentConfig.title);
  const [isActiveBuyOnBnb, setIsActiveBuyOnBnb] = useState(true);
  const [isActiveBuyOnEth, setIsActiveBuyOnEth] = useState(false);

  // Network switching logic for BNB and ETH
  const handleBuyOnBnb = () => {
    setIsActiveBuyOnBnb(true);
    setIsActiveBuyOnEth(false);
    switchChain({ chainId: bnbChainId });
    setConfigModule(chainConfig(bnbChainId).configModule);
    setBuyConfigModule(chainConfig(bnbChainId).buyConfigModule);
    setSelectedImg(chainConfig(bnbChainId).icon);
    setPayWithText(chainConfig(bnbChainId).payWith);
    setTitleText(chainConfig(bnbChainId).title);
    makeEmptyInputs();
  };

  const handleBuyOnEth = () => {
    setIsActiveBuyOnBnb(false);
    setIsActiveBuyOnEth(true);
    switchChain({ chainId: ethChainId });
    setConfigModule(chainConfig(ethChainId).configModule);
    setBuyConfigModule(chainConfig(ethChainId).buyConfigModule);
    setSelectedImg(chainConfig(ethChainId).icon);
    setPayWithText(chainConfig(ethChainId).payWith);
    setTitleText(chainConfig(ethChainId).title);
    makeEmptyInputs();
  };

  // Legacy function for backward compatibility
  const handleBuyOn = handleBuyOnBnb;

  // Utility to format numbers
  const formatNumber = (num) => {
    const formattedNumber = num.toFixed(2);
    return formattedNumber.endsWith(".00") ? parseInt(num, 10) : formattedNumber;
  };

  // Variables for user and token state
  const MIN_BNB = 0.001;
  const MIN_ETH = 0.03;

  // Helper function to get minimum amount based on payment method
  const getMinimumAmount = () => {
    return payWithText === "ETH" ? MIN_ETH : MIN_BNB;
  };

  // Helper function to get minimum amount message
  const getMinimumAmountMessage = () => {
    const minAmount = getMinimumAmount();
    const currency = payWithText === "ETH" ? "ETH" : "BNB";
    return `Please buy at least ${minAmount} ${currency}`;
  };
  const [userChainId, setUserChainId] = useState(currentConfig.chainId);
  const [userBalance, setUserBalance] = useState("0");
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [maxStage, setMaxStage] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentBonus, setCurrentBonus] = useState("20");
  const [currentPrice, setCurrentPrice] = useState("0.001");
  const [stageEnd, setStageEnd] = useState(1733996440);
  const [nextStage, setNextStage] = useState(0);
  const [nextPrice, setNextPrice] = useState("0.002");
  const [tokenName, setTokenName] = useState("BNBMAGA TOKEN");
  const [tokenSymbol, setTokenSymbol] = useState("BNBMAGA");
  const [presaleToken, setPresaleToken] = useState(100000);
  const [tokenSold, setTokenSold] = useState(20000);
  const [tokenPercent, setTokenPercent] = useState(20);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenSubDecimals, setTokenSubDecimals] = useState(0);
  const [usdExRate, setUsdExRate] = useState(0);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [paymentPrice, setPaymentPrice] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [presaleStatus, setPresaleStatus] = useState(null);
  const [raisedToken, setRaisedToken] = useState(0);
  const [goalToken, setGoalToken] = useState(0);
  const [currentReferrer, setCurrentReferrer] = useState(null);

  // Switch network hook (if needed)
  const { switchChain } = useSwitchChain();

  // Read user's wallet balance
  const { address: addressData, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address: addressData });

  // Token contract reads
  const { data: tokenNameData } = useReadContract({
    ...configModule.tokenNameCall,
  });
  const { data: tokenSymbolData } = useReadContract({
    ...configModule.tokenSymbolCall,
  });
  const { data: tokenDecimalsData } = useReadContract({
    ...configModule.tokenDecimalsCall,
  });
  const { data: tokenBalanceOfData } = useReadContract({
    ...configModule.tokenBalanceOfCall,
    args: [addressData],
  });

  // Presale contract reads
  const { data: presaleTokenAmountData } = useReadContract({
    ...configModule.presaleTokenAmountCall,
  });
  const { data: totalSoldData } = useReadContract({
    ...configModule.totalSoldCall,
  });
  const { data: maxStageData } = useReadContract({
    ...configModule.maxStageCall,
  });
  const { data: currentStageIdData, refetch: refetchStageId } = useReadContract({
  ...configModule.currentStageIdCall,
  });
    const {
    data: currentStageInfoData,
    refetch: refetchStageInfo
  } = useReadContract({
    ...configModule.currentStageInfoCall,
    args: [currentStageIdData],
  });
  const { data: nextStageInfoData } = useReadContract({
    ...configModule.currentStageInfoCall,
    args: [nextStage],
  });

  const buyPresaleData = useReadContracts({
    contracts: [
      { ...buyConfigModule.tokenDecimalsCall },
      { ...buyConfigModule.presaleTokenAmountCall },
      { ...buyConfigModule.totalSoldCall },
    ],
  });

  const [buyTokenDecimalsData, buyPresaleTokenData, buyTokenSoldData] =
    buyPresaleData.data?.map((item) => item?.result) || [];

  // Buy token write
  const {
    data: buyTokenData,
    writeContract,
    isPending: buyTokenIsLoading,
    isSuccess: buyTokenIsSuccess,
    error: buyTokenError,
  } = useWriteContract();

  // Clear input fields
  const makeEmptyInputs = () => {
    setPaymentAmount(0);
    setBuyAmount(0);
    setBonusAmount(0);
    setTotalAmount(0);
    setPaymentPrice(0);
  };

  // Handle payment input changes
  const handlePaymentInput = (e) => {
    let _inputValue = e.target.value;
    setPaymentAmount(_inputValue);
    const _usdValue = _inputValue * usdExRate;
    const _getToken = parseInt(_usdValue / currentPrice);
    setBuyAmount(_getToken);
    const _bonusAmount = parseInt((_getToken * currentBonus) / 100);
    setBonusAmount(_bonusAmount);
    const _totalAmount = _getToken + _bonusAmount;
    setTotalAmount(_totalAmount);
    setPaymentPrice(_inputValue);

    const _balance = formatUnits(balanceData.value, balanceData.decimals);

    if (_inputValue === "") {
      setPresaleStatus(null);
      setBuyAmount(0);
      setBonusAmount(0);
      setTotalAmount(0);
      setPaymentPrice(0);
    } else if (parseFloat(_balance) < parseFloat(_inputValue)) {
      setPresaleStatus("Insufficient funds in your wallet");
    } else {
      const minAmount = getMinimumAmount();
      if (_inputValue >= minAmount) {
        setPresaleStatus(null);
      } else {
        setPresaleStatus(getMinimumAmountMessage());
        setBuyAmount(0);
        setBonusAmount(0);
        setTotalAmount(0);
        setPaymentPrice(0);
      }
    }
  };

  // Function to execute token purchase
  const buyToken = async () => {
    /* ── 1. User must be connected ─────────────────────────── */
    if (!isConnected) {
      openConnectModal();
      return;                           // stop here until wallet connected
    }
  
    /* ── 2. Wallet balance must be loaded ───────────────────── */
    if (!balanceData) {
      setPresaleStatus("Wallet balance still loading…");
      return;
    }
  
    const walletFloat = parseFloat(
      formatUnits(balanceData.value, balanceData.decimals)
    );
  
    /* ── 3. User must type something ────────────────────────── */
    if (paymentAmount === "") {
      setPresaleStatus("Please enter pay amount!");
      return;
    }
  
    /* ── 4. Basic validations ───────────────────────────────── */
    const minAmount = getMinimumAmount();
    if (parseFloat(paymentAmount) < minAmount) {
      setPresaleStatus(getMinimumAmountMessage());
      return;
    }
  
    if (walletFloat < parseFloat(paymentAmount)) {
      setPresaleStatus("Insufficient funds in your wallet");
      return;
    }
  
    /* ── 5. All good → call the contract ────────────────────── */
    setPresaleStatus(null);
  
    try {
      // Get referrer address for purchase
      const referrerAddress = getReferrerForPurchase();
      const paymentValue = parseEther(paymentPrice.toString());
      
      // Show loading message while preparing attestation
      if (referrerAddress && referrerAddress !== '0x0000000000000000000000000000000000000000') {
        setPresaleStatus("Preparing transaction with referral bonus...");
      }
      
      // Prepare the contract call with attestation if we have a referrer
      const contractCall = await prepareAttestedBuyTokenCall(
        configModule,
        referrerAddress,
        paymentValue,
        chainId
      );
      
      // Clear status before sending transaction
      setPresaleStatus(null);
      
      // Execute the contract call
      writeContract(contractCall);
    } catch (error) {
      console.error("Error preparing purchase:", error);
      setPresaleStatus("Error preparing purchase. Please try again.");
      return;
    }
  
    makeEmptyInputs();                  // clear the form
  };
  

  // Notification handling for token purchase
  const [isActiveNotification, setIsActiveNotification] = useState(false);
  const [notificationDone, setNotificationDone] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // grab the aggregated‐data refresh fn
  const { refreshData } = useAggregatedPresaleData();

  const buyTokenLoadingMsg = (textMsg) => {
    setIsActiveNotification(true);
    setNotificationMsg(textMsg);
  };

  const buyTokenSuccessMsg = () => {
    setNotificationDone(true);
    setNotificationMsg("Your transaction has been successfully completed");
  };

  // Handle loading state
  useEffect(() => {
    if (buyTokenIsLoading) {
      buyTokenLoadingMsg("Transaction Processing. Click 'Confirm'.");
    }
  }, [buyTokenIsLoading]);

  // Handle error state
  useEffect(() => {
    if (buyTokenError) {
      setIsActiveNotification(false);
      setPresaleStatus(buyTokenError?.shortMessage);

      const timeoutId = setTimeout(() => {
        setPresaleStatus(null);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [buyTokenError]);

  // ▶️ NEW: after a successful purchase, just re-fetch totals—no full reload
  useEffect(() => {
    if (buyTokenIsSuccess) {
      buyTokenSuccessMsg();
      refreshData();
      
      // Auto-dismiss the success notification after 3 seconds
      const timeoutId = setTimeout(() => {
        setIsActiveNotification(false);
        setNotificationDone(false);
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [buyTokenIsSuccess, refreshData]);

  // Clear inputs when network or wallet changes
  useEffect(() => {
    makeEmptyInputs();
  }, [userChainId, addressData]);

  // Function to get current stage price from contract
    const getCurrentStagePrice = async () => {
    try {
      // re-run the on-chain calls
      await refetchStageId();
      await refetchStageInfo();

      if (!currentStageInfoData) return null;
      const price = formatEther(currentStageInfoData[2]);
      setCurrentPrice(price.toString());
      return price;
   } catch (error) {
      console.error("Error getting current stage price:", error);
      return null;
    }
  };
  
  // Check for stage changes periodically
  useEffect(() => {
    const checkStageInterval = setInterval(() => {
      getCurrentStagePrice();
    }, 60000); // Check every minute
    
    return () => clearInterval(checkStageInterval);
  }, [configModule]);

  // Update state variables when contract data changes
  useEffect(() => {
    if (chainId) {
      setUserChainId(chainId);
      const config = chainConfig(chainId);
      setConfigModule(config.configModule);
      setBuyConfigModule(config.buyConfigModule);
      setSelectedImg(config.icon);
      setBuyOnItem(config.buyChainId);
      setBuyOnText(config.buyTitle);
      setBuyOnIcon(config.buyIcon);
      setPayWithText(config.payWith);
      setTitleText(config.title);
    }

    if (balanceData) {
      const _value = formatUnits(balanceData.value, balanceData.decimals);
      const _totalDeciNum = _value.split(".")[1]?.length || 0;
      const _fractionalPart = _value.split(".")[1] || "";
      const _match = _fractionalPart.match(/^0+/);
      const _matchZeros = _match ? _match[0].length : 0;
      let _toFixedNum = 0;
      if (_matchZeros > 0) {
        _toFixedNum = _matchZeros + 1;
      } else if (_totalDeciNum >= 1) {
        _toFixedNum = 2;
      } else {
        _toFixedNum = 0;
      }
      const _balance = Number(_value).toFixed(_toFixedNum);
      setUserBalance(`${_balance} ${balanceData.symbol}`);
    }

    if (tokenNameData) {
      setTokenName(tokenNameData);
    }

    if (tokenSymbolData) {
      setTokenSymbol(tokenSymbolData);
    }

    if (tokenDecimalsData) {
      const _subDecimal = 18 - tokenDecimalsData;
      setTokenDecimals(tokenDecimalsData);
      setTokenSubDecimals(_subDecimal);
    }

    if (tokenDecimalsData && tokenBalanceOfData >= 0) {
      const _tmp = formatUnits(tokenBalanceOfData, tokenDecimalsData);
      const _result = Number(_tmp);
      setUserTokenBalance(formatNumber(_result));
    }

    if (presaleTokenAmountData) {
      const tmp = formatEther(presaleTokenAmountData);
      setPresaleToken(tmp / 10 ** tokenSubDecimals);
    }

    if (totalSoldData >= 0) {
      const tmp = formatEther(totalSoldData);
      setTokenSold(tmp / 10 ** tokenSubDecimals);
    }

    if (buyTokenDecimalsData != null
  && buyPresaleTokenData  != null
  && buyTokenSoldData     != null
) {
  const presaleTotal = Number(
    formatUnits(buyPresaleTokenData, buyTokenDecimalsData)
  );
  const soldTotal    = Number(
    formatUnits(buyTokenSoldData,    buyTokenDecimalsData)
  );

  // Don’t add the old state—just take the raw on-chain values:
  setGoalToken(presaleTotal);
  setRaisedToken(soldTotal);
}

    if (maxStageData) {
      setMaxStage(maxStageData.toString());
    }

    if (currentStageIdData) {
      setCurrentStage(currentStageIdData.toString());
      const tmp = parseInt(currentStageIdData);
      setNextStage(tmp + 1);
      if (maxStage < tmp + 1) {
        setNextStage(tmp);
      }
    }

    if (currentStageInfoData) {
      setCurrentBonus(currentStageInfoData[1].toString());
      const tmp = formatEther(currentStageInfoData[2]);
      setCurrentPrice(tmp.toString());
      setStageEnd(currentStageInfoData[4].toString());
    }

    if (nextStageInfoData) {
      const tmp = formatEther(nextStageInfoData[2]);
      setNextPrice(tmp.toString());
    }

    const _tokenPercent = parseInt((raisedToken * 100) / goalToken);
    const _tokenPercentDone = isNaN(_tokenPercent) ? 0 : _tokenPercent;
    setTokenPercent(_tokenPercentDone);
    if (_tokenPercent > 100) {
      setTokenPercent(100);
    }

    configModule.GetUSDExchangeRate().then((res) => {
      setUsdExRate(parseFloat(res));
    });
    const pay = parseFloat(usdExRate * paymentPrice).toFixed(2);
    setPaymentUsd(pay);
  }, [
    chainId,
    configModule,
    tokenNameData,
    tokenSymbolData,
    tokenDecimalsData,
    tokenBalanceOfData,
    presaleTokenAmountData,
    totalSoldData,
    buyTokenDecimalsData,
    buyPresaleTokenData,
    buyTokenSoldData,
    maxStageData,
    currentStageIdData,
    currentStageInfoData,
    nextStageInfoData,
    tokenSold,
    presaleToken,
    maxStage,
    usdExRate,
    paymentPrice,
    raisedToken,
    goalToken,
    tokenSubDecimals,
    balanceData
  ]);

  // Process referral from URL on component mount
  useEffect(() => {
    const processReferral = async () => {
      try {
        const referrer = await processReferralFromURL();
        setCurrentReferrer(referrer);
      } catch (error) {
        console.error('Error processing referral from URL:', error);
        setCurrentReferrer(null);
      }
    };
    
    processReferral();
  }, []);

  return (
    <PresaleContext.Provider value={{
      configModule,
      handleBuyOn,
      handleBuyOnBnb,
      handleBuyOnEth,
      isActiveBuyOnBnb,
      setIsActiveBuyOnBnb,
      isActiveBuyOnEth,
      setIsActiveBuyOnEth,
      switchChain,
      buyOnItem,
      setBuyOnItem,
      buyOnText,
      setBuyOnText,
      buyOnIcon,
      setBuyOnIcon,
      selectedImg,
      setSelectedImg,
      payWithText,
      titleText,
      ethChainId,
      bnbChainId,
      userChainId,
      userBalance,
      userTokenBalance,
      maxStage,
      currentStage,
      currentBonus,
      currentPrice,
      stageEnd,
      nextStage,
      nextPrice,
      tokenName,
      tokenSymbol,
      presaleToken,
      tokenSold,
      raisedToken,
      goalToken,
      tokenPercent,
      tokenDecimals,
      tokenSubDecimals,
      usdExRate,
      paymentUsd,
      paymentPrice,
      paymentAmount,
      buyAmount,
      bonusAmount,
      totalAmount,
      presaleStatus,
      setPresaleStatus,
      makeEmptyInputs,
      handlePaymentInput,
      buyToken,
      buyTokenData,
      buyTokenIsLoading,
      buyTokenIsSuccess,
      buyTokenError,
      getCurrentStagePrice,
      currentReferrer,
      setCurrentReferrer,
    }}>
      {children}
      {isActiveNotification && (
        <Notification
          notificationDone={notificationDone}
          textMessage={notificationMsg}
        />
      )}
    </PresaleContext.Provider>
  );
};

PresaleContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default PresaleContextProvider;
