import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import FaqSection from "../sections/faq/Faq";
import Footer from "../sections/footer/Footer";

const FAQ = () => {
  return (
    <Layout>
      <Header variant="v6" />
      <FaqSection />
      <Footer />
    </Layout>
  );
};

export default FAQ;