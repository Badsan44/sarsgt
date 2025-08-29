import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import HowToBuySection from "../sections/howToBuy/HowToBuy";
import Footer from "../sections/footer/Footer";

const HowToBuy = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <HowToBuySection />
      <Footer />
    </Layout>
  );
};

export default HowToBuy;