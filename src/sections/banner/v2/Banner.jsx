import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import BannerData from "../../../assets/data/bannerV2";
import CoinImg from "../../../assets/images/banner/coin.svg";
import PresaleImg from "../../../assets/images/banner/presale.png";
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
        <div className="gittu-container">
          <div className="gittu-row align-items-center justify-content-between">
            <div className="gittu-col-left">
              <div className="banner-left">
                <div className="banner-header mb-45">
                  <h2 className="banner-title ff-orbitron">
                    {BannerData.title}
                    <img src={BannerData.titleImg} alt="title image" />
                  </h2>
                  <h2 className="banner-title ff-orbitron">
                    <span>{BannerData.titleExtra1}</span>
                    {BannerData.titleExtra2}
                    <img src={BannerData.titleImg2} alt="title image" />
                    {BannerData.titleExtra3}
                  </h2>
                  <h5 className="mt-15 ff-outfit text-white">
                    {BannerData.subtitle}
                  </h5>
                </div>
                <div className="banner-body">
                  <div className="stage-info mb-10">
                    <h5 className="ff-orbitron">
                      Stage {currentStage} : {currentBonus}% Bonus !
                    </h5>
                    <h5 className="ff-orbitron">
                      {raisedToken} / {goalToken}
                    </h5>
                  </div>
                  <div className="mb-30">
                    <Progressbar done={tokenPercent} variant="dashed2" />
                  </div>

                  <ul className="ff-outfit text-white mb-50">
                    <li>
                      1 {tokenSymbol} = {currentPrice} USD
                    </li>
                    <li>NEXT STAGE = {nextPrice} USD</li>
                  </ul>

                  <Button variant="gradient2" onClick={modalHandle}>
                    Buy now
                  </Button>
                </div>
              </div>
            </div>
            <div className="gittu-col-right">
              <div className="banner-right">
                <div className="banner-right-img">
                  <div className="overlay-img">
                    <img src={CoinImg} alt="coin" />
                  </div>
                  <img src={PresaleImg} alt="banner image" />
                </div>
                <div className="presale-card">
                  <div className="presale-card-header">
                    <h5 className="ff-outfit mb-10">Pre-Sale ends in</h5>
                    <Countdown endDate={stageEnd} font="orbitron" />
                  </div>

                  <ul className="social-links">
                    {BannerData.socialLinks?.map((item, i) => (
                      <li key={i}>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          <img src={item.icon} alt={item.title} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>

      {/* buy now modal */}
      {isModalOpen && <Modal variant="v2" />}
    </>
  );
};

export default Banner;
