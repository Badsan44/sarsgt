import Layout from "../Layout";
import Header from "../components/header/v1/Header";
import Banner from "../sections/banner/v1/Banner";

const HomeV1 = () => {
  return (
    <Layout pageTitle="Gittu - Home One">
      <Header variant="v1" />
      <Banner />
    </Layout>
  );
};

export default HomeV1;
