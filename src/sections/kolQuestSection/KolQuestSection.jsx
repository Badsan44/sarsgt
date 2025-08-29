import { useState } from "react";
import { Link } from "react-router-dom";
import KolQuestSectionWrapper from "./KolQuestSection.style";

// 1. Static imports for each logo
import AlonLogo from "../../assets/images/kols/Alon.png";
import Anon2498Logo from "../../assets/images/kols/2498an0n.png";
import AlexBeckerLogo from "../../assets/images/kols/AlexBecker.png";
import AlexSvanevikLogo from "../../assets/images/kols/AlexSvanevik.png";
import AlphaBigBrainLogo from "../../assets/images/kols/AlphaBigBrain.png";
import AndrewKangLogo from "../../assets/images/kols/AndrewKang.png";
import BizyugoHlLogo from "../../assets/images/kols/bizyugo.hl.png";
import CobieLogo from "../../assets/images/kols/Cobie.png";
import CozomoDeMediciLogo from "../../assets/images/kols/Cozomo_de_Medici.png";
import Cp0xcomLogo from "../../assets/images/kols/cp0xcom.png";
import CryptojohnbooneLogo from "../../assets/images/kols/Cryptojohnboone.png";
import CryptoKemalLogo from "../../assets/images/kols/CryptoKemal.png";
import CweihanLogo from "../../assets/images/kols/cweihan.png";
import Dereek69Logo from "../../assets/images/kols/Dereek69.png";
import EgasHlLogo from "../../assets/images/kols/egas.hl.png";
import GaryVeeLogo from "../../assets/images/kols/GaryVee.png";
import GiganticRebirthLogo from "../../assets/images/kols/GiganticRebirth.png";
import HongQiYuLogo from "../../assets/images/kols/HongQiYu.png";
import MuradLogo from "../../assets/images/kols/Murad.png";
import TardFiWhaleLogo from "../../assets/images/kols/TardFiWhale.png";



// 2. Core brand data: id, name, and logo import
const brandLogos = [
  { id: 1, name: "Alon", logo: AlonLogo },
  { id: 2, name: "2498an0n", logo: Anon2498Logo },
  { id: 3, name: "Alex Becker", logo: AlexBeckerLogo },
  { id: 4, name: "Alex Svanevik", logo: AlexSvanevikLogo },
  { id: 5, name: "Alpha Big Brain", logo: AlphaBigBrainLogo },
  { id: 6, name: "Andrew Kang", logo: AndrewKangLogo },
  { id: 7, name: "Bizyugo", logo: BizyugoHlLogo },
  { id: 8, name: "Cobie", logo: CobieLogo },
  { id: 9, name: "Cozomo de Medici", logo: CozomoDeMediciLogo },
  { id: 10, name: "Cp0xcom", logo: Cp0xcomLogo },
  { id: 11, name: "Crypto John Boone", logo: CryptojohnbooneLogo },
  { id: 12, name: "Crypto Kemal", logo: CryptoKemalLogo },
  { id: 13, name: "Cweihan", logo: CweihanLogo },
  { id: 14, name: "Dereek69", logo: Dereek69Logo },
  { id: 15, name: "Egas", logo: EgasHlLogo },
  { id: 16, name: "Gary Vee", logo: GaryVeeLogo },
  { id: 17, name: "Gigantic Rebirth", logo: GiganticRebirthLogo },
  { id: 18, name: "Hong Qi Yu", logo: HongQiYuLogo },
  { id: 19, name: "Murad", logo: MuradLogo },
  { id: 20, name: "TardFiWhale", logo: TardFiWhaleLogo },
];

const KolQuestSection = () => {
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageError = (brandId) => {
    setFailedImages(prev => new Set(prev).add(brandId));
  };

  const getImageSrc = (brand) =>
    failedImages.has(brand.id)
      ? `https://via.placeholder.com/150x80/4ECDC4/FFFFFF?text=${encodeURIComponent(brand.name)}`
      : brand.logo;

  // Duplicate logos for infinite scroll
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  return (
    <KolQuestSectionWrapper id="kol-quest-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="kol-quest-header">
              <h2 className="section-title">KOL QUEST</h2>
              <p className="section-subtitle">
                Join our exclusive KOL program and become part of the BNBMAGA movement.
              </p>
            </div>

            <div className="brands-carousel-container">
              <div className="brands-carousel-track">
                {duplicatedLogos.map((brand, index) => (
                  <div key={`${brand.id}-${index}`} className="brand-item-wrapper">
                    <div className="brand-logo-item">
                      <img
                        src={getImageSrc(brand)}
                        alt={brand.name}
                        className="brand-logo"
                        onError={() => handleImageError(brand.id)}
                      />
                    </div>
                    <span className="brand-name">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kol-quest-cta">
              <Link to="/kol-quest" className="join-quest-btn">
                <span className="btn-text">Join the Quest</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </KolQuestSectionWrapper>
  );
};

export default KolQuestSection;
