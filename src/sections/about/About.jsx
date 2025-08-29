import AboutWrapper from "./About.style";

const About = () => {
  return (
    <AboutWrapper id="about">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="about-title">About Our Project</h2>
            <p className="about-subtitle">
              Learn more about our revolutionary blockchain solution that merges the nostalgic charm of Studio Ghibli with cutting-edge AI technology.
            </p>

            <div className="about-content-wrapper">
              <div className="about-card">
                <h3>Vision</h3>
                <p>
                  To pioneer the "Ghibli-Fi" movement—a fusion of Studio Ghibli’s artistry, decentralized finance,
                  and AI-powered utility empowering users worldwide.
                </p>
              </div>

              <div className="about-card">
                <h3>Mission</h3>
                <p>
                • Reward community engagement with AI-optimized incentives.<br />
                • Democratize access to meme creation and NFT art.<br />
                • Ensure fairness and transparency through algorithmic governance.
                </p>
              </div>

              <div className="about-card">
                <h3>Core AI Utilities</h3>
                <p>
                • AI-Generated Meme & Art Engine.<br />
                • AI Staking with Dynamic Rewards<br />
                • AI-Driven Airdrop & KOL Selection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AboutWrapper>
  );
};

export default About;
