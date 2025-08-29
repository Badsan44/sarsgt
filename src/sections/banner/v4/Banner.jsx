import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import SemiCircleProgress from "../../../components/progressbar/semiCircle/SemiCircleProgress";
import PayWith from "../../../components/payWith/PayWith";
import BannerData from "../../../assets/data/bannerV4";
import { usePresaleData } from "../../../utils/PresaleContext";

const Banner = () => {
  const { stageEnd, goalToken, raisedToken, tokenPercent } = usePresaleData();

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="mb-40 text-center">
              <h1 className="banner-title mb-20">{BannerData.title}</h1>
              <h5 className="ff-outfit text-white mb-20">
                {BannerData.subtitle}
              </h5>

              <div className="mb-20 d-flex justify-content-center">
                <Countdown endDate={stageEnd} font="title" />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="mb-50">
              <SemiCircleProgress
                percentage={tokenPercent}
                tokenSold={raisedToken}
                presaleToken={goalToken}
              />
            </div>

            <PayWith variant="v2" />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
