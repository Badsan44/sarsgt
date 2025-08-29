import KolQuestInfoWrapper from "./KolQuestInfo.style";

// Import your custom highlight icons
import GrowthIcon from "../../assets/images/icons/rewards.png";
import RewardsIcon from "../../assets/images/icons/growth.png";
import SupportIcon from "../../assets/images/icons/support.png";
import FollowersIcon from "../../assets/images/icons/followers.png";
import EngagementIcon from "../../assets/images/icons/engagement.png";
import Patriotic2con from "../../assets/images/icons/patriotic2.png";
import CommitmentIcon from "../../assets/images/icons/commitment.png"

const KolQuestInfo = () => {
  return (
    <KolQuestInfoWrapper id="kol-quest-info">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="info-title">Why Join the KOL Quest?</h2>
            <p className="info-subtitle">
              Become part of the most patriotic crypto movement and earn exclusive rewards while building your influence.
            </p>

            <div className="info-content-wrapper">
              <div className="info-card">
                <img src={GrowthIcon} alt="Exclusive Rewards" className="card-icon" />
                <h3>Exclusive Rewards</h3>
                <p>
                  Earn $BNBMAGA tokens, exclusive NFTs, and special bonuses based on your performance and engagement. 
                  Top performers receive additional perks and recognition within our community.
                </p>
              </div>

              <div className="info-card">
                <img src={RewardsIcon} alt="Growth Opportunities" className="card-icon" />
                <h3>Growth Opportunities</h3>
                <p>
                  Expand your reach and grow your following by being associated with one of the most talked-about 
                  crypto projects. Access to exclusive content and early announcements to share with your audience.
                </p>
              </div>

              <div className="info-card">
                <img src={SupportIcon} alt="Community Support" className="card-icon" />
                <h3>Community Support</h3>
                <p>
                  Join a network of like-minded influencers and crypto enthusiasts. Get support from our team, 
                  access to marketing materials, and collaboration opportunities with other KOLs.
                </p>
              </div>
            </div>

            <div className="requirements-section">
              <h3 className="requirements-title">Requirements</h3>
              <div className="requirements-grid">
                <div className="requirement-item">
                  <img src={FollowersIcon} alt="Followers" className="req-icon" />
                  <span className="req-text">Minimum 1,000 followers on X (Twitter)</span>
                </div>
                <div className="requirement-item">
                  <img src={EngagementIcon} alt="Engagement" className="req-icon" />
                  <span className="req-text">Active engagement with crypto/political content</span>
                </div>
                <div className="requirement-item">
                  <img src={Patriotic2con} alt="Patriotic" className="req-icon" />
                  <span className="req-text">Alignment with patriotic values</span>
                </div>
                <div className="requirement-item">
                  <img src={CommitmentIcon} alt="Commitment" className="req-icon" />
                  <span className="req-text">Commitment to authentic promotion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KolQuestInfoWrapper>
  );
};

export default KolQuestInfo;