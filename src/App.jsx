import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import ScrollToTop from "./ScrollToTop";
import { initializeReferralManager } from './utils/referralManager';
import BackToTop from "./components/backToTop/BackToTop";
import HomeV1 from "./pages/HomeV1";
import HomeV2 from "./pages/HomeV2";
import HomeV3 from "./pages/HomeV3";
import HomeV4 from "./pages/HomeV4";
import HomeV5 from "./pages/HomeV5";
import HomeV6 from "./pages/HomeV6";
import HomeV7 from "./pages/HomeV7";
import HomeV8 from "./pages/HomeV8";
import HomeV9 from "./pages/HomeV9";
import HomeV10 from "./pages/HomeV10";
import HomeV6Aggregated from "./pages/HomeV6Aggregated";
import TestAggregated from "./pages/TestAggregated";
import KolQuest from "./pages/KolQuest";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PresalePhases from "./pages/PresalePhases";
import ProfitCalculator from "./pages/ProfitCalculator";
import HowToBuy from "./pages/HowToBuy";
import About from "./pages/About";
import Tokenomics from "./pages/Tokenomics";
import Roadmap from "./pages/Roadmap";
import FAQ from "./pages/FAQ";
import ReferralDashboard from "./pages/ReferralDashboard";
import ReferralProgram from "./pages/ReferralProgram";


const App = () => {
  // Initialize referral manager when app starts
  useEffect(() => {
    initializeReferralManager();
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeV6 />} />
        <Route path="/home-one" element={<HomeV1 />} />
        <Route path="/home-two" element={<HomeV2 />} />
        <Route path="/home-three" element={<HomeV3 />} />
        <Route path="/home-four" element={<HomeV4 />} />
        <Route path="/home-five" element={<HomeV5 />} />
        <Route path="/home-six" element={<HomeV6 />} />
        <Route path="/home-seven" element={<HomeV7 />} />
        <Route path="/home-eight" element={<HomeV8 />} />
        <Route path="/home-nine" element={<HomeV9 />} />
        <Route path="/home-ten" element={<HomeV10 />} />
        <Route path="/aggregated" element={<HomeV6Aggregated />} />
        <Route path="/test-aggregated" element={<TestAggregated />} />
        <Route path="/kol-quest" element={<KolQuest />} />
        <Route path="/referral-dashboard" element={<ReferralDashboard />} />
        <Route path="/presale-phases" element={<PresalePhases />} />
        <Route path="/profit-calculator" element={<ProfitCalculator />} />
        <Route path="/how-to-buy" element={<HowToBuy />} />
        <Route path="/about" element={<About />} />
        <Route path="/tokenomics" element={<Tokenomics />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/referral-program" element={<ReferralProgram />} />
      </Routes>
      <BackToTop />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </HashRouter>
  );
};

export default App;
