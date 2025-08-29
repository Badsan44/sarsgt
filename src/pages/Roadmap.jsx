import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import RoadmapSection from "../sections/roadmap/Roadmap";
import Footer from "../sections/footer/Footer";

const Roadmap = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <RoadmapSection />
      <Footer />
    </Layout>
  );
};

export default Roadmap;