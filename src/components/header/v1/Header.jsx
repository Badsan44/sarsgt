import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import HeaderWrapper from "./Header.style";
import ConnectWalletButton from "../../connectWalletButton/ConnectWalletButton";
import MobileMenu from "../mobileMenu/MobileMenu";
import HeaderSocialLinks from "../../../assets/data/headerSocialLinks";
import Whitepaper from "../../../assets/pdf/Whitepaper.pdf";
import Logo from "../../../assets/images/logo-3.png";
import Logo4 from "../../../assets/images/logo-4.png";
import Logo5 from "../../../assets/images/logo-5.png";
import { HiMenuAlt3 } from "react-icons/hi";

const Header = ({ variant }) => {
  const [logoImg, setLogoImg] = useState(Logo4); // Always use Logo4
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleMobileMenu = () => {
    setIsMobileMenu(!isMobileMenu);
  };

  const handleSectionClick = (e, sectionId) => {
    if (isHomePage) {
      // On home page: scroll to section
      e.preventDefault();
      const targetElement = document.querySelector(`#${sectionId}`);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset for header
          behavior: 'smooth'
        });
      }
    }
    // On other pages: let the link navigate normally to the section page
  };

  return (
    <>
      <HeaderWrapper className="header-section" $offsetTop={0}>
        <div className="container">
          <div className="gittu-header-content">
            <div className="gittu-header-left">
              <NavLink className="gittu-header-logo" to="/" end>
                <img src={logoImg} alt="Logo" />
              </NavLink>

              {/* Navigation menu only on home page */}
              {(variant === "v5" || variant === "v6") && isHomePage && (
                <ul className="gittu-nav-menu">
                  <li>
                    <a 
                      href={isHomePage ? "#presale-phases" : "/presale-phases"}
                      onClick={(e) => handleSectionClick(e, "presale-phases")}
                    >
                      Presale
                    </a>
                  </li>
                  <li>
                    <a 
                      href={isHomePage ? "#profit-calculator" : "/profit-calculator"}
                      onClick={(e) => handleSectionClick(e, "profit-calculator")}
                    >
                      Profits
                    </a>
                  </li>
                  <li>
                    <a 
                      href={isHomePage ? "#how-to-buy" : "/how-to-buy"}
                      onClick={(e) => handleSectionClick(e, "how-to-buy")}
                    >
                      How to buy
                    </a>
                  </li>
                  <li>
                    <a 
                      href={isHomePage ? "#about" : "/about"}
                      onClick={(e) => handleSectionClick(e, "about")}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a 
                      href={isHomePage ? "#tokenomics" : "/tokenomics"}
                      onClick={(e) => handleSectionClick(e, "tokenomics")}
                    >
                      Tokenomics
                    </a>
                  </li>
                  <li>
                    <a 
                      href={isHomePage ? "#roadmap" : "/roadmap"}
                      onClick={(e) => handleSectionClick(e, "roadmap")}
                    >
                      Roadmap
                    </a>
                  </li>
                  <li>
                    <a 
                      href={isHomePage ? "#faq" : "/faq"}
                      onClick={(e) => handleSectionClick(e, "faq")}
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              )}
            </div>
            <div className="gittu-header-right">
              <div className="gittu-header-menu-toggle">
                <button className="menu-toggler" onClick={handleMobileMenu}>
                  <HiMenuAlt3 />
                </button>
              </div>
              <div className="gittu-header-right-menu">
                {variant === "v1" && (
                  <ul className="gittu-header-menu">
                    <li>
                      <a href={Whitepaper} target="_blank" rel="noreferrer">
                        Whitepaper
                      </a>
                    </li>
                  </ul>
                )}

                {(variant === "v2" ||
                  variant === "v3" ||
                  variant === "v5" ||
                  variant === "v6" ||
                  variant === "v7") && (
                  <ul className="social-links">
                    {HeaderSocialLinks?.map((socialLinkItem, i) => (
                      <li key={i}>
                        <a
                          href={socialLinkItem.url}
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
                )}

                {variant === "v1" && <ConnectWalletButton />}
                {variant === "v2" && <ConnectWalletButton variant="v2" />}
                {variant === "v3" && <ConnectWalletButton variant="yellow" />}
                {variant === "v4" && <ConnectWalletButton variant="gradient" />}
                {variant === "v5" && <ConnectWalletButton variant="v5" />}
                {variant === "v6" && <ConnectWalletButton variant="v6" />}
                {variant === "v7" && <ConnectWalletButton />}
              </div>
            </div>
          </div>
        </div>
      </HeaderWrapper>

      {isMobileMenu && <MobileMenu mobileMenuHandle={handleMobileMenu} />}
    </>
  );
};

export default Header;
