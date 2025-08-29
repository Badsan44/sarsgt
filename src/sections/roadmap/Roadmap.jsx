import RoadmapWrapper from "./Roadmap.style";

const Roadmap = () => {
  return (
    <RoadmapWrapper id="roadmap">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="roadmap-title">ROADMAP</h2>
            <p className="roadmap-subtitle">
              Our journey follows the golden path to success
            </p>

            <div className="roadmap-timeline">
              <div className="roadmap-container left">
                <div className="roadmap-content">
                  <div className="roadmap-date">Q2 2025</div>
                  <div className="roadmap-phase">Phase 1: Foundation</div>
                  <ul>
                    <li>Project conceptualization and team formation</li>
                    <li>Whitepaper and technical documentation finalization</li>
                    <li>Smart contract development and security audit</li>
                    <li>Website and brand identity launch</li>
                    <li>Community building across social media platforms</li>
                  </ul>
                </div>
              </div>

              <div className="roadmap-container right">
                <div className="roadmap-content">
                  <div className="roadmap-date">Q3 2025</div>
                  <div className="roadmap-phase">Phase 2: Code Awakening</div>
                  <ul>
                    <li>Presale launch for early supporters and strategic partners</li>
                    <li>Deployment of the AI Airdrop Portal</li>
                    <li>Release of Beta AI Art Engine for community experimentation</li>              
                    </ul>
                </div>
              </div>

              <div className="roadmap-container left">
                <div className="roadmap-content">
                  <div className="roadmap-date">Q4 2025</div>
                  <div className="roadmap-phase">Phase 3: Ecosystem Expansion</div>
                  <ul>
                    <li>Launch of AI Staking V1 with core platform features</li>
                    <li>Listings on Tier-1 centralized exchanges</li>
                    <li>Release of our NFT Marketplace MVP with creator onboarding</li>
                    <li>Strategic partnerships with established projects</li>                    
                  </ul>
                </div>
              </div>

              <div className="roadmap-container right">
                <div className="roadmap-content">
                  <div className="roadmap-date">Q1 2026</div>
                  <div className="roadmap-phase">Phase 4: Global Recognition</div>
                  <ul>
                    <li>Launch of AI Governance Dashboard for community-led proposals</li>
                    <li>Deployment of cross-chain bridge for multi-network token mobility</li>
                    <li>Release of officially licensed NFT collections</li>
                    <li>Accelerator program for ecosystem projects</li>                    
                  </ul>
                </div>
              </div>

              <div className="roadmap-container left">
                <div className="roadmap-content">
                  <div className="roadmap-date">Q2 2026</div>
                  <div className="roadmap-phase">Phase 5: The Ghibli-FI Metaverse</div>
                  <ul>
                    <li>Launch of the immersive Virtual Ghibli-Fi World</li>
                    <li>AI-powered NPCs introduced with adaptive dialogue</li>
                    <li>Cross-chain interoperability enhancements</li>
                    <li>Enterprise solutions and business integrations</li>                    
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoadmapWrapper>
  );
};

export default Roadmap;
