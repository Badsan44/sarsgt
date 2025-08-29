import styled from "styled-components";
import AboutKolBg from "../../assets/images/AboutKol.png";

const KolQuestInfoWrapper = styled.section`
  padding: 100px 0;
  position: relative;
  z-index: 1;
  background: rgba(7, 35, 50, 0.9);
  background-image: url(${AboutKolBg});
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .info-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 60px;
    font-weight: 400;
    line-height: 70px;
    color: #FFFFFF;
    text-align: center;
  }

  .info-subtitle {
    margin-bottom: 50px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .info-content-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 80px;
  }

  .info-card {
    flex: 1 1 280px;
    min-width: 280px;
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.67);
    backdrop-filter: blur(10px);
    padding: 30px;
    transition: all 0.3s ease-in-out;
    text-align: center;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      border-color: #F3BA2F;
    }

    /* Updated card-icon for image sizing */
    .card-icon {
      display: block;
      width: 64px;
      height: 64px;
      object-fit: contain;
      margin: 0 auto 20px;
    }

    h3 {
      margin-bottom: 15px;
      color: #FFFFFF;
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 24px;
      font-weight: 500;
    }

    p {
      color: ${({ theme }) => theme.colors.white};
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 16px;
      line-height: 26px;
    }
  }

  .requirements-section {
    background: rgba(36, 36, 36, 0.29);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    backdrop-filter: blur(10px);
  }

  .requirements-title {
    margin-bottom: 30px;
    font-family: ${({ theme }) => theme.fonts.title2};
    font-size: 32px;
    font-weight: 500;
    color: rgb(255, 255, 255);
    text-align: center;
  }

  .requirements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .requirement-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.67);
    border-radius: 12px;
    border: 2px solid rgba(29, 255, 224, 0.1);
    transition: all 0.3s ease-in-out;

    &:hover {
      background: rgba(0, 0, 0, 0.67);
      border-color: #F3BA2F;
    }

    /* Style for img icons inside requirement-item */
    img {
      display: block;
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    /* Fallback span styling if using .req-icon */
    .req-icon {
      display: block;
      width: 32px;
      height: 32px;
      object-fit: contain;
      margin-right: 0.5rem;
    }

    .req-text {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 16px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 24px;
    }
  }

  @media screen and (max-width: 991px) {
    .info-title {
      font-size: 48px;
      line-height: 58px;
    }

    .requirements-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  @media screen and (max-width: 767px) {
    .info-title {
      font-size: 36px;
      line-height: 46px;
    }

    .info-subtitle {
      font-size: 16px;
      line-height: 26px;
    }

    .requirements-section {
      padding: 30px 20px;
    }

    .requirements-title {
      font-size: 28px;
    }

    .requirements-grid {
      grid-template-columns: 1fr;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 60px 0;

    .info-title {
      font-size: 30px;
      line-height: 40px;
    }

    .info-content-wrapper {
      margin-bottom: 60px;
    }

    .info-card {
      padding: 25px;
    }

    .requirements-section {
      padding: 25px 15px;
    }

    .requirements-title {
      font-size: 24px;
    }
  }
`;

export default KolQuestInfoWrapper;
