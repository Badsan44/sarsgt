import styled, { keyframes } from "styled-components";
import KolQuestBg from "../../assets/images/kolquestsec.png";


// Animation for the sliding effect
const slideLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// Button hover animation
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(245, 174, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 174, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 174, 0, 0);
  }
`;

const KolQuestSectionWrapper = styled.section`
  padding: 100px 0;
  background-image: url(${KolQuestBg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover; /* fill & crop */
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

  .kol-quest-header {
    text-align: center;
    margin-bottom: 60px;
    position: relative;
    z-index: 2;

    .section-title {
      font-size: 60px;
      font-weight: 400;
      color: #ffffff;
      margin-bottom: 20px;
      background: linear-gradient(135deg,rgb(255, 255, 255),rgb(255, 255, 255),rgb(255, 255, 255));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
      letter-spacing: 2px;
      text-transform: uppercase;

      @media (max-width: 768px) {
        font-size: 2.2rem;
      }

      @media (max-width: 480px) {
        font-size: 1.8rem;
      }
    }

    .section-subtitle {
      font-size: 20px;
      color: rgb(255, 255, 255);
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;

      @media (max-width: 768px) {
        font-size: 1.1rem;
        padding: 0 20px;
      }

      @media (max-width: 480px) {
        font-size: 1rem;
      }
    }
  }

  .brands-carousel-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    margin-bottom: 60px;
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
      background: linear-gradient(to left, #bb2428, transparent);
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
      border-color: rgb(255, 255, 255);
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 107, 107, 0.2);
    }

    &:hover .brand-logo {
      filter: brightness(1.1) contrast(1.2);
    }

    &:hover .brand-name {
      color: #ffffff;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
    }
  }

  .brand-logo-item {
  /* your existing “glass-panel” styles… */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid #FFFFFF;
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
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    line-height: 1.2;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  }

  .kol-quest-cta {
    text-align: center;
    position: relative;
    z-index: 2;

    .join-quest-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 15px 40px;
      background: #f5ae00;
      color: #111111;
      text-decoration: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(245, 174, 0, 0.3);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(245, 174, 0, 0.4);
        animation: ${pulse} 2s infinite;
        background: #e09d00;

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(-1px);
      }

      .btn-text {
        position: relative;
        z-index: 1;
      }

      @media (max-width: 768px) {
        padding: 16px 32px;
        font-size: 1.1rem;
      }

      @media (max-width: 480px) {
        padding: 14px 28px;
        font-size: 1rem;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 80px 0;

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

    .kol-quest-header {
      margin-bottom: 50px;
    }

    .brands-carousel-container {
      margin-bottom: 50px;
    }
  }

  @media (max-width: 480px) {
    padding: 60px 0;

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

    .kol-quest-header {
      margin-bottom: 40px;
    }

    .brands-carousel-container {
      margin-bottom: 40px;
    }
  }
`;

export default KolQuestSectionWrapper;