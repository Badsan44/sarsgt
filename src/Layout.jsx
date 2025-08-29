import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { usePresaleData } from "./utils/PresaleContext";
import GlobalStyles from "./assets/styles/GlobalStyles";
import PropTypes from "prop-types";

const Layout = ({ pageTitle, children }) => {
  const { makeEmptyInputs } = usePresaleData();
  const location = useLocation();

  useEffect(() => {
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = "smooth";

    //makeEmptyInputs();
  }, [location.pathname, makeEmptyInputs]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {pageTitle ? pageTitle : "Make America Great Again"}
        </title>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
          crossOrigin="anonymous"
        ></script>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kufam:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyles />
      <main>{children}</main>
    </HelmetProvider>
  );
};

Layout.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Layout;
