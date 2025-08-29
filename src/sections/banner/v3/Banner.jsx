import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import PayWith from "../../../components/payWith/PayWith";
import BannerData from "../../../assets/data/bannerV3";
import { usePresaleData } from "../../../utils/PresaleContext";

const Banner = () => {
  const {
    currentStage,
    currentBonus,
    stageEnd,
    goalToken,
    raisedToken,
    tokenPercent,
  } = usePresaleData();

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="mb-40 text-center">
              <h5 className="ff-outfit fw-600 text-white text-uppercase">
                {BannerData.presaleStatus}
              </h5>

              <div className="mb-20 d-flex justify-content-center">
                <Countdown endDate={stageEnd} font="title" />
              </div>
              <h1 className="banner-title">
                {BannerData.title} <span>{BannerData.title2}</span>{" "}
                {BannerData.title3}
              </h1>
              <h5 className="ff-outfit text-white">{BannerData.subtitle}</h5>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-20 d-flex align-items-center justify-content-between gap-1 flex-wrap">
              <h5 className="ff-outfit fs-15 fw-600 text-white text-uppercase">
                Stage {currentStage} : {currentBonus}% Bonus !
              </h5>
              <h5 className="ff-outfit fs-15 fw-600 text-white text-uppercase">
                {raisedToken} / {goalToken}
              </h5>
            </div>

            <div className="mb-50">
              <Progressbar done={tokenPercent} variant="dashed3" />
            </div>

            <PayWith variant="v1" />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
