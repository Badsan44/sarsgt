import styled from "styled-components";

const PresalePhasesWrapper = styled.section`
  padding: 150px 0; /* Increased from 100px to 120px to provide more vertical space */
  position: relative;
  z-index: 1;
  background: linear-gradient(rgba(59, 129, 164, 0.9) 2%, rgba(210, 38, 38, 0.85) 30%);
  overflow: hidden;
  
  /* Background image support */
  background-image: ${({ $bgImage }) => $bgImage ? `url(${$bgImage})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: -1;
  }

  .presale-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .presale-subtitle {
    margin-bottom: 80px; /* Increased from 50px to 80px (+30px) */
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
  }

  .presale-phases-container {
    position: relative;
    padding: 20px 0;
    max-width: 1200px;
    margin: 0 auto;
  }

  .progress-container {
    position: relative;
    width: 100%;
    margin: 0 0 40px 0;
  }

  .progress-bar-container {
    position: relative;
    height: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    z-index: 1;
    width: 100%;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #F3BA2F 0%, #F3BA2F 100%);
    border-radius: 8px;
    transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 0 20px rgba(243, 186, 47, 0.8), 0 0 5px rgba(243, 186, 47, 1);
    animation: pulse 2s infinite;
  }
  
  .hat-image {
    position: absolute;
    bottom: 20px; /* Position above the progress bar */
    left: 0;
    z-index: 1000;
    transition: left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s ease;
    animation: float 3s ease-in-out infinite;
    pointer-events: none;
    
    img {
      width: 90px;
      height: auto;
      filter: drop-shadow(0 0 15px rgba(243, 186, 47, 1)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
    }
    
    &.stage-nine {
      animation: celebrate 1.5s ease-in-out infinite;
      
      img {
        filter: drop-shadow(0 0 20px rgba(243, 186, 47, 1)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
      }
    }
  }
  
  @keyframes celebrate {
    0% {
      transform: translateX(-50%) rotate(15deg) translateY(0px);
    }
    25% {
      transform: translateX(-50%) rotate(25deg) translateY(-8px);
    }
    50% {
      transform: translateX(-50%) rotate(15deg) translateY(-4px);
    }
    75% {
      transform: translateX(-50%) rotate(5deg) translateY(-8px);
    }
    100% {
      transform: translateX(-50%) rotate(15deg) translateY(0px);
    }
  }
  
  @keyframes float {
    0% {
      transform: translateX(-50%) translateY(0px);
    }
    50% {
      transform: translateX(-50%) translateY(-5px);
    }
    100% {
      transform: translateX(-50%) translateY(0px);
    }
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 15px rgba(243, 186, 47, 0.7);
    }
    50% {
      box-shadow: 0 0 25px rgba(243, 186, 47, 0.9);
    }
    100% {
      box-shadow: 0 0 15px rgba(243, 186, 47, 0.7);
    }
  }

  /* Interactive Graph Styles */
  .presale-graph-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto 60px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .graph-title {
    text-align: center;
    margin-bottom: 15px;
    
    span {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 20px;
      font-weight: 600;
      color: #FFFFFF;
    }
  }

  .graph-content {
    display: flex;
    height: 200px;
    position: relative;
    margin-bottom: 30px;
  }

  .graph-y-axis {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 10px;
    
    .y-axis-label {
      font-size: 14px;
      color: #F3BA2F;
      font-weight: 500;
      margin-bottom: 10px;
      text-align: center;
      width: 100%;
    }
    
    .y-axis-values {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      
      span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    
    &.price-axis {
      align-items: flex-start;
      padding-right: 0;
      padding-left: 10px;
      
      .y-axis-label {
        color: #d22626;
      }
    }
  }

  .graph-chart {
    flex: 1;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    height: 100%;
  }

  .graph-bars {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    position: relative;
    padding: 0 5%;
  }

  .graph-bar {
    width: 8%;
    background-color: rgba(243, 186, 47, 0.3);
    border-radius: 4px 4px 0 0;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      filter: brightness(1.2);
      
      .graph-tooltip {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(-5px);
      }
    }
  }

  .graph-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #F3BA2F;
    border-radius: 6px;
    padding: 8px 12px;
    min-width: 120px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: #F3BA2F transparent transparent transparent;
    }
    
    div {
      font-size: 12px;
      color: #FFFFFF;
      margin-bottom: 4px;
      text-align: center;
      
      &:first-child {
        font-weight: 600;
        color: #F3BA2F;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .graph-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .price-line-segment {
    position: absolute;
    bottom: 0;
    width: 8px;
    background-color: rgba(210, 38, 38, 0.3);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .graph-x-axis {
    display: flex;
    justify-content: space-between;
    padding: 0 5%;
    margin-top: 10px;
  }

  .x-axis-label {
    width: 8%;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  /* Responsive styles for the graph */
  @media screen and (max-width: 767px) {
    .presale-graph-container {
      padding: 15px;
      margin-bottom: 40px;
    }
    
    .graph-content {
      height: 180px;
    }
    
    .graph-y-axis {
      width: 50px;
      
      .y-axis-label {
        font-size: 12px;
      }
      
      .y-axis-values span {
        font-size: 10px;
      }
    }
    
    .graph-title span {
      font-size: 18px;
    }
    
    .x-axis-label {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 575px) {
    .presale-graph-container {
      padding: 10px;
    }
    
    .graph-content {
      height: 150px;
    }
    
    .graph-y-axis {
      width: 40px;
    }
    
    .graph-bar {
      width: 10%;
    }
    
    .graph-tooltip {
      min-width: 100px;
      padding: 6px 8px;
      
      div {
        font-size: 10px;
      }
    }
    
    .x-axis-label {
      width: 10%;
      font-size: 10px;
    }
  }

  .phases-wrapper {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 120px; /* Increased from 80px to 120px (+40px) */
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: visible;
  }

  .phase-item {
    position: relative;
    width: 11.11%; /* 100% / 9 phases = 11.11% */
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      
      .phase-box {
        border-color: #F3BA2F;
        box-shadow: 0 0 15px rgba(243, 186, 47, 0.5);
      }
    }
    
    &.info-visible {
      .phase-info {
        opacity: 1;
        visibility: visible;
        /* Ensure the info box stays directly under its parent phase item */
        left: 50%;
        transform: translateX(-50%);
      }
    }
    
    &.active {
      .phase-box {
        background: #F3BA2F;
        border-color: #F3BA2F;
        
        &::before {
          background: #F3BA2F;
        }
      }
      
      .phase-number {
        color: #072332;
        font-weight: 700;
      }
    }
    
    &.completed {
      .phase-box {
        background: #F3BA2F;
        border-color: #F3BA2F;
        
        &::before {
          background: #F3BA2F;
        }
      }
      
      .phase-number {
        color: #072332;
      }
    }
  }

  .phase-box {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    position: relative;
    transition: all 0.3s ease;
    z-index: 2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    
    /* Vertical connector to progress bar */
    &::before {
      content: '';
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 30px;
      background: rgba(255, 255, 255, 0.2);
      transition: background 0.3s ease;
    }
  }
  
  /* Add connecting lines between phase boxes */
  .phase-item:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 30px;
    left: calc(50% + 30px);
    width: calc(100% - 30px);
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    z-index: 1;
    transition: background 0.3s ease;
  }
  
  /* Style for completed phase connectors */
  .phase-item.completed:not(:last-child)::after,
  .phase-item.completed .phase-box::before,
  .phase-item.active .phase-box::before {
    background: rgba(243, 186, 47, 0.7);
  }
  
  /* Add markers on the progress bar for each phase */
  .phase-item .phase-box::after {
    content: '';
    position: absolute;
    top: -48px; /* Position at the progress bar */
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    z-index: 3;
    transition: all 0.3s ease;
    border: 2px solid rgba(7, 35, 50, 0.75);
  }
  
  .phase-item.completed .phase-box::after,
  .phase-item.active .phase-box::after {
    background: #F3BA2F;
    box-shadow: 0 0 10px rgba(243, 186, 47, 0.7);
  }

  .phase-number {
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
  }

  .phase-info {
    position: absolute;
    top: 90px; /* Increased from 80px to 90px to provide more space */
    left: 50%; /* Center horizontally within the parent phase item */
    transform: translateX(-50%); /* Ensure perfect centering */
    width: 220px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid rgba(243, 186, 47, 0.5);
    border-radius: 12px;
    padding: 18px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100; /* Increased z-index to ensure visibility */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(243, 186, 47, 0.2);
    /* Ensure the info box stays within its parent phase item */
    margin-left: 0; /* Reset any margin that might affect positioning */
    
    /* Add a pointer/arrow at the top that aligns with the phase number */
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid rgba(243, 186, 47, 0.5);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: -7px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid rgba(0, 0, 0, 0.8);
    }
    
    .close-btn {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 24px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: color 0.2s ease;
      
      &:hover {
        color: #F3BA2F;
      }
    }
    
    h4 {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 18px;
      font-weight: 500;
      color: #F3BA2F;
      margin-bottom: 2px;
      text-align: center;
    }
    
       /* Add this new block for the subtitle */
    .phase-subtitle {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 14px;
      color:rgba(224, 30, 30, 0.91);
      text-align: center;
      margin-bottom: 12px; /* This is the key line */
      display: block; /* Ensures margin is applied properly */
}

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      
      span {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-size: 14px;
        
        &:first-child {
          color: rgba(255, 255, 255, 0.7);
        }
        
        &:last-child {
          color: #FFFFFF;
          font-weight: 500;
        }
      }
    }
  }

  @media screen and (max-width: 991px) {
    .presale-phases-container {
      padding: 0 10px;
      display: flex;
      flex-direction: column;
    }
    
    .progress-bar-container {
      margin: 0 0 30px 0;
      order: 1; /* Show progress bar first on mobile */
    }
    
    /* Mobile slider styles */
    .mobile-phases-wrapper {
      order: 2;
      margin-bottom: 60px;
    }
    
    .mobile-phases-slider {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      position: relative;
    }
    
    .slider-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .slider-arrow {
      background: rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(243, 186, 47, 0.7);
      color: #F3BA2F;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      
      &:hover {
        background: rgba(243, 186, 47, 0.2);
      }
      
      &.prev {
        margin-right: 10px;
      }
      
      &.next {
        margin-left: 10px;
      }
    }    
    
    .phase-info-card {
      position: relative;
      width: 280px;
      height: 220px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(243, 186, 47, 0.5);
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(243, 186, 47, 0.2);
    }
    
    .mobile-phase-info {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 20px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      
      &.active {
        opacity: 1;
        visibility: visible;
      }
      
      h4 {
        font-family: ${({ theme }) => theme.fonts.title2};
        font-size: 22px;
        font-weight: 500;
        color: #F3BA2F;
        margin-bottom: 20px;
        text-align: center;
      }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        
        span {
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 16px;
          
          &:first-child {
            color: rgba(255, 255, 255, 0.7);
          }
          
          &:last-child {
            color: #FFFFFF;
            font-weight: 500;
          }
        }
      }
    }
    
    .slider-dots {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        margin: 0 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.active {
          background: #F3BA2F;
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(243, 186, 47, 0.7);
        }
      }
    }
    
    /* Hide desktop phases on mobile */
    .desktop-phases {
      display: none;
    }
  }
  }

  @media screen and (max-width: 767px) {
    .presale-title {
      font-size: 48px;
      line-height: 58px;
    }
    
    .phase-box {
      width: 50px;
      height: 50px;
    }
    
    .phase-number {
      font-size: 18px;
    }
    
    .progress-bar-container {
      height: 14px;
      border-radius: 7px;
    }
    
    .progress-bar {
      border-radius: 7px;
    }
    
    .hat-image {
      bottom: 18px;
      
      img {
        width: 70px;
      }
    }
    
    .phase-item .phase-box::after {
      width: 10px;
      height: 10px;
      top: -36px;
    }
    
    /* Mobile slider adjustments */
    .slider-arrow {
      width: 36px;
      height: 36px;
      font-size: 16px;
    }
    
    .phase-info-card {
      width: 260px;
      height: 200px;
    }
    
    .mobile-phase-info {
      padding: 15px;
      
      h4 {
        font-size: 20px;
        margin-bottom: 15px;
      }
      
      .info-row {
        margin-bottom: 12px;
        
        span {
          font-size: 15px;
        }
      }
    }
  }

  @media screen and (max-width: 575px) {
    .presale-title {
      font-size: 36px;
      line-height: 46px;
    }
    
    .phase-box {
      width: 45px;
      height: 45px;
    }
    
    .phase-number {
      font-size: 16px;
    }
    
    .phase-info {
      width: 180px;
      padding: 12px;
      max-width: 90vw; /* Prevent overflow on very small screens */
      top: 70px; /* Adjust for smaller phase box on mobile */
      
      h4 {
        font-size: 16px;
        margin-bottom: 8px;
      }
      
      .info-row {
        margin-bottom: 6px;
      }
      
      /* Ensure the arrow aligns with the phase number */
      &::before, &::after {
        left: 50%;
      }
      
      /* Force the info box to stay within its parent phase item */
      left: 50% !important;
      transform: translateX(-50%) !important;
      margin-left: 0 !important;
    }
    
    .phase-item {
      min-width: 80px;
      margin: 0 12px;
    }
    
    /* Mobile slider adjustments for smaller screens */
    .slider-arrow {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }
    
    .phase-info-card {
      width: 220px;
      height: 190px;
    }
    
    .mobile-phase-info {
      padding: 12px;
      
      h4 {
        font-size: 18px;
        margin-bottom: 12px;
      }
      
      .info-row {
        margin-bottom: 10px;
        
        span {
          font-size: 14px;
        }
      }
    }
    
    .slider-dots .dot {
      width: 10px;
      height: 10px;
      margin: 0 4px;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 60px 0;

    .presale-title {
      font-size: 30px;
      line-height: 40px;
    }

    .presale-subtitle {
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 60px; /* Increased from 30px to 60px (+30px) */
    }
    
    .progress-bar-container {
      height: 12px;
      border-radius: 6px;
      margin-bottom: 25px;
    }
    
    .progress-bar {
      border-radius: 6px;
    }
    
    .hat-image {
      bottom: 16px;
      
      img {
        width: 65px;
      }
    }
    
    .phase-box {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }
    
    .phase-info {
      top: 65px; /* Adjust for even smaller phase box on very small screens */
      
      /* Ensure the arrow aligns with the phase number on smallest screens */
      &::before {
        top: -10px;
      }
      
      &::after {
        top: -7px;
      }
      
      /* Force the info box to stay within its parent phase item on smallest screens */
    }
    
    /* Mobile slider adjustments for smallest screens */
    .phase-info-card {
      width: 200px;
      height: 180px;
    }
    
    .mobile-phase-info {
      padding: 10px;
      
      h4 {
        font-size: 16px;
        margin-bottom: 10px;
      }
      
      .info-row {
        margin-bottom: 8px;
        
        span {
          font-size: 13px;
        }
      }
    }
    
    .slider-arrow {
      width: 30px;
      height: 30px;
      font-size: 12px;
    }
    
    .phase-item .phase-box::after {
      width: 8px;
      height: 8px;
      top: -34px;
    }
    
    .phase-item .phase-box::before {
      height: 18px;
      top: -28px;
    }
  }
`;

export default PresalePhasesWrapper;