import KolQuestBannerWrapper from "./KolQuestBanner.style";

// Import your custom highlight icons
import RocketIcon from "../../assets/images/icons/reward1.png";
import FlagIcon from "../../assets/images/icons/patriotic.png";
import MoneyIcon from "../../assets/images/icons/earning.png";

const KolQuestBanner = () => {
  return (
    <KolQuestBannerWrapper id="kol-quest-banner">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="kol-quest-banner-content">
              <h1 className="kol-quest-title">KOL Quest</h1>
              <h2 className="kol-quest-subtitle">
                Join the $BNBMAGA Collaboration Campaign
              </h2>
              <p className="kol-quest-description">
                Are you a crypto influencer ready to make America great again? 
                Join our exclusive KOL Quest program and become part of the $BNBMAGA revolution. 
                Earn rewards while promoting the future of patriotic cryptocurrency.
              </p>

              <div className="kol-quest-highlights">
                <div className="highlight-item">
                  <img src={RocketIcon} alt="Exclusive Rewards" className="highlight-icon" />
                  <span className="highlight-text">Exclusive Rewards</span>
                </div>
                <div className="highlight-item">
                  <img src={FlagIcon} alt="Patriotic Community" className="highlight-icon" />
                  <span className="highlight-text">Patriotic Community</span>
                </div>
                <div className="highlight-item">
                  <img src={MoneyIcon} alt="High Earning Potential" className="highlight-icon" />
                  <span className="highlight-text">High Earning Potential</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </KolQuestBannerWrapper>
  );
};

export default KolQuestBanner;
