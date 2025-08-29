import HowToBuyWrapper from "./HowToBuy.style";
import WalletIcon from "../../assets/images/icons/wallet-icon.png";
import QuantityIcon from "../../assets/images/icons/quantity-icon.png";
import ApproveIcon from "../../assets/images/icons/approve-icon.png";
import howToBuyBackground from "../../assets/images/how-to-buy-bg.png";
import { useConnectModal } from "@rainbow-me/rainbowkit";

// Step data - you can easily modify this object to change the steps
const buySteps = [
  {
    number: 1,
    icon: WalletIcon,
    iconAlt: "Wallet Icon",
    title: "Link Your Crypto Wallet",
    description: "Connect your preferred cryptocurrency wallet to our platform by clicking the \"Connect Wallet\" button in the top right corner. We support MetaMask, WalletConnect, and other popular wallets."
  },
  {
    number: 2,
    icon: QuantityIcon,
    iconAlt: "Quantity Icon",
    title: "Choose your Quantity",
    description: "Select the amount of tokens you wish to purchase. You can use BNB for your purchase. The minimum purchase amount is 0.1 BNB. Enter your desired amount and proceed to the next step."
  },
  {
    number: 3,
    icon: ApproveIcon,
    iconAlt: "Approve Icon",
    title: "Complete and Approve",
    description: "Review your purchase details and confirm the transaction in your wallet. Once approved, the transaction will be processed on the blockchain, and your tokens will be allocated to your wallet address."
  }
];

const HowToBuy = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <HowToBuyWrapper id="how-to-buy" $bgImage={howToBuyBackground}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="how-to-buy-title">HOW TO BUY</h2>
            <p className="how-to-buy-subtitle">
              Follow these simple steps to participate in our presale
            </p>

            <div className="how-to-buy-steps">
              {buySteps.map((step, index) => (
                <div className="how-to-buy-step" key={index}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon">
                    <img src={step.icon} alt={step.iconAlt} />
                  </div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="buy-now-button-container">
              <a 
                href="#" 
                className="buy-now-button" 
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll to the top where the presale card is located
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                  // After scrolling, open the wallet connect modal
                  setTimeout(() => {
                    if (openConnectModal) openConnectModal();
                  }, 800);
                }}
              >
                BUY NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </HowToBuyWrapper>
  );
};

export default HowToBuy;