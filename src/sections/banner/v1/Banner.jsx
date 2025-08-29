import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import BannerData from "../../../assets/data/bannerV1";
import FooterSocialLinks from "../../../assets/data/footerSocialLinks";
import { usePresaleData } from "../../../utils/PresaleContext";
import { usePresaleModal } from "../../../utils/ModalContext";

const Banner = () => {
  const {
    currentStage,
    currentBonus,
    currentPrice,
    stageEnd,
    nextPrice,
    tokenSymbol,
    goalToken,
    raisedToken,
    tokenPercent,
  } = usePresaleData();

  const { isModalOpen, modalHandle } = usePresaleModal();

  return (
    <>
      <BannerWrapper>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mb-40 text-center">
                <div className="mb-20">
                  <h5 className="ff-outfit fw-600 text-white text-uppercase">
                    {BannerData.presaleStatus}
                  </h5>
                </div>
                <div className="mb-20 d-flex justify-content-center">
                  <Countdown endDate={stageEnd} font="orbitron" />
                </div>
                <div className="mb-20">
                  <h1 className="banner-title">
                    {BannerData.title}
                    <br />
                    {BannerData.title2}
                  </h1>
                </div>
                <h5 className="ff-outfit text-white">{BannerData.subtitle}</h5>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="mb-2 d-flex align-items-center justify-content-between gap-1 flex-wrap">
                <h5 className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  Stage {currentStage} : {currentBonus}% Bonus !
                </h5>
                <h5 className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  {raisedToken} / {goalToken}
                </h5>
              </div>

              <div className="mb-30">
                <Progressbar done={tokenPercent} variant="dashed" />
              </div>

              <div className="mb-30 text-center">
                <p className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  1 {tokenSymbol} = {currentPrice} USD
                </p>

                <p className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  NEXT STAGE = {nextPrice} USD
                </p>
              </div>

              <div className="mb-74 d-flex align-items-center justify-content-center">
                <Button variant="gradient" onClick={modalHandle}>
                  Buy now
                </Button>
              </div>

              <ul className="social-links">
                {FooterSocialLinks?.map((socialLinkItem, i) => (
                  <li key={i}>
                    <a
                      href={socialLinkItem.title}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={socialLinkItem.icon}
                        alt={socialLinkItem.title}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </BannerWrapper>

      {/* buy now modal */}
      {isModalOpen && <Modal />}
    </>
  );
};

export default Banner;
