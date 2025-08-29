import PayWithStyleWrapper from "./PayWith.style";
import StatusIcon from "../../assets/images/icons/status.png";
import UsdtIcon from "../../assets/images/token/usdt.png";
import Dropdown from "./Dropdown/Dropdown";
import InlineReferralGenerator from "../referral/InlineReferralGenerator";
import { usePresaleData } from "../../utils/PresaleContext";
import { useEffect } from "react";

const PayWith = ({ variant }) => {
  const {
    handleBuyOn,
    setIsActiveBuyOnEth,
    setIsActiveBuyOnBnb,
    switchChain,
    buyOnItem,
    buyOnText,
    buyOnIcon,
    selectedImg,
    payWithText,
    titleText,
    bnbChainId,
    ethChainId,
    currentPrice,
    tokenSymbol,
    paymentAmount,
    totalAmount,
    presaleStatus,
    makeEmptyInputs,
    handlePaymentInput,
    buyToken,
    getCurrentStagePrice,
  } = usePresaleData();
  
  // Get current stage price when component mounts and set up interval to check for changes
  useEffect(() => {
    // Get price immediately when component mounts
    getCurrentStagePrice();
    
    // Set up interval to check for price changes
    const priceCheckInterval = setInterval(() => {
      getCurrentStagePrice();
    }, 30000); // Check every 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(priceCheckInterval);
  }, []);

  return (
    <PayWithStyleWrapper variant={variant}>
      {variant === "v1" && (
        <div className="mb-20 text-center">
          <h4 className="ff-title fw-600 text-white text-uppercase">
            1 {tokenSymbol.toUpperCase()} = {currentPrice}
          </h4>
        </div>
      )}

      <div className="pay-with-content">
        <div className="pay-with-content-left">
          {(variant === "v1" || variant === "v2" || variant === "v3") && (
            <>
              <div className="price-display-box">
                <span><span style={{color: 'white'}}>1</span> ${tokenSymbol.toUpperCase()} = {currentPrice} <img src={UsdtIcon} alt="USDT" className="usdt-icon" /></span>
              </div>
              <ul className="pay-with-list">
                <li>
                  <button className="active">
                    <img src={selectedImg} alt="icon" />
                  </button>
                </li>
              </ul>
            </>
          )}

          {variant === "v4" && (
            <Dropdown
              variant="v2"
              selectedImg={selectedImg}
              titleText={titleText}
              setIsActiveBuyOnEth={setIsActiveBuyOnEth}
              setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
              switchChain={switchChain}
              makeEmptyInputs={makeEmptyInputs}
              ethChainId={ethChainId}
              bnbChainId={bnbChainId}
            />
          )}
          {variant === "v5" && (
            <Dropdown
              variant="v3"
              selectedImg={selectedImg}
              titleText={titleText}
              setIsActiveBuyOnEth={setIsActiveBuyOnEth}
              setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
              switchChain={switchChain}
              makeEmptyInputs={makeEmptyInputs}
              ethChainId={ethChainId}
              bnbChainId={bnbChainId}
            />
          )}
          {variant === "v6" && (
            <Dropdown
              variant="v4"
              selectedImg={selectedImg}
              titleText={titleText}
              setIsActiveBuyOnEth={setIsActiveBuyOnEth}
              setIsActiveBuyOnBnb={setIsActiveBuyOnBnb}
              switchChain={switchChain}
              makeEmptyInputs={makeEmptyInputs}
              ethChainId={ethChainId}
              bnbChainId={bnbChainId}
            />
          )}
        </div>

        {variant === "v2" && (
          <div className="pay-with-content-middle">
            <h4 className="ff-title fw-600 text-white text-uppercase">
              1 {tokenSymbol.toUpperCase()} = {currentPrice} USD
            </h4>
          </div>
        )}

        {variant === "v3" && (
          <div className="pay-with-content-middle">
            <h4 className="ff-title2 fw-400 text-white text-uppercase">
              1 {tokenSymbol.toUpperCase()} = {currentPrice} USD
            </h4>
          </div>
        )}

        <div className="pay-with-content-right">
          {(variant === "v1" || variant === "v2" || variant === "v3") && (
            <button
              className="pay-with-button"
              onClick={() => handleBuyOn(buyOnItem)}
            >
              {buyOnText}
              <img src={buyOnIcon} alt="icon" />
            </button>
          )}

          {(variant === "v4" || variant === "v5" || variant === "v6") && (
            <div className="pay-with-content-left">
              <div className="price-display-box">
                <span><span style={{color: 'white'}}>1</span> ${tokenSymbol.toUpperCase()} = {currentPrice} <img src={UsdtIcon} alt="USDT" className="usdt-icon" /></span>
              </div>
              <ul className="pay-with-list">
                <li>
                  <button className="active">
                    <img src={selectedImg} alt="icon" />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <form action="/" method="post">
        <div className="presale-item mb-30">
          <div className="presale-item-inner">
            <label>Pay with {payWithText}</label>
            <input
              type="number"
              placeholder="0"
              value={paymentAmount}
              onChange={handlePaymentInput}
            />
          </div>
          <div className="presale-item-inner">
            <label>Get BNBMAGA</label>
            <input type="number" placeholder="0" value={totalAmount} disabled />
          </div>
        </div>
      </form>

      <div className="presale-item-msg">
        {presaleStatus && (
          <div className="presale-item-msg__content">
            <img src={StatusIcon} alt="icon" />
            <p>{presaleStatus}</p>
          </div>
        )}
      </div>

      <button className="presale-item-btn" onClick={buyToken}>
        Buy now
      </button>
      
      <InlineReferralGenerator />
      
      <div className="presale-item-notification">
        <p><span className="exclamation-mark">!</span> Bonus decreases with every stage.</p>
      </div>
    </PayWithStyleWrapper>
  );
};

export default PayWith;
