import BannerData from "../../../assets/data/bannerV10";
import Button from "../../../components/button/Button";
import Countdown from "../../../components/countdown/Countdown";
import Dropdown from "../../../components/dropdown/Dropdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import TokenInfo from "../../../components/tokenInfo/TokenInfo";
import BannerWrapper from "./Banner.style";
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
    raisedToken,
    goalToken,
    tokenPercent,
    paymentUsd,
    paymentAmount,
    totalAmount,
    presaleStatus,
    handlePaymentInput,
    buyToken,
  } = usePresaleData();

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="text-center text-white mb-40">
              <div className="mb-30">
                <h1 className="banner-title">
                  {BannerData.title}
                  <img src={BannerData.titleImg} alt="icon" />
                  {BannerData.titleExtra}
                </h1>
                <h2 className="banner-title-extra">{BannerData.titleLine}</h2>
              </div>
              <h5 className="banner-subtitle">
                {BannerData.subtitle}
                <br />
                {BannerData.subtitleExtra}
              </h5>
            </div>
          </div>
          <div className="col-md-12">
            <div className="gittu-banner-card">
              <div className="gittu-banner-card-left">
                <div className="presale-top">
                  <h5 className="fs-700 text-white text-uppercase">
                    Sale ends in
                  </h5>
                  <Countdown endDate={stageEnd} size="medium" />
                </div>

                <div className="gittu-banner-card-left-content">
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-10">
                    <h5 className="fw-600 text-uppercase text-white">
                      Stage {currentStage} : {currentBonus}% Bonus !
                    </h5>
                    <h5 className="fw-600 text-uppercase text-white">
                      {raisedToken} / {goalToken}
                    </h5>
                  </div>

                  <div className="mb-20">
                    <Progressbar done={tokenPercent} variant="green" />
                  </div>

                  <TokenInfo />
                </div>
              </div>
              <div className="gittu-banner-card-right">
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
                      value={totalAmount}
                      disabled
                    />
                  </div>
                </div>

                <div className="presale-item-msg">
                  {presaleStatus && (
                    <div className="presale-item-msg__content">
                      <img src={StatusIcon} alt="icon" />
                      <p>{presaleStatus}</p>
                    </div>
                  )}
                </div>

                <Button variant="green" onClick={buyToken}>
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
