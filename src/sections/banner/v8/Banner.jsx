import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import DocumentIcon from "../../../assets/images/icons/document-text.svg";
import Whitepaper from "../../../assets/pdf/Whitepaper.pdf";
import TokenInfo from "../../../components/tokenInfo/TokenInfo";
import PayWith from "../../../components/payWith/PayWith";
import CircleProgressbar from "../../../components/progressbar/circleProgress/CircleProgressbar";
import BannerData from "../../../assets/data/bannerV8";
import { usePresaleData } from "../../../utils/PresaleContext";

const Banner = () => {
  const { currentStage, stageEnd, goalToken, raisedToken, tokenPercent } = usePresaleData();

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-6">
            <div className="banner-badge">
              <h4>New</h4>
              <p>{BannerData.status}</p>
            </div>
            <h1 className="banner-title">
              {BannerData.title}
              <br />
              {BannerData.title2}
            </h1>
            <h4 className="banner-subtitle">{BannerData.subtitle}</h4>

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
          <div className="col-lg-5">
            <div className="progress-card">
              <div className="d-flex justify-content-center">
                <CircleProgressbar percentage={tokenPercent} />
              </div>

              <div className="d-flex justify-content-between">
                <div className="progress-info">
                  <h5>Raised</h5>
                  <h5>{raisedToken}</h5>
                </div>
                <div className="progress-info right">
                  <h5>Goal</h5>
                  <h5>{goalToken}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="presale-card-wrapper">
              <div className="presale-card">
                <div className="presale-card-left">
                  <div className="presale-card-title">
                    <p>Presale stage {currentStage}</p>
                  </div>

                  <div className="presale-card-counter">
                    <Countdown endDate={stageEnd} variant="v2" />
                  </div>

                  <TokenInfo variant="v2" />
                </div>
                <div className="presale-card-right">
                  <PayWith variant="v4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
