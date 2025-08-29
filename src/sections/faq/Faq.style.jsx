import styled from "styled-components";
import Whitehousebg from "../../assets/images/Whitehouse.png";

const FaqWrapper = styled.section`
  padding: 100px 0;
  position: relative;
  z-index: 1;
  background-image: url(${Whitehousebg});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(210, 38, 38, 0.85); /* Semi-transparent red overlay */
    z-index: -1;
  }

  .faq-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .faq-subtitle {
    margin-bottom: 50px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
  }

  .faq-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-item {
    margin-bottom: 20px;
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3); /* Increased opacity for better visibility */
    background: rgba(210, 38, 38, 0.85); /* Increased opacity for better readability */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Added shadow for depth */
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: all 0.3s ease-in-out;

    &:hover {
      border-color: rgba(255, 255, 255, 0.7); /* Increased opacity for better visibility */
      transform: translateY(-2px); /* Slight lift effect on hover */
    }

    &.active {
      .faq-header {
        &::after {
          transform: rotate(180deg);
        }
      }
    }
  }

  .faq-header {
    padding: 20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    position: relative;

    &::after {
      content: "▼";
      color: #ffffff; /* Updated to white */
      font-size: 14px;
      transition: all 0.3s ease;
    }

    h3 {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 20px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.white};
      margin: 0;
    }
  }

  .faq-body {
    padding: 0 30px 20px;
    display: none;

    &.active {
      display: block;
    }

    p {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 16px;
      line-height: 26px;
      color: rgba(255, 255, 255, 0.9); /* Increased opacity for better readability */
      margin: 0;
    }
  }

  @media screen and (max-width: 767px) {
    .faq-title {
      font-size: 48px;
      line-height: 58px;
      color: #FFFFFF;
    }

    .faq-header {
      padding: 15px 20px;

      h3 {
        font-size: 18px;
      }
    }

    .faq-body {
      padding: 0 20px 15px;
    }
  }

  @media screen and (max-width: 575px) {
    .faq-title {
      font-size: 36px;
      line-height: 46px;
      color: #FFFFFF;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 60px 0;

    .faq-title {
      font-size: 30px;
      line-height: 40px;
      color: #FFFFFF;
    }

    .faq-subtitle {
      font-size: 16px;
      line-height: 26px;
    }

    .faq-header {
      h3 {
        font-size: 16px;
      }
    }
  }
`;

export default FaqWrapper;
