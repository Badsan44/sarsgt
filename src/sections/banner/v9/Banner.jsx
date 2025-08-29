import { useState, useEffect } from "react";
import BannerWrapper from "./Banner.style";
import DocumentIcon from "../../../assets/images/icons/document-text.svg";
import PresaleLiveTextIcon from "../../../assets/images/icons/presale-live-text.svg";
import Abstrac1 from "../../../assets/images/banner/abstrac-1.png";
import Abstrac2 from "../../../assets/images/banner/abstrac-2.png";
import { FiArrowDownRight } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi2";
import Whitepaper from "../../../assets/pdf/Whitepaper.pdf";
import Button from "../../../components/button/Button";
import SmoothSlider from "../../../components/smooth-slider/SmoothSlider";
import Progressbar from "../../../components/progressbar/Progressbar";
import Countdown from "../../../components/countdown/Countdown";
import Dropdown from "../../../components/dropdown/Dropdown";
import BannerData from "../../../assets/data/bannerV9";
import TokenInfo from "../../../components/tokenInfo/TokenInfo";
import StatusIcon from "../../../assets/images/icons/status.png";
import { usePresaleData } from "../../../utils/PresaleContext";

const Banner = () => {
  const {
    userBalance,
    userTokenBalance,
    selectedImg,
    payWithText,
    currentStage,
    currentBonus,
    currentPrice,
    stageEnd,
    tokenSymbol,
    goalToken,
    raisedToken,
    tokenPercent,
    paymentUsd,
    paymentAmount,
    buyAmount,
    bonusAmount,
    presaleStatus,
    handlePaymentInput,
    buyToken,
  } = usePresaleData();

  const [isBuyNow, setIsBuyNow] = useState(false);

  const buyNowHandle = () => {
    setIsBuyNow(!isBuyNow);
  };

  const [softCap, setSoftCap] = useState("10 ETH");
  const [hardCap, setHardCap] = useState("40 ETH");

  useEffect(() => {
    if (isBuyNow) {
      document.querySelector(".gittu-banner-card").classList.add("flip");
    }

    if (!isBuyNow) {
      document.querySelector(".gittu-banner-card").classList.remove("flip");
    }
  }, [isBuyNow]);

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="gittu-banner-left">
              <h1 className="banner-title">{BannerData.title}</h1>
              <h2 className="text-white">{BannerData.titleExtra}</h2>
              <h5 className="mt-15">{BannerData.subtitle}</h5>

              <div className="mt-40 mb-40">
                <a
                  className="whitepaper-btn"
                  href={Whitepaper}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={DocumentIcon} alt="icon" />
                  Whitepaper
                </a>
              </div>

              <ul className="gittu-banner-list">
                <li>Total Supply: {goalToken}</li>
                <li>Soft Cap: {softCap}</li>
                <li>Hard Cap: {hardCap}</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="gittu-banner-right">
              <div className="overlay">
                <a href="#" className="presale-live-btn">
                  <img src={PresaleLiveTextIcon} alt="Presale live" />
                  <span className="icon">
                    <FiArrowDownRight />
                  </span>
                </a>
              </div>
              <div className="gittu-banner-card">
                <div className="gittu-banner-card-inner">
                  <div className="bg-shape">
                    <div className="bg-shape-img img-1">
                      <img src={Abstrac1} alt="shape" />
                    </div>
                    <div className="bg-shape-img img-2">
                      <img src={Abstrac2} alt="shape" />
                    </div>
                  </div>

                  {isBuyNow ? (
                    <div className="card-content">
                      <button
                        className="presale-back-btn"
                        onClick={buyNowHandle}
                      >
                        <HiArrowLeft />
                      </button>

                      <div className="presale-item mb-20">
                        <div className="presale-item-inner">
                          <h5 className="fw-600 text-uppercase text-white">
                            Balance: {userBalance}
                          </h5>
                        </div>
                        <div className="presale-item-inner">
                          <h5 className="fw-600 text-uppercase text-white">
                            Balance: {userTokenBalance} {tokenSymbol}
                          </h5>
                        </div>
                      </div>

                      <div className="presale-item mb-25">
                        <div className="presale-item-inner">
                          <h6>Select Token</h6>
                          <Dropdown
                            selectedImg={selectedImg}
                            payWithText={payWithText}
                          />
                        </div>
                        <div className="presale-item-inner">
                          <h6>Amount</h6>

                          <input
                            type="number"
                            min={currentPrice}
                            step={currentPrice}
                            placeholder="0.5"
                            value={paymentAmount}
                            onChange={handlePaymentInput}
                          />
                        </div>
                      </div>

                      <div className="presale-item mb-37">
                        <div className="presale-item-inner">
                          <h6>$ Amount</h6>

                          <input
                            type="text"
                            placeholder="0"
                            value={paymentUsd}
                            disabled
                          />
                        </div>
                        <div className="presale-item-inner">
                          <h6>Get Amount ( {tokenSymbol} )</h6>
                          <input
                            type="text"
                            placeholder="0"
                            value={buyAmount}
                            disabled
                          />
                        </div>
                      </div>

                      <ul className="token-info-list mb-35">
                        <li>
                          <p>Bonus</p>
                          <p>{currentBonus}%</p>
                        </li>
                        <li>
                          <p>Total Amount</p>
                          <p>
                            {buyAmount} + {bonusAmount} Bonus
                          </p>
                        </li>
                      </ul>

                      <div className="presale-item-msg">
                        {presaleStatus && (
                          <div className="presale-item-msg__content">
                            <img src={StatusIcon} alt="icon" />
                            <p>{presaleStatus}</p>
                          </div>
                        )}
                      </div>

                      <Button size="large" onClick={buyToken}>
                        Buy Now
                      </Button>
                    </div>
                  ) : (
                    <div className="card-content">
                      <p className="presale-stage-title text-uppercase">
                        Stage {currentStage}: {currentBonus}% Bonus!
                      </p>
                      <h5 className="fw-600 text-white text-uppercase">
                        Pre-sale ends in
                      </h5>

                      <div className="mt-1 mb-17">
                        <Countdown endDate={stageEnd} />
                      </div>

                      <div className="mb-15">
                        <Progressbar done={tokenPercent} />
                      </div>

                      <div className="presale-raised fw-500 mb-25">
                        <p className="fs-15 text-white">
                          Raised: {raisedToken}
                        </p>
                        <p className="fs-15 text-white">Goal: {goalToken}</p>
                      </div>

                      <div className="mb-35">
                        <TokenInfo />
                      </div>

                      <Button size="large" onClick={buyNowHandle}>
                        Buy {tokenSymbol} now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gittu-banner-slider">
        <SmoothSlider />
      </div>
    </BannerWrapper>
  );
};

export default Banner;
