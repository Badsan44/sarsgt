import styled from "styled-components";

const AboutWrapper = styled.section`
  padding: 100px 0;
  position: relative;
  z-index: 1;
  background: rgba(7, 35, 50, 0.9); /* Updated to match new teal/blue theme */
  background-image: url('src/assets/images/About.png') !important;
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .about-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .about-subtitle {
    margin-bottom: 50px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
  }

  .about-content-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
  }

  .about-card {
    flex: 1;
    min-width: 280px;
    border-radius: 20px;
    border: 2px solid rgba(29, 255, 224, 0.1); /* Updated to teal border */
    background: rgba(7, 35, 50, 0.75); /* Updated to match new theme */
    backdrop-filter: blur(10px);
    padding: 30px;
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      border-color: rgba(29, 255, 224, 0.3); /* Updated to teal border */
    }

    h3 {
      margin-bottom: 15px;
      color: #1dffe0; /* Updated to match new theme */
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 24px;
      font-weight: 500;
    }

    p {
      color: ${({ theme }) => theme.colors.white};
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 16px;
      line-height: 26px;
    }
  }

  @media screen and (max-width: 767px) {
    .about-title {
      font-size: 48px;
      line-height: 58px;
      color: #FFFFFF;
    }
  }

  @media screen and (max-width: 575px) {
    .about-title {
      font-size: 36px;
      line-height: 46px;
      color: #FFFFFF;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 60px 0;

    .about-title {
      font-size: 30px;
      line-height: 40px;
      color: #FFFFFF;
    }

    .about-subtitle {
      font-size: 16px;
      line-height: 26px;
    }
  }
`;

export default AboutWrapper;
