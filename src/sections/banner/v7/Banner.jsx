import BannerWrapper from "./Banner.style";
import Progressbar from "../../../components/progressbar/Progressbar";
import Countdown from "../../../components/countdown/Countdown";
import TokenInfo from "../../../components/tokenInfo/TokenInfo";
import PayWith from "../../../components/payWith/PayWith";
import ConnectWalletButton from "../../../components/connectWalletButton/ConnectWalletButton";
import Whitepaper from "../../../assets/pdf/Whitepaper.pdf";
import DropdownDemo from "../../../components/header/dropdownDemo/DropdownDemo";
import BannerData from "../../../assets/data/bannerV7";
import { usePresaleData } from "../../../utils/PresaleContext";
import { NavLink } from "react-router-dom";

import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import SolidProofImg from "../../../assets/images/solidproof.png";
import LogoImg from "../../../assets/images/logo-4.png";
import IconImg2 from "../../../assets/images/icons/telegram.svg";
import IconImg3 from "../../../assets/images/icons/twitter.svg";
import IconImg4 from "../../../assets/images/icons/discord.svg";
import IconImg5 from "../../../assets/images/icons/medium.svg";
import IconImg6 from "../../../assets/images/icons/reddit.svg";
import IconImg7 from "../../../assets/images/icons/file.svg";

const Banner = () => {
  const {
    currentStage,
    currentBonus,
    stageEnd,
    goalToken,
    raisedToken,
    tokenPercent,
  } = usePresaleData();

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row">
          <div className="col-lg-7 banner-col-left">
            <div className="banner-header">
              <NavLink to={"/"} className="banner-header-left">
                <img src={LogoImg} alt="Logo" />
              </NavLink>
              <div className="banner-header-right">
                <DropdownDemo variant="v2" />
              </div>
            </div>

            <h1 className="banner-title">
              {BannerData.title} <span>{BannerData.title2}</span>
              <br />
              {BannerData.title3}
            </h1>
            <h4 className="banner-subtitle">{BannerData.subtitle}</h4>
          </div>
          <div className="col-lg-5 banner-col-right">
            <ul className="banner-list">
              <li>
                <ConnectWalletButton variant="v7" />
              </li>
              <li>
                <a href="https://t.me/" target="_blank" rel="noreferrer">
                  <img src={IconImg2} alt="icon" className="icon" />
                  <span className="name">Telegram</span>
                  <span className="icon-text">
                    <GoArrowUpRight />
                  </span>
                  <span className="url">@uigigs</span>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                  <img src={IconImg3} alt="icon" className="icon" />
                  <span className="name">Twiiter</span>
                  <span className="icon-text">
                    <GoArrowUpRight />
                  </span>
                  <span className="url">@x_uigigs</span>
                </a>
              </li>
              <li>
                <a href="https://discord.com/" target="_blank" rel="noreferrer">
                  <img src={IconImg4} alt="icon" className="icon" />
                  <span className="name">Discord</span>
                  <span className="icon-text">
                    <GoArrowUpRight />
                  </span>
                  <span className="url">@dis_ui-gigs</span>
                </a>
              </li>
              <li>
                <a href="https://medium.com/" target="_blank" rel="noreferrer">
                  <img src={IconImg5} alt="icon" className="icon" />
                  <span className="name">Medium</span>
                  <span className="icon-text">
                    <GoArrowUpRight />
                  </span>
                  <span className="url">@me_uigigs_co</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={IconImg6} alt="icon" className="icon" />
                  <span className="name">Reddit</span>
                  <span className="icon-text">
                    <GoArrowUpRight />
                  </span>
                  <span className="url">@uigigs</span>
                </a>
              </li>
              <li>
                <a href={Whitepaper} target="_blank" rel="noreferrer">
                  <img src={IconImg7} alt="icon" className="icon" />
                  <span className="name">Whitepaper</span>
                  <span className="icon-text">
                    <GoArrowDownLeft />
                  </span>
                  <span className="url">Whitepaper</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row banner-row align-items-center">
          <div className="col-lg-7 banner-col-left">
            <div className="mb-10 d-flex align-items-center justify-content-between gap-1 flex-wrap">
              <h6 className="ff-outfit fw-600 text-white text-uppercase">
                Stage {currentStage} : {currentBonus}% Bonus !
              </h6>
              <h6 className="ff-outfit fw-600 text-white text-uppercase">
                {raisedToken} / {goalToken}
              </h6>
            </div>

            <Progressbar done={tokenPercent} variant="v2" />
          </div>
          <div className="col-lg-5 banner-col-right">
            <div className="banner-col">
              <h5 className="ff-outfit fw-600 text-white text-uppercase">
                Pre-Sale Ends in
              </h5>
              <Countdown endDate={stageEnd} font="title2" variant="v2" />
            </div>
          </div>
        </div>

        <div className="row banner-row">
          <div className="col-lg-7 banner-col-left">
            <PayWith variant="v5" />
          </div>
          <div className="col-lg-5 banner-col-right">
            <div className="banner-col">
              <TokenInfo variant="v3" />
            </div>
          </div>
        </div>

        <div className="row banner-row">
          <div className="col-lg-7 banner-col-left">
            <div className="audit-item">
              <p>
                Audit & KYC Certificate
                <br />
                100% Secure and Verified
              </p>
              <img src={SolidProofImg} alt="Solid Proof" />
            </div>
          </div>
          <div className="col-lg-5 banner-col-right">
            <div className="bottom-info">
              <h5>Total Supply: {goalToken}</h5>
              <h5>Soft Cap: 50000</h5>
            </div>
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
