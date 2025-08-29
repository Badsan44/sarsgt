import styled from "styled-components";

import BannerBgImg from "../../../assets/images/banner/custom/banner-background-new.jpg";

const BannerWrapper = styled.section`
  background-image: url(${BannerBgImg});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  min-height: 100vh;
  padding: 223px 0 60px 0;
  position: relative;
  z-index: 0;
  overflow: hidden;

  /* Specific style for banner container */
  .container {
    @media (min-width: 1400px) {
      max-width: 1350px;
    }
  }

  /* Overlay to ensure text readability */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 25, 40, 0.4); /* Darker blue overlay */
    z-index: -1;
  }

  .banner-content-left {
    padding-right: 30px;
  }

  .banner-content-right {
    display: flex;
    justify-content: flex-end;
  }

  .banner-title {
    margin-bottom: 20px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 100px;
    font-weight: 400;
    line-height: 110px;
    color: #FFFFFF;
    text-align: left;
  }

  .banner-subtitle {
    margin-bottom: 32px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    text-align: left;
    max-width: 90%;
  }

  .presale-card {
    width: 650px;
    max-width: 100%;
    position: relative;
    margin-bottom: 40px;

    /* Original presale-card styles */
    border-radius: 20px;
    border: 2px solid #d22626; /* Teal border */
    background: rgb(12 12 12 / 71%); /* Darker blue background */
    backdrop-filter: blur(9px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    &-header {
      padding: 20px 40px;
      background: linear-gradient(180deg, #d22626 0%, #d72424 100%); /* Subtle teal header */
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      text-align: center;
      
      h5 {
        text-align: center;
      }
    }

    &-counter {
      padding: 20px;
      background: linear-gradient(180deg, #d72424 0%, #792f2f 100%); /* Teal background */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-body {
      padding: 40px;
    }
  }

  @media screen and (max-width: 991px) {
    .banner-content-left,
    .banner-content-right {
      padding: 0;
      margin-bottom: 40px;
    }

    .banner-content-right {
      justify-content: center;
    }

    .banner-title {
      text-align: center;
      font-size: 80px;
      line-height: 90px;
    }

    .banner-subtitle {
      text-align: center;
      max-width: 100%;
    }

    .presale-card {
      margin: 0 auto 40px;
    }
  }

  @media screen and (max-width: 767px) {
    .banner-title {
      margin-bottom: 20px;
      font-size: 60px;
      line-height: 70px;
    }
  }

  @media screen and (max-width: 575px) {
    .banner-title {
      font-size: 50px;
      line-height: 60px;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 150px 0 60px 0;

    .banner-title {
      font-size: 30px !important;
      line-height: 40px !important;
    }

    .presale-card {
      border-radius: 20px;

      h5 {
        font-size: 15px;
        line-height: 24px;
      }

      &-header {
        padding: 10px 20px;
      }

      &-counter {
        padding: 10px;
      }

      &-body {
        padding: 20px;
      }
    }
  }
`;

export default BannerWrapper;
