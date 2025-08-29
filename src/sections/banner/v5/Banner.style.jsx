import styled from "styled-components";

import BannerBgImg from "../../../assets/images/banner/banner5-bg.png";

const BannerWrapper = styled.section`
  background-image: url(${BannerBgImg});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  min-height: 100vh;
  padding: 223px 0 0px 0;
  position: relative;
  z-index: 0;

  /* Add an overlay to enhance the background */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 25, 40, 0.3); /* Darker blue overlay */
    z-index: -1;
  }

  .banner-title {
    margin-bottom: 23px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 90px;
    font-weight: 400;
    line-height: 90px;
    color: ${({ theme }) => theme.colors.white};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    /* Add a subtle gradient color similar to v6 */
    background: linear-gradient(180deg, #fff 0%, #1dffe0 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .banner-subtitle {
    margin-bottom: 32px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  @media screen and (max-width: 991px) {
    .banner-title {
      font-size: 80px;
      line-height: 80px;
    }
  }

  @media screen and (max-width: 767px) {
    .banner-title {
      font-size: 55px;
      line-height: 55px;
    }
  }

  @media screen and (max-width: 575px) {
    .banner-title {
      margin-bottom: 10px;
      font-size: 50px;
      line-height: 50px;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 150px 0 0px 0;

    .banner-title {
      margin-bottom: 10px;
      font-size: 40px;
      line-height: 40px;
    }
  }
`;

export default BannerWrapper;
