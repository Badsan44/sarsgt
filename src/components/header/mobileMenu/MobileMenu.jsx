import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import MobileMenuWrapper from "./MobileMenu.style";
import Logo from "../../../assets/images/logo-4.png";
import Telegram from "../../../assets/images/icons/telegram.svg";
import Discord from "../../../assets/images/icons/discord.svg";
import Twitter from "../../../assets/images/icons/twitter.svg";
import { AiOutlineClose } from "react-icons/ai";
import ConnectWalletButton from "../../connectWalletButton/ConnectWalletButton";
import Whitepaper from "../../../assets/pdf/Whitepaper.pdf";
import demoMenuList from "../../../assets/data/demoMenuList";

const MobileMenu = ({ mobileMenuHandle }) => {
  const [isSubmenu, setIsSubmenu] = useState(false);

  const handleSubmenu = () => {
    setIsSubmenu(!isSubmenu);
  };

  return (
    <MobileMenuWrapper className="gittu-mobile-menu">
      <div className="gittu-mobile-menu-content">
        <div className="mobile-menu-top">
          <NavLink className="mobile-logo" to="/" end>
            <img src={Logo} alt="Logo" />
          </NavLink>

          <button className="mobile-menu-close" onClick={mobileMenuHandle}>
            <AiOutlineClose />
          </button>
        </div>

        <div className="gittu-mobile-menu-dropdown-wrap">
          <div className="mobile-menu-list">
            <ul>
              <li onClick={mobileMenuHandle}>
                <a href="#presale-phases">PRESALE</a>
              </li>
              <li onClick={mobileMenuHandle}>
                <a href="#profit-calculator">PROFITS</a>
              </li>
              <li onClick={mobileMenuHandle}>
                <a href="#how-to-buy">HOW TO BUY</a>
              </li>
              <li onClick={mobileMenuHandle}>
                <a href="#about">ABOUT</a>
              </li>
              <li onClick={mobileMenuHandle}>
                <a href="#tokenomics">TOKENOMICS</a>
              </li>
              <li onClick={mobileMenuHandle}>
                <a href="#roadmap">ROADMAP</a>
              </li>
              <li onClick={mobileMenuHandle}>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <button onClick={handleSubmenu}>PAGES +</button>

                {isSubmenu && (
                  <div className="submenu-list">
                    <ul>
                      {demoMenuList?.map((menu, i) => (
                        <li key={i} onClick={mobileMenuHandle}>
                          <Link to={menu.url}>{menu.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <ul className="mobile-social-links mb-40">
          <li>
            <a
              href="https://web.telegram.org/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={Telegram} alt="icon" />
            </a>
          </li>
          <li>
            <a href="https://discord.com/" target="_blank" rel="noreferrer">
              <img src={Discord} alt="icon" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer">
              <img src={Twitter} alt="icon" />
            </a>
          </li>
        </ul>

        <div className="d-flex justify-content-center">
          <ConnectWalletButton />
        </div>

        <div className="mobile-menu-bottom">
          <div className="mobile-menu-bottom-inner">
            <div className="copyright-text">
              <p>Copyright © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>
    </MobileMenuWrapper>
  );
};

export default MobileMenu;
