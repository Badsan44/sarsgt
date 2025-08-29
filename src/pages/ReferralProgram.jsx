import { useEffect } from "react";
import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import SectionDivider from "../components/SectionDivider";
import Footer from "../sections/footer/Footer";

import InfoSection from "../sections/referralProgram/InfoSection";
import RewardsTiers from "../sections/referralProgram/RewardsTiers";
import EarningsCalculator from "../sections/referralProgram/EarningsCalculator";
import HowItWorks from "../sections/referralProgram/HowItWorks";

const ReferralProgram = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <Layout pageTitle="Referral Program — Earn with BNBMAGA">
      <Header variant="v5" />

      <SectionDivider />
      <InfoSection bgImage={null} />

      <SectionDivider />
      <RewardsTiers bgImage={null} />

      <SectionDivider />
      <EarningsCalculator bgImage={null} />

      <SectionDivider />
      <HowItWorks bgImage={null} />

      <SectionDivider />
      <Footer variant="v1" />
    </Layout>
  );
};

export default ReferralProgram;
