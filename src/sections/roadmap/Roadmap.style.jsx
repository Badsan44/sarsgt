import styled from "styled-components";
import RoadmapBgImg from "../../assets/images/roadmap/Roadmap.jpg";

const RoadmapWrapper = styled.section`
  padding: 100px 0;
  position: relative;
  z-index: 1;
  background-image: url(${RoadmapBgImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  /* Add an overlay to ensure text readability */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25); /* Reduced opacity to 25% */
    z-index: -1;
  }

  .roadmap-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .roadmap-subtitle {
    margin-bottom: 50px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); /* Added for better readability */
  }

  .roadmap-timeline {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;

    &::before {
      content: '';
      position: absolute;
      width: 6px;
      background: linear-gradient(180deg, #1dffe0 0%, #1e7a6a 100%); /* Updated to match new theme */
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -3px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Added subtle shadow */

      @media screen and (max-width: 767px) {
        left: 31px;
      }
    }
  }

  .roadmap-container {
    padding: 10px 40px;
    position: relative;
    background-color: inherit;
    width: 50%;

    &.left {
      left: 0;

      &::before {
        content: " ";
        height: 0;
        position: absolute;
        top: 22px;
        width: 0;
        z-index: 1;
        right: 30px;
        border: medium solid rgba(255, 255, 255, 0.15);
        border-width: 10px 0 10px 10px;
        border-color: transparent transparent transparent rgba(255, 255, 255, 0.15);
      }

      .roadmap-content {
        &::before {
          right: -15px;
        }
      }
    }

    &.right {
      left: 50%;

      &::before {
        content: " ";
        height: 0;
        position: absolute;
        top: 22px;
        width: 0;
        z-index: 1;
        left: 30px;
        border: medium solid rgba(255, 255, 255, 0.15);
        border-width: 10px 10px 10px 0;
        border-color: transparent rgba(255, 255, 255, 0.15) transparent transparent;
      }

      .roadmap-content {
        &::before {
          left: -15px;
        }
      }
    }

    @media screen and (max-width: 767px) {
      width: 100%;
      padding-left: 70px;
      padding-right: 25px;

      &.left, &.right {
        left: 0%;
      }

      &.left::before, &.right::before {
        left: 60px;
        border-width: 10px 10px 10px 0;
        border-color: transparent rgba(255, 255, 255, 0.15) transparent transparent;
      }

      &.left .roadmap-content::before, &.right .roadmap-content::before {
        left: -15px;
      }
    }
  }

  .roadmap-content {
    padding: 30px;
    background: rgba(7, 35, 50, 0.75); /* Slightly more transparent to see the beautiful background */
    position: relative;
    border-radius: 20px;
    border: 2px solid rgba(29, 255, 224, 0.2); /* Teal border to match theme */
    backdrop-filter: blur(10px);
    transition: all 0.3s ease-in-out;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Added shadow for depth */

    &:hover {
      transform: translateY(-5px);
      border-color: rgba(29, 255, 224, 0.5);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }

    &::before {
      content: '';
      position: absolute;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #1dffe0; /* Updated to match theme */
      top: 15px;
      box-shadow: 0 0 15px rgba(29, 255, 224, 0.6); /* Added glow effect */
    }

    .roadmap-date {
      font-family: ${({ theme }) => theme.fonts.title2};
      color: #1dffe0; /* Updated to match theme */
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 15px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .roadmap-phase {
      font-family: ${({ theme }) => theme.fonts.primary};
      color: ${({ theme }) => theme.colors.white};
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .roadmap-description {
      font-family: ${({ theme }) => theme.fonts.primary};
      color: rgba(255, 255, 255, 0.9); /* Increased opacity for better readability */
      font-size: 16px;
      line-height: 24px;
    }

    ul {
      padding-left: 20px;
      margin-bottom: 0;

      li {
        margin-bottom: 8px;
        font-family: ${({ theme }) => theme.fonts.primary};
        color: rgba(255, 255, 255, 0.9); /* Increased opacity for better readability */
        font-size: 16px;
        line-height: 24px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    .roadmap-title {
      font-size: 48px;
      line-height: 58px;
      color: #FFFFFF;
    }
  }

  @media screen and (max-width: 575px) {
    .roadmap-title {
      font-size: 36px;
      line-height: 46px;
      color: #FFFFFF;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 60px 0;

    .roadmap-title {
      font-size: 30px;
      line-height: 40px;
      color: #FFFFFF;
    }

    .roadmap-subtitle {
      font-size: 16px;
      line-height: 26px;
    }

    .roadmap-content {
      padding: 20px;

      .roadmap-date {
        font-size: 20px;
      }

      .roadmap-phase {
        font-size: 18px;
      }
    }
  }
`;

export default RoadmapWrapper;
