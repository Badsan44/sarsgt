import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProfitCalculatorWrapper from "./ProfitCalculator.style";

const ProfitCalculator = ({ currentPrice = 0.003, currentStage = 1 }) => {
  // Price constants (in USDT)
  const PRICES = {
    FIRST_STAGE: 0.003,  // First stage starting price
    CURRENT_STAGE: currentPrice, // Current stage price from contract
    LAUNCH: 0.01,           // Launch price
    MOON: 1                 // Moon price
  };

  // State variables
  const [investment, setInvestment] = useState(100); // Default investment amount
  const [selectedPrice, setSelectedPrice] = useState(PRICES.FIRST_STAGE); // Default selected price is first stage
  const [sliderValue, setSliderValue] = useState(0); // Default slider position (start of range)
  const [profit, setProfit] = useState(0); // Calculated profit
  const [tokenAmount, setTokenAmount] = useState(0); // Amount of tokens for the investment

  // Calculate profit when investment or selected price changes
  useEffect(() => {
    if (investment > 0) {
      // Calculate how many tokens the user would get if investing at first stage price
      const tokens = investment / PRICES.FIRST_STAGE;
      setTokenAmount(tokens);
      
      // Calculate the value of those tokens at the selected price
      const futureValue = tokens * selectedPrice;
      
      // Calculate profit
      // If the selected price is the first stage price, profit should be the investment amount (break-even)
      // This represents the starting point where you haven't made any profit yet
      if (selectedPrice === PRICES.FIRST_STAGE) {
        setProfit(0); // No profit at starting price (break-even)
      } else {
        const calculatedProfit = futureValue - investment;
        setProfit(calculatedProfit);
      }
    } else {
      setTokenAmount(0);
      setProfit(0);
    }
  }, [investment, selectedPrice]);

  // Handle investment input change
  const handleInvestmentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setInvestment(value);
  };

  // Convert slider value (0-1000) to price using logarithmic scale
  // This gives better control over the lower price ranges
  const sliderToPrice = (sliderVal) => {
    // Using a logarithmic scale to make the slider more usable
    // Min value is FIRST_STAGE (0.000001)
    // Max value is MOON (1.0)
    const minLog = Math.log10(PRICES.FIRST_STAGE);
    const maxLog = Math.log10(PRICES.MOON);
    const scale = (sliderVal / 1000) * (maxLog - minLog) + minLog;
    return Math.pow(10, scale);
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    
    // Calculate price based on slider position (logarithmic scale)
    const price = sliderToPrice(value);
    setSelectedPrice(price);
  };

  // Reset calculator to default values
  const handleReset = () => {
    setInvestment(100);
    setSliderValue(0);
    setSelectedPrice(PRICES.FIRST_STAGE);
  };

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  // Format price with appropriate decimal places based on magnitude
  const formatPrice = (price) => {
    if (price >= 0.01) {
      return price.toFixed(2);
    } else if (price >= 0.0001) {
      return price.toFixed(4);
    } else {
      return price.toFixed(6);
    }
  };

  return (
    <ProfitCalculatorWrapper id="profit-calculator">
      <Container>
        <Row className="justify-content-center">
          <Col lg={12} className="text-center mb-5">
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              color: '#FFFFFF',
              marginBottom: '15px',
              textTransform: 'uppercase'
            }}>Profit Calculator</h2>
            <p style={{ 
              fontSize: '16px', 
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Estimate your potential returns by investing in our token
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="profit-calculator-container">
              <div className="calculator-title">
                <h3>Investment Simulator</h3>
                <p>Calculate your potential profit if you had invested at the first stage price</p>
              </div>
              
              <div className="calculator-content">
                <div className="input-section">
                  <label htmlFor="investment">Investment Amount (USDT)</label>
                  <div className="input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      id="investment"
                      value={investment}
                      onChange={handleInvestmentChange}
                      min="0"
                      step="10"
                    />
                  </div>
                </div>
                
                <div className="slider-section">
                  <label>Adjust Future Price Prediction</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="1"
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="price-slider"
                    />
                    <div className="slider-labels">
                      <span className={sliderValue <= 333 ? 'active' : ''}>First Stage</span>
                      <span className={sliderValue > 333 && sliderValue <= 666 ? 'active' : ''}>Launch</span>
                      <span className={sliderValue > 666 ? 'active' : ''}>Moon</span>
                    </div>
                    <div className="slider-values">
                      <span>${PRICES.FIRST_STAGE.toFixed(6)}</span>
                      <span>${PRICES.MOON.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="results-section">
                  <div className="result-item">
                    <span className="result-label">Token Amount:</span>
                    <span className="result-value">{formatNumber(tokenAmount)} BNBMAGA</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">First Stage Price:</span>
                    <span className="result-value">${PRICES.FIRST_STAGE.toFixed(6)} USDT</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Current Price (Stage {currentStage}):</span>
                    <span className="result-value">${formatPrice(PRICES.CURRENT_STAGE)} USDT</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Predicted Price:</span>
                    <span className="result-value highlight">${formatPrice(selectedPrice)} USDT</span>
                  </div>
                  <div className="result-item profit">
                    <span className="result-label">Potential Profit:</span>
                    <span className={`result-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                      ${formatNumber(profit)} USDT
                    </span>
                  </div>
                  <div className="result-item roi">
                    <span className="result-label">ROI:</span>
                    <span className={`result-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                      {investment > 0 ? ((profit / investment) * 100).toFixed(2) : '0.00'}%
                    </span>
                  </div>
                </div>
                
                <div className="reset-section">
                  <button className="reset-button" onClick={handleReset}>
                    Reset Calculator
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </ProfitCalculatorWrapper>
  );
};

export default ProfitCalculator;