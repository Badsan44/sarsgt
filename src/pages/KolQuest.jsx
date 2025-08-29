import { useEffect } from "react";
import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import KolQuestBanner from "../sections/kolQuest/KolQuestBanner";
import BrandsCarousel from "../sections/kolQuest/BrandsCarousel";
import KolQuestForm from "../sections/kolQuest/KolQuestForm";
import KolQuestInfo from "../sections/kolQuest/KolQuestInfo";
import Footer from "../sections/footer/Footer";
import SectionDivider from "../components/SectionDivider";

const KolQuest = () => {
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
    <Layout pageTitle="KOL Quest - Join the $BNBMAGA Collaboration Campaign">
      <Header variant="v5" />
      <KolQuestBanner />

      <SectionDivider />
      
      {/* Brands Carousel between Banner and Info */}
      <BrandsCarousel />

      {/* Divider between Carousel and Info */}
      <SectionDivider />

      <KolQuestInfo />

      {/* Divider between Info and Form */}
      <SectionDivider />

      <KolQuestForm />

      {/* Divider between Form and Footer */}
      <SectionDivider />

      <Footer variant="v1" />
    </Layout>
  );
};

export default KolQuest;