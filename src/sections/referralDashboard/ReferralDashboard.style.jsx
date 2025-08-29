// src/sections/referralDashboard/ReferralDashboard.style.jsx
import styled from "styled-components";
import BannerBgImg from "../../assets/images/banner/custom/banner-background-new.jpg";

const ReferralDashboardWrapper = styled.section`
  background-image: url(${BannerBgImg});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  min-height: 100vh;
  padding: 223px 0 60px 0;
  position: relative;
  z-index: 0;
  overflow: hidden;

  /* Specific style for dashboard container */
  .container {
    @media (min-width: 1400px) {
      max-width: 1350px;
    }
  }

  /* Overlay to ensure content readability */
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

  .dashboard-header {
    text-align: center;
    margin-bottom: 50px;
    
    .dashboard-title {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: clamp(40px, 5vw, 80px);
      font-weight: 400;
      line-height: 1.2;
      color: #FFFFFF;
      margin-bottom: 20px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    .dashboard-subtitle {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 18px;
      font-weight: 500;
      line-height: 1.6;
      color: ${({ theme }) => theme.colors.white};
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .dashboard-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .connect-wallet-prompt {
    background: rgba(12, 12, 12, 0.8);
    border: 2px solid #d22626;
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    backdrop-filter: blur(10px);
    margin-top: 40px;
    
    .prompt-content {
      max-width: 500px;
      margin: 0 auto;
      
      h3 {
        font-size: 2rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 20px;
      }
      
      p {
        font-size: 1.1rem;
        color: #cccccc;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  /* Loading spinner styles */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive adjustments */
  @media screen and (max-width: 991px) {
    .dashboard-header {
      margin-bottom: 40px;
      
      .dashboard-title {
        font-size: clamp(30px, 6vw, 60px);
      }
      
      .dashboard-subtitle {
        font-size: 16px;
        padding: 0 20px;
      }
    }
    
    .dashboard-content {
      padding: 0 15px;
    }
  }

  @media screen and (max-width: 767px) {
    padding: 180px 0 40px 0;
    
    .dashboard-header {
      margin-bottom: 30px;
      
      .dashboard-title {
        font-size: clamp(24px, 7vw, 40px);
      }
      
      .dashboard-subtitle {
        font-size: 14px;
      }
    }
    
    .connect-wallet-prompt {
      padding: 40px 20px;
      margin-top: 30px;
      
      .prompt-content {
        h3 {
          font-size: 1.5rem;
        }
        
        p {
          font-size: 1rem;
        }
      }
    }
  }

  @media screen and (max-width: 480px) {
    padding: 150px 0 40px 0;
    
    .dashboard-content {
      padding: 0 10px;
    }
    
    .connect-wallet-prompt {
      border-radius: 15px;
      padding: 30px 15px;
      
      .prompt-content {
        h3 {
          font-size: 1.3rem;
          margin-bottom: 15px;
        }
        
        p {
          font-size: 0.9rem;
        }
      }
    }
  }

  /* Custom scrollbar for better UX */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(210, 38, 38, 0.6);
    border-radius: 4px;
    
    &:hover {
      background: rgba(210, 38, 38, 0.8);
    }
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition: all 0.3s ease;
  }

  /* Focus styles for accessibility */
  button:focus,
  input:focus {
    outline: 2px solid #d22626;
    outline-offset: 2px;
  }

  /* Animation for cards appearing */
  .dashboard-content > * {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  .dashboard-content > *:nth-child(1) { animation-delay: 0.1s; }
  .dashboard-content > *:nth-child(2) { animation-delay: 0.2s; }
  .dashboard-content > *:nth-child(3) { animation-delay: 0.3s; }
  .dashboard-content > *:nth-child(4) { animation-delay: 0.4s; }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default ReferralDashboardWrapper;