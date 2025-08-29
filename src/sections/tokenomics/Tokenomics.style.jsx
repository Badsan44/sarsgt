import styled, { keyframes } from "styled-components";


// Define animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb, 29, 255, 150), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--accent-color-rgb, 29, 255, 150), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb, 29, 255, 150), 0);
  }
`;

const popOut = keyframes`
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.06);
  }
  60% {
    transform: scale(1.08);
  }
  80% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
`;

const detachSegment = keyframes`
  0% {
    transform: translateX(0) translateY(0);
    filter: brightness(1);
  }
  30% {
    transform: translateX(calc(var(--detach-x, 8px) * 0.6)) translateY(calc(var(--detach-y, -8px) * 0.6));
    filter: brightness(1.1);
  }
  50% {
    transform: translateX(var(--detach-x, 8px)) translateY(var(--detach-y, -8px));
    filter: brightness(1.2);
  }
  70% {
    transform: translateX(var(--detach-x, 6px)) translateY(var(--detach-y, -6px));
    filter: brightness(1.15);
  }
  100% {
    transform: translateX(0) translateY(0);
    filter: brightness(1);
  }
`;

const TokenomicsWrapper = styled.section`
  padding: 100px 0;
  position: relative;
  z-index: 1;
  background: var(--tokenomics-bg);
  overflow: hidden;
  transition: var(--theme-transition);
  
  &#tokenomics {
    background-image: url('../../../assets/images/Tokenomics-Elon.png');
    background-repeat: no-repeat;
    background-size: auto; /* This preserves the original size */
    background-position: top left; /* or center */
    
  }

  /* Add background gradient and patterns for more visual appeal */
  &#tokenomics:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25); /* Reduced opacity to 25% */
    z-index: -1;
  }

  .tokenomics-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .tokenomics-subtitle {
    margin-bottom: 50px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    color: var(--body-text);
    text-align: center;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  }

  .tokenomics-chart-container {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    justify-content: center;
    align-items: center;
    margin-bottom: 70px;
    animation: ${fadeInUp} 0.8s ease-out 0.3s both;

    .chart-wrapper {
      width: 800px; /* Increased from 700px to accommodate larger chart */
      height: 800px; /* Increased from 700px to accommodate larger chart */
      flex-shrink: 0;
      position: relative;
      transition: transform 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      overflow: visible; /* Allow content to overflow for tooltip */
      padding: 20px;
      border-radius: 50%;
      background: transparent;

      &:hover {
        transform: scale(1.02);
      }

      /* No glow effect */

      .custom-pie-chart {
        cursor: pointer;
        border-radius: 50%;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        z-index: 1;
        transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
        
        
        &:hover {
          transform: scale(1.02) translateY(-3px);
          box-shadow: 0 10px 20px rgb(255, 255, 255);
          transition: all 0.4s ease-in-out;
        }
        
        &.animating {
          animation: ${popOut} 0.8s ease-in-out;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
      }
      
      /* Tooltip styling */
      .pie-chart-tooltip {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 15px 20px;
        z-index: 10;
        border: 1px solid rgba(255, 255, 255, 0.1);
        pointer-events: none;
        transition: all 0.3s ease;
        animation: fadeIn 0.3s ease-out;
        
        .tooltip-title {
          font-family: ${({ theme }) => theme.fonts.title2};
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .tooltip-percentage {
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 24px;
          color: #ffffff;
        }
      }
      
      /* Loading indicator */
      .chart-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        z-index: 5;
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: var(--accent-color);
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        .loading-text {
          color: #ffffff;
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 16px;
        }
      }
    }
  }
  
  /* Keyframes for loading spinner */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Keyframes for tooltip fade in */
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .tokenomics-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
  }

  .tokenomics-card {
    flex: 1;
    min-width: 280px;
    max-width: 300px;
    border-radius: 20px;
    border: 2px solid var(--card-border);
    background: var(--card-bg);
    --card-bg-rgb: 9, 43, 60; /* RGB values for dark theme card background */
    backdrop-filter: blur(10px);
    padding: 35px 30px;
    text-align: center;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    animation: ${fadeInUp} 0.8s ease-out forwards;
    animation-delay: calc(0.4s + var(--index, 0) * 0.1s);

    /* Add subtle gradient background */
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.025) 0%, transparent 100%);
      z-index: -1;
      opacity: 0.25; /* Reduced opacity to 25% */
    }

    &:hover {
      transform: translateY(-5px) scale(1.03);
      border-color: var(--accent-color);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    &.active {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
      border-width: 2px;
      animation: ${pulse} 2s infinite;
      opacity: 0.9; /* Add 10% transparency when active */
      background: rgba(var(--card-bg-rgb, 20, 20, 20), 0.9);
    }
    
    &.highlighted {
      box-shadow: 0 0 20px 8px rgba(var(--accent-color-rgb, 29, 255, 150), 0.5);
      border-color: rgba(var(--accent-color-rgb, 29, 255, 150), 0.8);
      background: rgba(var(--card-bg-rgb, 20, 20, 20), 0.95);
      transition: all 0.3s ease;
      animation: highlightPulse 1.5s ease-in-out;
      z-index: 10; /* Ensure highlighted card appears above others */
      transform: translateY(-12px) scale(1.08); /* More pronounced pop effect */
    }
    
    @keyframes highlightPulse {
      0% { transform: translateY(-8px) scale(1.05); box-shadow: 0 0 15px 5px rgba(var(--accent-color-rgb, 29, 255, 150), 0.5); }
      25% { transform: translateY(-12px) scale(1.08); box-shadow: 0 0 25px 10px rgba(var(--accent-color-rgb, 29, 255, 150), 0.6); }
      50% { transform: translateY(-10px) scale(1.06); box-shadow: 0 0 20px 8px rgba(var(--accent-color-rgb, 29, 255, 150), 0.5); }
      75% { transform: translateY(-11px) scale(1.07); box-shadow: 0 0 22px 9px rgba(var(--accent-color-rgb, 29, 255, 150), 0.55); }
      100% { transform: translateY(-8px) scale(1.05); box-shadow: 0 0 15px 5px rgba(var(--accent-color-rgb, 29, 255, 150), 0.5); }
    }

    .percentage {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 56px;
      font-weight: 500;
      color: var(--accent-color);
      margin-bottom: 15px;
      text-shadow: 0 2px 8px rgba(var(--accent-color-rgb, 29, 255, 150), 0.3);
    }

    .allocation {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 22px;
      font-weight: 600;
      color: var(--heading-text);
      margin-bottom: 18px;
      position: relative;
      display: inline-block;

      /* Add animated divider */
      &:after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        transition: width 0.3s ease;
      }
    }

    &:hover .allocation:after,
    &.active .allocation:after {
      width: 80px;
      background: rgba(var(--accent-color-rgb, 29, 255, 150), 0.5);
    }

    .description {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 16px;
      line-height: 24px;
      color: var(--card-text);
    }
  }

  .tokenomics-details {
    margin-top: 70px;
    border-radius: 20px;
    border: 2px solid var(--card-border);
    background: var(--tokenomics-detail-bg);
    backdrop-filter: blur(20px);
    padding: 45px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    animation: ${fadeInUp} 0.8s ease-out 0.8s both;

    .details-title {
      color: var(--accent-color);
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 32px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 35px;
      position: relative;
      display: inline-block;
      left: 50%;
      transform: translateX(-50%);

      /* Add subtle underline */
      &:after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent 0%, rgba(var(--accent-color-rgb, 29, 255, 150), 0.5) 50%, transparent 100%);
      }
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 30px;
      padding-top: 10px;
    }

    .detail-item {
      text-align: center;
      padding: 20px;
      border-radius: 12px;
      transition: all 0.3s ease;
      background: #ffffff;
      animation: ${fadeInUp} 0.8s ease-out;
      animation-delay: calc(0.9s + var(--index, 0) * 0.1s);

      &:hover {
        background: rgba(var(--accent-color-rgb, 29, 255, 150), 0.1);
        transform: translateY(-5px);
      }

      .item-label {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-size: 16px;
        color: var(--body-text);
        margin-bottom: 10px;
      }

      .item-value {
        font-family: ${({ theme }) => theme.fonts.title2};
        font-size: 26px;
        font-weight: 600;
        color: var(--heading-text);
      }
    }
  }

  @media screen and (max-width: 1199px) {
    .tokenomics-chart-container {
      .chart-wrapper {
        width: 750px; /* Increased from 650px */
        height: 750px; /* Increased from 650px */
      }
    }
  }

  @media screen and (max-width: 991px) {
    .tokenomics-chart-container {
      .chart-wrapper {
        width: 700px; /* Increased from 600px */
        height: 700px; /* Increased from 600px */
        
        .pie-chart-tooltip {
          top: 15px;
          right: 15px;
          padding: 12px 16px;
          
          .tooltip-title {
            font-size: 18px;
          }
          
          .tooltip-percentage {
            font-size: 22px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    .tokenomics-title {
      font-size: 48px;
      line-height: 58px;
      color: #FFFFFF;
    }

    .tokenomics-details {
      padding: 35px;
    }

    .tokenomics-chart-container {
      flex-direction: column;

      .chart-wrapper {
        width: 650px; /* Increased from 550px */
        height: 650px; /* Increased from 550px */
      }
    }
  }

  @media screen and (max-width: 575px) {
    .tokenomics-title {
      font-size: 36px;
      line-height: 46px;
      color: #FFFFFF;
    }

    .tokenomics-chart-container {
      .chart-wrapper {
        width: 550px; /* Increased from 450px */
        height: 550px; /* Increased from 450px */
        
        .pie-chart-tooltip {
          top: 10px;
          right: 10px;
          padding: 10px 14px;
          
          .tooltip-title {
            font-size: 16px;
          }
          
          .tooltip-percentage {
            font-size: 20px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 480px) {
    padding: 60px 0;

    .tokenomics-title {
      font-size: 30px;
      line-height: 40px;
      color: #FFFFFF;
    }

    .tokenomics-subtitle {
      font-size: 16px;
      line-height: 26px;
    }

    .tokenomics-chart-container {
      .chart-wrapper {
        width: 400px; /* Increased from 320px */
        height: 400px; /* Increased from 320px */
        
        .pie-chart-tooltip {
          top: 5px;
          right: 5px;
          padding: 8px 12px;
          
          .tooltip-title {
            font-size: 14px;
            margin-bottom: 3px;
          }
          
          .tooltip-percentage {
            font-size: 18px;
          }
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border-width: 3px;
        }
        
        .loading-text {
          font-size: 14px;
        }
      }
    }

    .tokenomics-details {
      padding: 25px;

      .details-title {
        font-size: 26px;
      }

      .detail-item {
        padding: 15px 10px;

        .item-value {
          font-size: 22px;
        }
      }
    }
  }
  
  @media screen and (max-width: 375px) {
    .tokenomics-chart-container {
      .chart-wrapper {
        width: 350px; /* Increased from 280px */
        height: 350px; /* Increased from 280px */
      }
    }
  }
`;


export default TokenomicsWrapper;
