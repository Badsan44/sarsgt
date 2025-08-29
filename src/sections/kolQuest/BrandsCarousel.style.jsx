import styled, { keyframes } from "styled-components";
import KolQuest2Bg from "../../assets/images/kolquestsec2.png";

// Animation for the sliding effect
const slideLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const BrandsCarouselWrapper = styled.section`
  padding: 80px 0;
  background-image: url(${KolQuest2Bg});
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="50" cy="10" r="1" fill="%23ffffff" opacity="0.03"/><circle cx="10" cy="60" r="1" fill="%23ffffff" opacity="0.03"/><circle cx="90" cy="40" r="1" fill="%23ffffff" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }

  .brands-carousel-header {
    text-align: center;
    margin-bottom: 60px;
    position: relative;
    z-index: 2;

    .carousel-title {
      font-size: 60px;
      font-weight: 400;
      color:rgb(255, 255, 255);
      margin-bottom: 15px; 
      background-clip: text;      
      @media (max-width: 768px) {
        font-size: 2rem;
      }

      @media (max-width: 480px) {
        font-size: 1.5rem;
      }
    }

    .carousel-subtitle {
      font-size: 22px;
      color: rgb(255, 255, 255);
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;

      @media (max-width: 768px) {
        font-size: 1rem;
        padding: 0 20px;
      }
    }
  }

  .brands-carousel-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100px;
      z-index: 2;
      pointer-events: none;
    }

    &::before {
      left: 0;
      background: linear-gradient(to right, #bb2428, transparent);
    }

    &::after {
      right: 0;
      background: linear-gradient(to left,rgba(205, 39, 30, 0.85), transparent);
    }
  }

  .brands-carousel-track {
    display: flex;
    animation: ${slideLeft} 30s linear infinite;
    width: calc(200% + 40px);
    gap: 40px;
    margin-top: 30px;

    &:hover {
      animation-play-state: paused;
    }
  }

  .brand-item-wrapper {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    &:hover .brand-logo-item {
      transform: scale(1.1);
      background: rgb(255, 255, 255);
      border-color: rgba(255, 107, 107, 0.3);
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 107, 107, 0.2);
    }

    &:hover .brand-logo {
      filter: brightness(1.1) contrast(1.2);
    }

    &:hover .brand-name {
      color: #ffffff;
      text-shadow: 0 0 8px rgba(255, 107, 107, 0.4);
    }
  }

  .brand-logo-item {
  /* your existing “glass-panel” styles… */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;

  /* change these... */
  padding: 0;             /* remove padding so the image truly hits the edges */
  overflow: hidden;       /* clip the child */
  position: relative;     /* for absolutely-positioned img */
  width: 218px;           /* or keep min-width if you want fluid sizing */
  height: 121px;
}

.brand-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;      /* cover → fills and crops to avoid gaps */
  object-position: center;
  filter: brightness(0.9) contrast(1.1);
  transition: all 0.3s ease;
}
  }

  .brand-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    line-height: 1.2;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 60px 0;

    .brands-carousel-track {
      gap: 20px;
      animation-duration: 25s;
    }

    .brand-item-wrapper {
      gap: 8px;
    }

    .brand-logo-item {
      min-width: 169px;
      height: 97px;
      padding: 19px;

      .brand-logo {
        max-height: 61px;
      }
    }

    .brand-name {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    padding: 40px 0;

    .brands-carousel-track {
      gap: 15px;
      animation-duration: 20s;
    }

    .brand-item-wrapper {
      gap: 6px;
    }

    .brand-logo-item {
      min-width: 145px;
      height: 85px;
      padding: 12px;

      .brand-logo {
        max-height: 48px;
      }
    }

    .brand-name {
      font-size: 0.75rem;
      font-weight: 500;
    }
  }
`;

export default BrandsCarouselWrapper;