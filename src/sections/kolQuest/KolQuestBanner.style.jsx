import styled from "styled-components";
import Kolkquest2bg from "../../assets/images/kolquestsec2.png";

const KolQuestBannerWrapper = styled.section`
  padding: 150px 0 100px;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, rgba(7, 35, 50, 0.95) 0%, rgba(29, 255, 224, 0.1) 100%);
  background-image: url(${Kolkquest2bg});
  background-size: cover;
  background-position: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(7, 35, 50, 0.8) 0%, rgba(29, 255, 224, 0.05) 100%);
    z-index: -1;
  }

  .kol-quest-banner-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .kol-quest-title {
    margin-bottom: 20px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 90px;
    color: rgb(255, 255, 255);
    background-clip: text;
  }

  .kol-quest-subtitle {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    color: #FFFFFF;
  }

  .kol-quest-description {
    margin-bottom: 50px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 20px;
    font-weight: 400;
    line-height: 32px;
    color: rgb(255, 255, 255);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .kol-quest-highlights {
    display: flex;
    justify-content: center;
    align-items: stretch; /* ensure all boxes have equal height */
    gap: 40px;
    flex-wrap: wrap;
  }

  .highlight-item {
    flex: 1 1 180px; /* equal flex basis and growth */
    max-width: 250px;
    min-height: 180px; /* ensure consistent height */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.67);
    border: 2px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: translateY(-5px);
      background: rgba(0, 0, 0, 0.67);
      border-color: #F3BA2F;
    }
  }

  .highlight-icon {
    display: block;
    width: 64px;
    height: 64px;
    object-fit: contain;
    margin-bottom: 10px;
  }

  .highlight-text {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    text-align: center;
  }

  @media screen and (max-width: 991px) {
    .kol-quest-title {
      font-size: 64px;
      line-height: 74px;
    }

    .kol-quest-subtitle {
      font-size: 28px;
      line-height: 38px;
    }

    .kol-quest-highlights {
      gap: 30px;
    }
  }

  @media screen and (max-width: 767px) {
    padding: 120px 0 80px;

    .kol-quest-title {
      font-size: 48px;
      line-height: 58px;
    }

    .kol-quest-subtitle {
      font-size: 24px;
      line-height: 34px;
    }

    .kol-quest-description {
      font-size: 18px;
      line-height: 28px;
    }

    .kol-quest-highlights {
      gap: 20px;
    }

    .highlight-item {
      padding: 15px;
    }
  }

  @media screen and (max-width: 575px) {
    .kol-quest-title {
      font-size: 36px;
      line-height: 46px;
    }

    .kol-quest-subtitle {
      font-size: 20px;
      line-height: 30px;
    }

    .kol-quest-description {
      font-size: 16px;
      line-height: 26px;
    }

    .kol-quest-highlights {
      flex-direction: column;
      align-items: stretch; /* still stretch for equal width */
    }

    .highlight-item {
      width: 100%;
      min-height: auto;
      max-width: 250px;
    }
  }
`;

export default KolQuestBannerWrapper;
