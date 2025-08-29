import { useState } from "react";
import FaqWrapper from "./Faq.style";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is BNBMAGA and what makes it unique?",
      answer:
        "BNBMAGA is a meme coin on the BNB Chain that fuses Studio Ghibli-inspired aesthetics with cutting-edge AI utilities. It stands out by offering real-world utility through AI-powered staking, airdrops, generative art, and community governance via Kodama DAO."
    },
    {
      question: "What utilities does the $BNBMAGA token provide?",
      answer:
        "$BNBMAGA is used for staking with dynamic APY, voting in DAO governance, minting AI-generated NFTs, participating in community events, and purchasing digital goods in the future Ghibli-inspired metaverse."
    },
    {
      question: "How does the AI-powered airdrop system work?",
      answer:
        "BNBMAGA uses AI to analyze social media engagement, wallet activity, and sentiment to fairly distribute airdrops. Influencers and users are ranked using a custom algorithm that ensures real users—not bots—are rewarded."
    },
    {
      question: "Is there a staking feature and how are rewards calculated?",
      answer:
        "The AI staking system will adjusts APY based on market volatility, liquidity depth, and community participation. It also includes auto-compounding and risk mitigation via circuit breakers during high volatility."
    },
    {
      question: "What is the AI Art Engine and how can users interact with it?",
      answer:
        "The AI Art Engine will allows users to generate Ghibli-style art by inputting prompts. Artworks can be minted as NFTs, voted on by the community, and earn rewards. Artists retain rights and receive royalties on secondary sales."
    },
    {
      question: "How does governance work within the BNBMAGA ecosystem?",
      answer:
        "Governance will be managed through the Kodama DAO, where token holders vote on proposals, treasury allocation, model upgrades, and charitable initiatives. Quadratic voting ensures fair representation across all holders."
    },
    {
      question: "Will there be any licensed or official Ghibli-inspired NFTs?",
      answer:
        "Yes. BNBMAGA plans to collaborate with Ghibli alumni and partner artists to release officially licensed NFT collections, which will be featured in the marketplace and virtual world experiences."
    }
  ];

  return (
    <FaqWrapper id="faq">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="faq-title">FAQ</h2>
            <p className="faq-subtitle">
              Frequently asked questions about our platform and token
            </p>

            <div className="faq-container">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? "active" : ""}`}
                >
                  <div
                    className="faq-header"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3>{item.question}</h3>
                  </div>
                  <div className={`faq-body ${activeIndex === index ? "active" : ""}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FaqWrapper>
  );
};

export default Faq;
