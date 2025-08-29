import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import TokenomicsSection from "../sections/tokenomics/Tokenomics";
import Footer from "../sections/footer/Footer";

const Tokenomics = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <TokenomicsSection />
      <Footer />
    </Layout>
  );
};

export default Tokenomics;