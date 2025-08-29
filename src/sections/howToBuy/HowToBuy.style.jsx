import styled from "styled-components";

const HowToBuyWrapper = styled.section`
  padding: 120px 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  /* Background image */
  background-image: ${({ $bgImage }) => $bgImage ? `url(${$bgImage})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #072332; /* Fallback color if image fails to load */
  
  /* Add a dark overlay for better text readability */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15); /* Darker overlay for better readability */
    z-index: -1;
  }

  .how-to-buy-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .how-to-buy-subtitle {
    margin-bottom: 80px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
  }

  .how-to-buy-steps {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 900px;
    margin: 0 auto;
  }

  .how-to-buy-step {
    display: flex;
    align-items: flex-start;
    background: rgba(0, 0, 0, 0.42);
    border-radius: 15px;
    padding: 30px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      border: 2px solid #F3BA2F;
    }
  }

  .step-number {
    position: absolute;
    top: -15px;
    left: -15px;
    width: 40px;
    height: 40px;
    background: #F3BA2F;
    color: #072332;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 26px;
    z-index: 1;
    box-shadow: 0 0 10px rgba(243, 186, 47, 0.7);
  }

  .step-icon {
    flex: 0 0 160px;
    height: 130px;
    
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 25px;
    
    overflow: hidden; /* This will ensure images stay within the circle */

    img {
      max-width: 80%;
      max-height: 80%;
      width: auto;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 5px rgba(243, 186, 47, 0.5));
      transition: transform 0.3s ease;
    }
    
    &:hover img {
      transform: scale(1.1);
    }
  }

  .step-content {
    flex: 1;

    h3 {
      font-size: 27px;
      font-weight: 600;
      color: #F3BA2F;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 18px;
      color: #FFFFFF;
      line-height: 1.6;
    }
  }

  @media screen and (max-width: 991px) {
    padding: 80px 0;

    .how-to-buy-title {
      font-size: 36px;
    }

    .how-to-buy-subtitle {
      font-size: 16px;
      margin-bottom: 40px;
    }
  }

  /* Buy Now Button Styling */
  .buy-now-button-container {
    display: flex;
    justify-content: center;
    margin-top: 60px;
  }

  .buy-now-button {
    border: none;
    padding: 15px 200px;
    min-width: 200px;
    border-radius: 10px;
    background: linear-gradient(90deg, rgba(253, 197, 55, 0.88) 0%, #f5ae00 100%);
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.black};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(243, 186, 47, 0.5);
    letter-spacing: 1px;
    text-decoration: none;

    &:hover {
      background: linear-gradient(90deg, rgb(253, 183, 4) 0%, rgb(253, 155, 8) 100%);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(243, 186, 47, 0.7);
      color: ${({ theme }) => theme.colors.black};
      text-decoration: none;
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 10px rgba(243, 186, 47, 0.4);
    }
  }

  @media screen and (max-width: 767px) {
    padding: 60px 0;

    .how-to-buy-step {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 25px 20px;
    }

    .step-icon {
      margin-right: 0;
      margin-bottom: 20px;
    }

    .step-number {
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
    }

    .buy-now-button {
      padding: 12px 30px;
      min-width: 180px;
      font-size: 16px;
      border-radius: 10px;
    }
  }
`;

export default HowToBuyWrapper;