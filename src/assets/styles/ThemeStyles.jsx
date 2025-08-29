const ThemeStyles = {
  fonts: {
    body: "'Blinker', sans-serif",
    primary: "'Blinker', sans-serif",
    secondary: "'Blinker', sans-serif",
    title: "'Blinker', sans-serif",
    title2: "'Blinker', sans-serif",
  },

  colors: {
    white: "#ffffff",
    black: "#111111",
    blackSolid: "#000000",
    yellow: "#FCD930",
    primary: "#F3BA2F", // Updated to golden yellow
    secondary: "#D4A017", // Darker gold
    themeBlue: "#122a3a", // Darker blue
    themeGreen: "#F3BA2F", // Gold instead of teal

    dark: {
      bgBody: "#0a1a25", // Darker blue to match background
      bgHeader: "#0a1a25",
      bgHeaderMobile: "#061520e6",
      bgDropdownDemo: "#122a3a",
      bgBannerV1: "#0a1a25",
      bgBannerV2: "#071520e6",
      bgBannerV9: "#0a1a25b2",
      bgPresaleBtn: "#1e7a6acc",
      bgModalOverlay: "#0a1a25b3",
      bgModal: "#122a3a",
      cardBg: "rgba(9, 43, 60, 0.8)",
      cardBorder: "rgba(243, 186, 47, 0.15)",
      cardText: "rgba(255, 255, 255, 0.9)",
      headingText: "#ffffff",
      bodyText: "#e6e6e6",
      chartText: "#ffffff",
      tokenomicsBg: "rgba(9, 43, 60, 0.9)",
      tokenomicsDetailBg: "rgba(7, 35, 50, 0.9)",
      tokenomicsInfoBg: "rgba(15, 55, 75, 0.8)",
      accentColor: "#F3BA2F",
      highlightGradient: "linear-gradient(180deg, #fff 0%, #F3BA2F 100%)",
    },

    light: {
      bgBody: "#f0f7ff",
      bgHeader: "#ffffff",
      bgHeaderMobile: "#ffffffe6",
      bgDropdownDemo: "#ffffff",
      bgBannerV1: "#e5f0ff",
      bgBannerV2: "#f0f7ffe6",
      bgBannerV9: "#e5f0ff",
      bgPresaleBtn: "#1e7a6acc",
      bgModalOverlay: "#e5f0ffb3",
      bgModal: "#ffffff",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardBorder: "rgba(243, 186, 47, 0.3)",
      cardText: "rgba(7, 35, 50, 0.9)",
      headingText: "#072538",
      bodyText: "#1a4060",
      chartText: "#072538",
      tokenomicsBg: "rgba(225, 240, 255, 0.95)",
      tokenomicsDetailBg: "rgba(255, 255, 255, 0.95)",
      tokenomicsInfoBg: "rgba(235, 245, 255, 0.9)",
      accentColor: "#D4A017",
      highlightGradient: "linear-gradient(180deg, #072538 0%, #D4A017 100%)",
    },

    conicGradient:
      "conic-gradient(from 0deg at 50% 50%,#F3BA2F 0deg,#D4A017 360deg)", // Updated to gold
    bannerv3LinearGradient: "linear-gradient(180deg, #fff 0%, #F3BA2F 100%)", // Updated to gold
    linearGradient: "linear-gradient(90deg, #F3BA2F 0%, #122a3a 100%)", // Updated to gold/blue
    linearGradientBanner:
      "linear-gradient(180deg,#05050529 0%,#0a1a25 77.08%,#122a3a 100%);", // Updated to blue
    linearGradient2: "linear-gradient(90deg, #F3BA2F 0%, #D4A017 100%)", // Updated to gold
  },
};

export default ThemeStyles;
