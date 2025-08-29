import React from "react";
import ReactDOM from "react-dom/client";
import "./Polyfills";
import Rainbowkit from "./Rainbowkit.jsx";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import ThemeStyles from "./assets/styles/ThemeStyles";
import PresaleContextProvider from "./utils/PresaleContextProvider.jsx";
import AggregatedPresaleContextProvider from "./utils/AggregatedPresaleContextProvider.jsx";
import ModalContextProvider from "./utils/ModalContextProvider.jsx";
import { ThemeProvider } from "./utils/ThemeContext.jsx";
import App from "./App.jsx";

// Register Chart.js components
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

//global styles
import GlobalStyles from "./assets/styles/GlobalStyles";

// Theme variables CSS
import "./assets/styles/ThemeVariables.css";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// slick css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// react-toastify css
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Rainbowkit>
        <StyledThemeProvider theme={ThemeStyles}>
          <GlobalStyles />
          <AggregatedPresaleContextProvider>
            <PresaleContextProvider>
              <ModalContextProvider>
                <App />
              </ModalContextProvider>
            </PresaleContextProvider>
          </AggregatedPresaleContextProvider>
        </StyledThemeProvider>
      </Rainbowkit>
    </ThemeProvider>
  </React.StrictMode>
);
