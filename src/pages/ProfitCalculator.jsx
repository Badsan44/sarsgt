import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import ProfitCalculatorSection from "../sections/profitCalculator/ProfitCalculator";
import Footer from "../sections/footer/Footer";

const ProfitCalculator = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <ProfitCalculatorSection />
      <Footer />
    </Layout>
  );
};

export default ProfitCalculator;