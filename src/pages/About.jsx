import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import AboutSection from "../sections/about/About";
import Footer from "../sections/footer/Footer";

const About = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <AboutSection />
      <Footer />
    </Layout>
  );
};

export default About;