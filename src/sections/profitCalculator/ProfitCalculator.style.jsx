import styled from "styled-components";
import Profit2bg from "../../assets/images/Profit2.png";

const ProfitCalculatorWrapper = styled.section`
  padding: 60px 0;
  position: relative;
  z-index: 1;
  background-image: url(${Profit2bg});  
  background-size: cover;
  background-position: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    background-size: cover;
    opacity: 0.15;
    z-index: -1;
  }
  
  .profit-calculator-container {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 300px;
  }
  
  .calculator-title {
    text-align: center;
    margin-bottom: 15px;
    
    h3 {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 24px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 5px;
    }
    
    p {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  .calculator-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .input-section {
    label {
      display: block;
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    
    .input-wrapper {
      position: relative;
      
      .currency-symbol {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        color: #F3BA2F;
        font-weight: 600;
      }
      
      input {
        width: 100%;
        height: 38px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(243, 186, 47, 0.5);
        border-radius: 6px;
        padding: 0 12px 0 30px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: #F3BA2F;
          box-shadow: 0 0 10px rgba(243, 186, 47, 0.3);
        }
        
        /* Remove spinner arrows for number input */
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        /* Firefox */
        -moz-appearance: textfield;
      }
    }
  }
  
  .slider-section {
    label {
      display: block;
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    
    .slider-container {
      position: relative;
      padding: 0 8px;
      margin-bottom: 5px;
      
      .price-slider {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        background: linear-gradient(90deg, rgba(243, 186, 47, 0.3) 0%, rgba(210, 38, 38, 0.3) 50%, rgba(243, 186, 47, 0.3) 100%);
        border-radius: 3px;
        outline: none;
        margin-bottom: 10px;
        
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #F3BA2F;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(243, 186, 47, 0.7);
          transition: all 0.2s ease;
          
          &:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(243, 186, 47, 0.9);
          }
        }
        
        &::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #F3BA2F;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(243, 186, 47, 0.7);
          transition: all 0.2s ease;
          border: none;
          
          &:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(243, 186, 47, 0.9);
          }
        }
      }
      
      .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        margin-bottom: 8px;
        
        span {
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          
          &.active {
            color: #F3BA2F;
            font-weight: 600;
            transform: scale(1.05);
          }
        }
      }
      
      .slider-values {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        
        span {
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          flex: 1;
          text-align: center;
          
          &:first-child {
            text-align: left;
          }
          
          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }
  
  .results-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    
    .result-item {
      display: flex;
      flex-direction: column;
      
      &.profit, &.roi {
        grid-column: span 2;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 10px;
        border-left: 3px solid #F3BA2F;
      }
      
      .result-label {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 4px;
      }
      
      .result-value {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        
        &.positive {
          color: rgb(29, 255, 150);
        }
        
        &.negative {
          color: #d22626;
        }
        
        &.highlight {
          color: #F3BA2F;
          font-size: 18px;
          text-shadow: 0 0 5px rgba(243, 186, 47, 0.5);
        }
      }
    }
  }
  
  .reset-section {
    display: flex;
    justify-content: center;
    margin-top: 12px;
    
    .reset-button {
      background: linear-gradient(90deg, rgba(253, 197, 55, 0.88) 0%, #f5ae00 100%);
      border: none;
      padding: 8px 200px;
      border-radius: 6px;
      font-family: ${({ theme }) => theme.fonts.primary};
      font-weight: 600;
      font-size: 18px;
      color: ${({ theme }) => theme.colors.black};
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(243, 186, 47, 0.4);
      
      &:hover {
        background: linear-gradient(90deg, rgb(253, 183, 4) 0%, rgb(253, 155, 8) 100%);
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(243, 186, 47, 0.6);
      }
      
      &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 5px rgba(243, 186, 47, 0.4);
      }
    }
  }
  
  @media screen and (max-width: 767px) {
    padding: 30px 0;
    
    .profit-calculator-container {
      padding: 15px;
    }
    
    .calculator-title {
      h3 {
        font-size: 22px;
      }
      
      p {
        font-size: 13px;
      }
    }
    
    .results-section {
      grid-template-columns: 1fr;
      
      .result-item {
        &.profit, &.roi {
          grid-column: span 1;
        }
      }
    }
    
    .reset-button {
      width: 100%;
    }
  }
`;

export default ProfitCalculatorWrapper;