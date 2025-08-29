import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import PresalePhasesSection from "../sections/presalePhases/PresalePhases";
import Footer from "../sections/footer/Footer";

const PresalePhases = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <PresalePhasesSection />
      <Footer />
    </Layout>
  );
};

export default PresalePhases;