import { useEffect } from "react";
import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import Banner from "../sections/banner/v6/Banner";
import PresalePhases from "../sections/presalePhases/PresalePhases";
import About from "../sections/about/About";
import Tokenomics from "../sections/tokenomics/Tokenomics";
import Roadmap from "../sections/roadmap/Roadmap";
import ProfitCalculator from "../sections/profitCalculator/ProfitCalculator";
import HowToBuy from "../sections/howToBuy/HowToBuy";
import KolQuestSection from "../sections/kolQuestSection/KolQuestSection";
import Faq from "../sections/faq/Faq";
import Footer from "../sections/footer/Footer";
import SectionDivider from "../components/SectionDivider";

const HomeV6 = () => {
  // Add smooth scrolling behavior using JS
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Handle navigation clicks
    const handleNavClick = (e) => {
      const link = e.target;
      if (link.tagName === 'A' && link.getAttribute('href')?.startsWith('#')) {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: targetElement.offsetTop - 100, // Offset to account for header
            behavior: 'smooth'
          });
        }
      }
    };

    // Add event listener to header navigation, mobile menu, and footer links
    const allNavs = document.querySelectorAll('.gittu-nav-menu a, .mobile-menu-list a, .footer-links-list a, .footer-bottom-links a');
    allNavs.forEach(nav => {
      nav.addEventListener('click', handleNavClick);
    });

    // Cleanup event listeners on unmount
    return () => {
      allNavs.forEach(nav => {
        nav.removeEventListener('click', handleNavClick);
      });
    };
  }, []);

  return (
    <Layout pageTitle="Make America Ghibli Again">
      <Header variant="v5" />
      <Banner />

      {/* Divider between Banner and Presale Phases */}
      <SectionDivider />

      <PresalePhases />

      {/* Divider between Presale Phases and Profit Calculator */}
      <SectionDivider />

      <ProfitCalculator />

      {/* Divider between Profit Calculator and How to Buy */}
      <SectionDivider />

      <HowToBuy />

      {/* Divider between How to Buy and About */}
      <SectionDivider />

      <About />

      {/* Divider between About and Tokenomics */}
      <SectionDivider />

      <Tokenomics />

      {/* Divider between Tokenomics and Roadmap */}
      <SectionDivider />

      <Roadmap />

      {/* Divider between Roadmap and KOL Quest */}
      <SectionDivider />

      <KolQuestSection />

      {/* Divider between KOL Quest and FAQ */}
      <SectionDivider />

      <Faq />

      {/* Divider between FAQ and Footer */}
      <SectionDivider />

      <Footer variant="v1" />
    </Layout>
  );
};

export default HomeV6;
