import styled from "styled-components";
import Bannerbg from "../../assets/images/banner-bg.png";

const KolQuestFormWrapper = styled.section`
  padding: 100px 0;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, rgba(7, 35, 50, 0.95) 0%, rgba(29, 255, 224, 0.05) 100%);
  background-image: url(${Bannerbg});
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .form-section {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.67);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 50px;
    backdrop-filter: blur(15px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .form-title {
    margin-bottom: 20px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 58px;
    color:rgb(255, 255, 255);
    text-align: center;
    
  }

  .form-subtitle {
    margin-bottom: 40px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
  }

  .kol-quest-form {
    width: 100%;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-bottom: 25px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.full-width {
      grid-column: 1 / -1;
    }
  }

  .form-label {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 5px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 15px 20px;
    border: 2px solid rgba(240, 240, 240, 0.69);
    border-radius: 12px;
    background: rgba(12, 12, 12, 0.57);
    color: #FFFFFF;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    transition: all 0.3s ease-in-out;
    backdrop-filter: blur(10px);

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
      outline: none;
      border-color:rgba(253, 186, 0, 0.97);
      background: rgba(0, 0, 0, 0.65);
      box-shadow: 0 0 15px rgba(32, 32, 32, 0.43);
    }

    &:hover {
      border-color:rgb(197, 162, 37);
    }

    &.error {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      
      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
      }
    }
  }

  .error-message {
    color: #ef4444;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 14px;
    font-weight: 500;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;

    &::before {
      content: "⚠";
      font-size: 12px;
    }
  }

  .form-select {
    cursor: pointer;

    option {
      background: rgba(0, 0, 0, 0.65);
      color: #FFFFFF;
      padding: 10px;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  .status-message {
    margin-top: 20px;
    padding: 15px 20px;
    border-radius: 12px;
    margin-bottom: 15px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    text-align: center;

    &.success {
      background: rgba(34, 197, 94, 0.2);
      border: 2px solid rgba(34, 197, 94, 0.4);
      color: #22c55e;
    }

    &.error {
      background: rgba(239, 68, 68, 0.2);
      border: 2px solid rgba(239, 68, 68, 0.4);
      color: #ef4444;
    }
  }

  .form-actions {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .submit-btn {
    margin-top: 20px;
    padding: 18px 40px;
    border: none;
    border-radius: 15px;
    background: #f5ae00;
    color: #111111;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
    justify-content: center;

    &:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(245, 176, 0, 0.64);
      background: #f5ae00;
    }

    &:active:not(.disabled) {
      transform: translateY(0);
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: rgba(29, 255, 224, 0.3);
    }
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid #072332;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .form-note {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 14px;
    color:rgba(245, 192, 59, 0.8);
    text-align: center;
    line-height: 22px;
  }

  @media screen and (max-width: 991px) {
    .form-section {
      padding: 40px 30px;
    }

    .form-title {
      font-size: 40px;
      line-height: 50px;
    }

    .form-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  @media screen and (max-width: 767px) {
    padding: 80px 0;

    .form-section {
      padding: 30px 20px;
      margin: 0 15px;
    }

    .form-title {
      font-size: 32px;
      line-height: 42px;
    }

    .form-subtitle {
      font-size: 16px;
      line-height: 24px;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 12px 15px;
      font-size: 14px;
    }

    .submit-btn {
      padding: 15px 30px;
      font-size: 16px;
      min-width: 180px;
    }
  }

  @media screen and (max-width: 480px) {
    .form-section {
      padding: 25px 15px;
      margin: 0 10px;
    }

    .form-title {
      font-size: 28px;
      line-height: 38px;
    }

    .form-grid {
      gap: 15px;
    }

    .submit-btn {
      width: 100%;
      max-width: 300px;
    }
  }
`;

export default KolQuestFormWrapper;