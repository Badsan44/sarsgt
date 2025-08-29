import styled from "styled-components";

const HeaderWrapper = styled.div`
  position: absolute;
  z-index: 999;
  top: ${({ $offsetTop = 0 }) => `${$offsetTop}px`};
  left: 0;
  width: 100%;
  padding: 25px 0;
  transition: 0.3s;
  background-color: #d22626;
  border-bottom: 3px solid #FFFFFF;

  &.sticky {
    background: #d22626;
    border-bottom: 3px solid #FFFFFF;
  }

  .gittu-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .gittu-header-left {
    display: flex;
    align-items: center;
    gap: 60px;
  }

  .gittu-header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .gittu-header-right-menu {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .gittu-header-menu {
    li a {
      font-family: ${({ theme }) => theme.fonts.primary};
      font-weight: 700;
      font-size: 16px;
      line-height: 30px;
      text-transform: uppercase;
      color: var(--heading-text);
    }
  }

  .gittu-nav-menu {
    display: flex;
    align-items: center;
    gap: 30px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      a {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: #FFFFFF;
        transition: all 0.3s ease;
        position: relative;

        &:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          background: #000000; /* Changed to black */
          left: 0;
          bottom: -5px;
          transition: width 0.3s ease;
        }

        &:hover {
          color: #000000; /* Changed to black */

          &:after {
            width: 100%;
          }
        }
      }
    }
  }

  .gittu-header-menu-toggle {
    display: none;

    .menu-toggler {
      border: 0;
      padding: 0;
      background: transparent;
      color: #FFFFFF;
      font-size: 30px;
    }
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: 20px;
    li a {
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(var(--accent-color-rgb, 255, 255, 255), 0.15);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
      img {
        width: 20px;
        transition: 0.3s;
      }
      &:hover {
        opacity: 0.7;
      }
    }
    
    /* Add white border to social media icons */
    & > li:nth-child(1) > a:nth-child(1),
    & > li:nth-child(2) > a:nth-child(1),
    & > li:nth-child(3) > a:nth-child(1) {
      border: 2px solid #FFFFFF;
    }
  }

  @media screen and (max-width: 991px) {
    .gittu-header-menu-toggle {
      display: block;
    }

    .gittu-header-menu, .gittu-nav-menu {
      display: none;
    }

    .gittu-header-left {
      gap: 30px;
    }

    .gittu-header-right {
      flex-direction: row-reverse;

      .social-links {
        display: none;
      }
    }

    /* Ensure theme toggle is visible on mobile */
    .gittu-header-right-menu {
      gap: 10px;
    }
  }

  @media screen and (max-width: 480px) {
    .gittu-header-left {
      gap: 15px;
    }

    .gittu-header-logo {
      flex: 0 0 auto;
      max-width: 100px;
    }

    .dropdown-demo {
      display: none;
    }

    .gittu-header-right {
      gap: 10px;
    }

    /* Adjust theme toggle size on smaller screens */
    .gittu-header-right-menu {
      gap: 8px;
    }
  }
`;

export default HeaderWrapper;
