import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 80px 0 30px;
  position: relative;
  background: linear-gradient(180deg, #d22626 0%, rgb(5, 21, 30) 100%); /* Updated to red gradient */
  overflow: hidden;
  z-index: 1;

  /* Footer Widgets */
  .footer-widget {
    margin-bottom: 40px;

    .footer-widget-title {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 24px;
      font-weight: 400;
      color: ${({ theme }) => theme.colors.white};
      margin-bottom: 20px;
      position: relative;
      padding-bottom: 10px;

      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, #d22626 0%, #8a1c1c 100%); /* Updated to red gradient */
        border-radius: 10px;
      }
    }
  }

  /* Custom spacing for footer columns */
  .footer-about-col {
    width: 360px;
    max-width: 360px; /* set About section width */
    flex: 0 0 360px;
  }

  .fixed-width {
    width: 160px;
    max-width: 160px;
    flex: 0 0 160px;
  }

  .footer-quick-links {
    padding-right: 0; /* Remove padding to bring sections closer */
  }

  .footer-terms {
    padding-left: 0; /* Remove padding to bring sections closer */
    padding-right: 0; /* Remove padding to bring sections closer */
  }
  
  .footer-resources {
    padding-left: 0; /* Remove padding to bring sections closer */
  }

  /* Adjust column spacing in the row */
  .row {
    --bs-gutter-x: 0.5rem; /* Further reduce default gutter space between columns */
  }

  /* Footer Links */
  .footer-links {
    margin-bottom: 30px;
    padding: 0;

    .footer-widget-title {
      font-family: ${({ theme }) => theme.fonts.title2};
      font-size: 20px; /* Smaller title for more compact appearance */
      font-weight: 400;
      color: ${({ theme }) => theme.colors.white};
      margin-bottom: 15px; /* Reduced margin */
      position: relative;
      padding-bottom: 8px; /* Reduced padding */

      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 30px; /* Shorter underline */
        height: 2px; /* Thinner underline */
        background: linear-gradient(90deg, #d22626 0%, #8a1c1c 100%); /* Updated to red gradient */
        border-radius: 10px;
      }
    }

    .footer-links-list {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        margin-bottom: 8px; /* Further reduced spacing between links */

        &:last-child {
          margin-bottom: 0;
        }

        a {
          color: ${({ theme }) => theme.colors.white}cc;
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 14px; /* Slightly smaller font size */
          font-weight: 400;
          transition: all 0.3s ease;

          &:hover {
            color: #d22626; /* Updated to red */
            padding-left: 5px;
          }
        }
      }
    }
  }

  /* Footer Logo Section */
  .footer-logo {
    margin-bottom: 20px;

    img {
      height: 50px;
      width: auto;
    }
  }

  .footer-about-text {
    color: ${({ theme }) => theme.colors.white}cc;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 15px;
    line-height: 25px;
    margin-bottom: 20px;
  }

  /* Social Links */
  .footer-social-links {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(210, 38, 38, 0.2); /* Updated with slight red tint */
      transition: all 0.3s ease;

      &:hover {
        background: #d22626; /* Updated to red */
        transform: translateY(-3px);
      }

      img {
        width: 18px;
        height: 18px;
      }
    }
  }

  /* Contact Section */
  .footer-contact-list {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin-bottom: 15px;

      a {
        color: ${({ theme }) => theme.colors.white}cc;
        font-family: ${({ theme }) => theme.fonts.primary};
        font-size: 15px;
        font-weight: 400;
        transition: all 0.3s ease;

        &:hover {
          color: #d22626; /* Updated to red */
        }
      }
    }
  }

  /* Footer Bottom */
  .footer-bottom {
    border-top: 1px solid rgba(210, 38, 38, 0.2); /* Updated with slight red tint */
    padding-top: 20px;
    margin-top: 20px;

    .footer-copyright {
      color: ${({ theme }) => theme.colors.white}99;
      font-family: ${({ theme }) => theme.fonts.primary};
      font-size: 14px;
      margin-bottom: 15px;
    }

    .footer-bottom-links {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin: 0;
      padding: 0;
      list-style: none;

      @media screen and (max-width: 767px) {
        justify-content: flex-start;
      }

      li {
        a {
          color: ${({ theme }) => theme.colors.white}99;
          font-family: ${({ theme }) => theme.fonts.primary};
          font-size: 14px;
          transition: all 0.3s ease;

          &:hover {
            color: #d22626; /* Updated to red */
          }
        }
      }
    }
  }

  /* Responsive Styles */
  @media screen and (max-width: 991px) {
    padding: 60px 0 30px;
  }

  @media screen and (max-width: 767px) {
    .footer-widget-title {
      font-size: 22px;
    }

    .footer-social-links {
      flex-wrap: wrap;
    }

    .footer-bottom {
      .row {
        flex-direction: column;
      }

      .footer-copyright, .footer-bottom-links {
        text-align: center;
        justify-content: center;
      }
    }
  }

  @media screen and (max-width: 480px) {
    padding: 50px 0 20px;

    .footer-widget-title {
      font-size: 20px;
    }

    .footer-about-text {
      font-size: 14px;
      line-height: 24px;
    }

    .footer-links-list li a,
    .footer-contact-list li a {
      font-size: 14px;
    }
  }
`;

export default FooterWrapper;
