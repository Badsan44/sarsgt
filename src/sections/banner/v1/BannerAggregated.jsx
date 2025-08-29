import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import BannerData from "../../../assets/data/bannerV1";
import FooterSocialLinks from "../../../assets/data/footerSocialLinks";
import { useAggregatedPresaleData } from "../../../utils/AggregatedPresaleContextProvider";
import { usePresaleModal } from "../../../utils/ModalContext";

const BannerAggregated = () => {
  const {
    currentStage,
    currentBonus,
    currentPrice,
    stageEnd,
    nextPrice,
    totalSupply,
    totalSold,
    totalPercent,
    formattedTotalSupply,
    formattedTotalSold,
    currentStageSupply,
    currentStageProgress,
    soldInCurrentStage,
    remainingInCurrentStage,
    formattedCurrentStageSupply,
    formattedSoldInCurrentStage,
    formattedRemainingInCurrentStage,
    formattedCurrentStageSupplyFull,
    formattedSoldInCurrentStageFull,
    formattedTotalSupplyFull,
    formattedTotalSoldFull,
    isCurrentStageComplete,
    networks,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    walletData,
    getStageProgress,
    getOverallProgress
  } = useAggregatedPresaleData();

  const { isModalOpen, modalHandle } = usePresaleModal();

  // Handle refresh button click
  const handleRefresh = () => {
    refreshData();
  };

  // Show loading state
  if (isLoading) {
    return (
      <BannerWrapper>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center">
                <h5 className="ff-outfit fw-600 text-white">Loading presale data...</h5>
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>
    );
  }

  // Show error state
  if (error) {
    return (
      <BannerWrapper>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center">
                <h5 className="ff-outfit fw-600 text-white mb-3">Error loading presale data</h5>
                <p className="text-white mb-3">{error}</p>
                <Button variant="gradient" onClick={handleRefresh}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>
    );
  }

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
              {/* Stage and Progress Info */}
              <div className="mb-2 d-flex align-items-center justify-content-between gap-1 flex-wrap">
                <h5 className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  Stage {currentStage} : {currentBonus}% Bonus !
                </h5>
                <h5 className="ff-orbitron fs-15 fw-600 text-white text-uppercase mb-1">
                  {formattedSoldInCurrentStageFull} / {formattedCurrentStageSupplyFull}
                </h5>
              </div>

              {/* Progress Bar - Shows current stage progress */}
              <div className="mb-35">
                <Progressbar done={currentStageProgress} variant="dashed" />
              </div>

              {/* Overall Progress Info */}
              <div className="mb-20 text-center">
                <p className="ff-orbitron fs-12 fw-600 text-white text-uppercase opacity-75">
                  Overall Progress: {formattedTotalSoldFull} / {formattedTotalSupplyFull} ({getOverallProgress().toFixed(1)}%)
                </p>
                {isCurrentStageComplete && (
                  <p className="ff-orbitron fs-11 fw-600 text-success text-uppercase">
                    🎉 Stage {currentStage} Complete! Moving to Stage {currentStage + 1}
                  </p>
                )}
              </div>

              {/* Network Breakdown */}
              <div className="mb-20">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="network-stats">
                      <h6 className="ff-orbitron fs-12 fw-600 text-white text-uppercase mb-1">
                        ETH Network
                      </h6>
                      <p className="ff-orbitron fs-11 text-white mb-1">
                        Sold: {networks.ETH.totalSold.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="network-stats">
                      <h6 className="ff-orbitron fs-12 fw-600 text-white text-uppercase mb-1">
                        BNB Network
                      </h6>
                      <p className="ff-orbitron fs-11 text-white mb-1">
                        Sold: {networks.BNB.totalSold.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="mb-30 text-center">
                <p className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  1 {walletData?.tokenSymbol || 'TOKEN'} = {currentPrice} USD
                </p>

                <p className="ff-orbitron fs-15 fw-600 text-white text-uppercase">
                  NEXT STAGE = {nextPrice} USD
                </p>
              </div>

              {/* Buy Button */}
              <div className="mb-20 d-flex align-items-center justify-content-center">
                <Button variant="gradient" onClick={modalHandle}>
                  Buy now
                </Button>
              </div>

              {/* Last Updated Info */}
              {lastUpdated && (
                <div className="mb-20 text-center">
                  <p className="ff-orbitron fs-11 text-white opacity-75">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    className="mt-2"
                  >
                    Refresh Data
                  </Button>
                </div>
              )}

              {/* Social Links */}
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

export default BannerAggregated;