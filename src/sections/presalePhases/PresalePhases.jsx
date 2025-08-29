import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PresalePhasesWrapper from "./PresalePhases.style";
import hatImage from "../../assets/images/maga_cap.png";
import stagesBackground from "../../assets/images/Stages-background.png";
import { useMediaQuery } from "react-responsive";

const PresalePhases = () => {
  const CURRENT_PRESALE_STAGE = 1; // Define the current presale stage (can be fetched from API in real app)
  const INACTIVITY_TIMEOUT = 45000; // 45 seconds in milliseconds
  
  const [activePhase, setActivePhase] = useState(CURRENT_PRESALE_STAGE); // Current active phase (1-9)
  const [progressPercent, setProgressPercent] = useState(0); // Progress percentage (0-100)
  const [selectedPhase, setSelectedPhase] = useState(CURRENT_PRESALE_STAGE); // Track which phase info to display
  const [currentMobilePhase, setCurrentMobilePhase] = useState(CURRENT_PRESALE_STAGE); // For mobile slider
  
  // Media query for mobile view
  const isMobile = useMediaQuery({ maxWidth: 991 });
  
  // Ref to store the reset timeout
  const resetTimeoutRef = useRef(null);
  
  // Presale phases data with unique subtitles
  const phases = [
    {
      id: 1,
      title: "Stage 1",
      subtitle: "Spirited Away",
      price: "$0.003",
      effectivePrice: "$0.002",
      volume: "10,000,000",
      bonus: "50%",
      status: "Active"
    },
    {
      id: 2,
      title: "Stage 2",
      subtitle: "Princess Mononoke",
      price: "$0.005",
      effectivePrice: "$0.0037",
      volume: "15,000,000",
      bonus: "35%",
      status: "Upcoming"
    },
    {
      id: 3,
      title: "Stage 3",
      subtitle: "Howl's Moving Castle",
      price: "$0.006",
      effectivePrice: "$0.0046",
      volume: "20,000,000",
      bonus: "30%",
      status: "Upcoming"
    },
    {
      id: 4,
      title: "Stage 4",
      subtitle: "My Neighbor Totoro",
      price: "$0.007",
      effectivePrice: "$0.0058",
      volume: "30,000,000",
      bonus: "22%",
      status: "Upcoming"
    },
    {
      id: 5,
      title: "Stage 5",
      subtitle: "The Wind Rises",
      price: "$0.008",
      effectivePrice: "$0.0070",
      volume: "50,000,000",
      bonus: "15%",
      status: "Upcoming"
    },
    {
      id: 6,
      title: "Stage 6",
      subtitle: "Grave of the Fireflies",
      price: "$0.009",
      effectivePrice: "$0.0080",
      volume: "60,000,000",
      bonus: "12%",
      status: "Upcoming"
    },
    {
      id: 7,
      title: "Stage 7",
      subtitle: "Castle in the Sky",
      price: "$0.01",
      effectivePrice: "$0.0091",
      volume: "90,000,000",
      bonus: "10%",
      status: "Upcoming"
    },
    {
      id: 8,
      title: "Stage 8",
      subtitle: "Ponyo",
      price: "$0.012",
      effectivePrice: "$0.0109",
      volume: "100,000,000",
      bonus: "10%",
      status: "Upcoming"
    },
    {
      id: 9,
      title: "Stage 9",
      subtitle: "Kiki's Delivery Service",
      price: "$0.015",
      effectivePrice: "$0.0136",
      volume: "125,000,000",
      bonus: "8%",
      status: "Upcoming"
    }
  ];

  // Calculate progress percentage based on active phase
  const calculateProgress = (phaseId) => {
    if (phaseId === 9) {
      return 100;
    }
    
    const completedPhases = phaseId - 1;
    const activePhaseProgress = 0.5;
    const totalProgress = ((completedPhases + activePhaseProgress) / phases.length) * 100;
    return Math.min(totalProgress, 100);
  };

  // Initialize component with current stage and start inactivity timer
  useEffect(() => {
    resetToCurrentStage();
    startResetTimer();
    
    const resetTimer = () => startResetTimer();
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);
    
    return () => {
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
      
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);
  
  // Update progress when active phase changes
  useEffect(() => {
    setProgressPercent(0);
    
    const timer = setTimeout(() => {
      setProgressPercent(calculateProgress(activePhase));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activePhase]);
  
  // Function to reset to current presale stage
  const resetToCurrentStage = () => {
    setActivePhase(CURRENT_PRESALE_STAGE);
    setSelectedPhase(CURRENT_PRESALE_STAGE);
    setProgressPercent(calculateProgress(CURRENT_PRESALE_STAGE));
  };
  
  // Start or restart the inactivity timer
  const startResetTimer = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    
    resetTimeoutRef.current = setTimeout(() => {
      resetToCurrentStage();
    }, INACTIVITY_TIMEOUT);
  };
  
  // Add click outside handler to close phase info
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedPhase && !event.target.closest('.phase-item')) {
        setSelectedPhase(null);
        startResetTimer();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [selectedPhase]);

  return (
    <PresalePhasesWrapper id="presale-phases" $bgImage={stagesBackground}>
      <Container>
        <Row>
          <Col className="text-center">
            <div className="section-title">
              <h2 className="presale-title">Presale Roadmap</h2>
              <p className="presale-subtitle">Track our presale progress through each phase with increasing token value</p>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <div className="presale-phases-container">
              {/* Hat image positioned above the progress bar */}
              <div className="progress-container">
                <div 
                  className={`hat-image ${activePhase === 9 ? 'stage-nine' : ''}`}
                  style={{ 
                    left: `${activePhase === 9 ? 100 : progressPercent}%`,
                    transform: `translateX(-50%) ${activePhase === 9 ? 'rotate(15deg)' : ''}` 
                  }}
                >
                  <img src={hatImage} alt="MAGA Cap" />
                </div>
                
                {/* Progress bar */}
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Interactive Graph for Bonus and Price */}
              <div className="presale-graph-container">
                <div className="graph-title">
                  <span>Bonus & Price Trends</span>
                </div>
                <div className="graph-content">
                  <div className="graph-y-axis">
                    <div className="y-axis-label">Bonus %</div>
                    <div className="y-axis-values">
                      <span>10%</span>
                      <span>5%</span>
                      <span>0%</span>
                    </div>
                  </div>
                  <div className="graph-chart">
                    <div className="graph-bars">
                      {phases.map((phase) => (
                        <div 
                          key={`bonus-bar-${phase.id}`} 
                          className="graph-bar bonus-bar"
                          style={{ 
                            height: `${parseInt(phase.bonus) * 2}%`,
                            backgroundColor: phase.id <= activePhase ? '#F3BA2F' : 'rgba(243, 186, 47, 0.3)'
                          }}
                          data-phase={phase.id}
                          data-bonus={phase.bonus}
                          data-price={phase.price}
                        >
                          <div className="graph-tooltip">
                            <div>Stage {phase.id}</div>
                            <div>Bonus: {phase.bonus}</div>
                            <div>Price: {phase.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="graph-line">
                      {phases.map((phase, index) => {
                        const priceValue = parseFloat(phase.price.replace('$', ''));
                        const heightPercentage = (priceValue / 0.005) * 35;
                        
                        return index > 0 ? (
                          <div 
                            key={`price-line-${phase.id}`}
                            className="price-line-segment"
                            style={{
                              left: `${((index - 0.5) / (phases.length - 1)) * 100}%`,
                              height: `${heightPercentage}%`,
                              backgroundColor: phase.id <= activePhase ? '#d22626' : 'rgba(210, 38, 38, 0.3)'
                            }}
                          ></div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="graph-y-axis price-axis">
                    <div className="y-axis-label">Price $</div>
                    <div className="y-axis-values">
                      <span>$0.005</span>
                      <span>$0.003</span>
                      <span>$0.0004</span>
                    </div>
                  </div>
                </div>
                <div className="graph-x-axis">
                  {phases.map((phase) => (
                    <div key={`x-label-${phase.id}`} className="x-axis-label">
                      {phase.id}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop view - phase boxes with info popups */}
              {!isMobile && (
                <div className="phases-wrapper desktop-phases">
                  {phases.map((phase) => (
                    <div 
                      key={phase.id}
                      className={`phase-item ${phase.id === activePhase ? 'active' : ''} ${phase.id < activePhase ? 'completed' : ''} ${phase.id === selectedPhase ? 'info-visible' : ''}`}
                      onClick={(e) => {
                        setActivePhase(phase.id);
                        setProgressPercent(0);
                        setTimeout(() => {
                          setProgressPercent(calculateProgress(phase.id));
                        }, 50);
                        
                        if (selectedPhase !== null && selectedPhase !== phase.id) {
                          setSelectedPhase(null);
                          setTimeout(() => {
                            setSelectedPhase(phase.id);
                          }, 50);
                        } else {
                          setSelectedPhase(selectedPhase === phase.id ? null : phase.id);
                        }
                        
                        startResetTimer();
                        e.stopPropagation();
                      }}
                    >
                      <div className="phase-box">
                        <span className="phase-number">{phase.id}</span>
                      </div>
                      
                      <div className="phase-info">
                        <span 
                          className="close-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhase(null);
                            startResetTimer();
                          }}
                        >×</span>
                        
                        <div className="phase-title-wrapper">
                          <h4 className="text-center">{phase.title}</h4>
                          <p className="phase-subtitle text-center">{phase.subtitle}</p>
                        </div>
                        
                        <div className="info-row">
                          <span>Price:</span>
                          <span>{phase.price}</span>
                        </div>
                        <div className="info-row">
                          <span>Effective Price:</span>
                          <span>{phase.effectivePrice}</span>
                        </div>
                        <div className="info-row">
                          <span>Volume:</span>
                          <span>{phase.volume}</span>
                        </div>
                        <div className="info-row">
                          <span>Bonus:</span>
                          <span>{phase.bonus}</span>
                        </div>
                        <div className="info-row">
                          <span>Status:</span>
                          <span style={{
                            color: phase.status === "Completed" ? "#d22626" : 
                                  phase.status === "Active" ? "rgb(29, 255, 150)" : 
                                  phase.status === "Upcoming" ? "#3b81a5" : "#FFFFFF"
                          }}>
                            {phase.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Mobile view - phase info slider */}
              {isMobile && (
                <div className="mobile-phases-wrapper">
                  <div className="mobile-phases-slider">
                    <div className="slider-controls">
                      <button 
                        className="slider-arrow prev"
                        onClick={() => {
                          const prevPhase = currentMobilePhase > 1 ? currentMobilePhase - 1 : phases.length;
                          setCurrentMobilePhase(prevPhase);
                          setActivePhase(prevPhase);
                          setProgressPercent(calculateProgress(prevPhase));
                          startResetTimer();
                        }}
                      >
                        &#10094;
                      </button>
                      
                      <div className="phase-info-card">
                        {phases.map((phase) => (
                          <div 
                            key={phase.id}
                            className={`mobile-phase-info ${phase.id === currentMobilePhase ? 'active' : ''}`}
                          >
                            <div className="phase-title-wrapper">
                              <h4 className="text-center">{phase.title}</h4>
                              <p className="phase-subtitle text-center">{phase.subtitle}</p>
                            </div>
                            
                            <div className="info-row">
                              <span>Price:</span>
                              <span>{phase.price}</span>
                            </div>
                            <div className="info-row">
                              <span>Effective Price:</span>
                              <span>{phase.effectivePrice}</span>
                            </div>
                            <div className="info-row">
                              <span>Volume:</span>
                              <span>{phase.volume}</span>
                            </div>
                            <div className="info-row">
                              <span>Bonus:</span>
                              <span>{phase.bonus}</span>
                            </div>
                            <div className="info-row">
                              <span>Status:</span>
                              <span style={{
                                color: phase.status === "Completed" ? "#d22626" : 
                                      phase.status === "Active" ? "rgb(29, 255, 150)" : 
                                      phase.status === "Upcoming" ? "#3b81a5" : "#FFFFFF"
                              }}>
                                {phase.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className="slider-arrow next"
                        onClick={() => {
                          const nextPhase = currentMobilePhase < phases.length ? currentMobilePhase + 1 : 1;
                          setCurrentMobilePhase(nextPhase);
                          setActivePhase(nextPhase);
                          setProgressPercent(calculateProgress(nextPhase));
                          startResetTimer();
                        }}
                      >
                        &#10095;
                      </button>
                    </div>
                    
                    <div className="slider-dots">
                      {phases.map((phase) => (
                        <span 
                          key={phase.id}
                          className={`dot ${phase.id === currentMobilePhase ? 'active' : ''}`}
                          onClick={() => {
                            setCurrentMobilePhase(phase.id);
                            setActivePhase(phase.id);
                            setProgressPercent(calculateProgress(phase.id));
                            startResetTimer();
                          }}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </PresalePhasesWrapper>
  );
};

export default PresalePhases;