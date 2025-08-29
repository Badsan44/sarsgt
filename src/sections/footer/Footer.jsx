import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import FooterWrapper from "./Footer.style";
import footerSocialLinks from "../../assets/data/footerSocialLinks";
import Logo from "../../assets/images/logo-4.png";

const Footer = ({ variant }) => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
    <FooterWrapper className={variant}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 footer-about-col">
            <div className="footer-widget footer-about">
              <div className="footer-logo">
                <Link to="/">
                  <img src={Logo} alt="Gittu" />
                </Link>
              </div>
              <p className="footer-about-text">
                BNBMAGA fuses Studio Ghibli magic with AI-powered tools. Join the presale and shape the future of community-driven crypto.
              </p>
              <div className="footer-social-links">
                {footerSocialLinks.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.title}
                  >
                    <img src={item.icon} alt={item.title} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {isHomePage && (
            <>
            <div className="col-lg-2 col-md-3 col-sm-6 footer-quick-links fixed-width">
              <div className="footer-widget footer-links">
                <h3 className="footer-widget-title">Quick Links</h3>
                <ul className="footer-links-list">
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
                    How to Buy
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
                <li><Link to="/kol-quest">KOL Quest</Link></li>
                <li>
                  <a 
                    href={isHomePage ? "#faq" : "/faq"}
                    onClick={(e) => handleSectionClick(e, "faq")}
                  >
                    FAQ
                  </a>
                </li>

              </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6 footer-referral fixed-width">
              <div className="footer-widget footer-links">
                <h3 className="footer-widget-title">Referral</h3>
                <ul className="footer-links-list">
                  <li><Link to="/referral-program">Referral Program</Link></li>
                  <li><Link to="/referral-dashboard">Referral Dashboard</Link></li>
                </ul>
              </div>
            </div>
            </>
          )}

          <div className="col-lg-2 col-md-2 col-sm-6 footer-terms fixed-width">
            <div className="footer-widget footer-links">
              <h3 className="footer-widget-title">Terms</h3>
              <ul className="footer-links-list">
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-sm-6 footer-resources fixed-width">
            <div className="footer-widget footer-links">
              <h3 className="footer-widget-title">Resources</h3>
              <ul className="footer-links-list">
                <li><a href="/pdf/whitepaper.pdf" target="_blank">Whitepaper</a></li>
                {/* GitHub, BscScan, and CoinMarketCap links hidden for now */}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="row">
            <div className="col-md-12">
              <p className="footer-copyright text-center">
                &copy; {currentYear} BNBMAGA Token. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FooterWrapper>
  );
};

Footer.propTypes = {
  variant: PropTypes.string
};

export default Footer;
