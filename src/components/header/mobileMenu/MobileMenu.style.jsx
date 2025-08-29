import styled from "styled-components";

const MobileMenuWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &::before {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    background: var(--bg-header-mobile);
    content: "";
    z-index: -1;
  }

  .gittu-mobile-menu-content {
    width: 400px;
    height: 100%;
    background: var(--bg-header);
    padding: 30px;
    animation: 0.4s sidebarAnimation;
    overflow-y: auto;
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
    scrollbar-width: none;
    transition: width 0.3s;

    &::-webkit-scrollbar {
      display: none;
      /* Safari and Chrome */
    }
  }

  @keyframes sidebarAnimation {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0%);
    }
  }

  .mobile-menu-top {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-bottom: 100px;
  }

  .mobile-logo {
    img {
      max-width: 100px;
    }
  }

  .mobile-menu-close {
    border: 0;
    background: transparent;
    font-size: 20px;
    color: var(--heading-text);
  }

  .mobile-menu-list {
    text-align: center;
    margin-bottom: 40px;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin-bottom: 10px;

      button {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-weight: 500;
        font-size: 18px;
        line-height: 40px;
        color: var(--heading-text);
        transition: 0.3s;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;

        &:hover {
          color: #000000; /* Changed to black */
        }
      }

      a {
        font-family: ${({ theme }) => theme.fonts.primary};
        font-weight: 500;
        font-size: 18px;
        line-height: 40px;
        color: var(--heading-text);
        transition: 0.3s;
        display: block;

        &.active {
          color: var(--accent-color);
        }

        &:hover {
          color: #000000; /* Changed to black */
        }
      }
    }

    .submenu-list {
      margin-top: 10px;

      ul {
        background: rgba(var(--accent-color-rgb, 29, 255, 150), 0.05);
        border-radius: 10px;
        padding: 10px;
      }

      li {
        margin-bottom: 5px;

        a {
          font-size: 16px;
          line-height: 30px;
        }
      }
    }
  }

  .mobile-social-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
    padding: 0;
    list-style: none;

    li a {
      width: 40px;
      height: 40px;
      background: rgba(var(--accent-color-rgb, 255, 255, 255), 0.15);
      backdrop-filter: blur(10px);
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      transition: 0.3s;
      img {
        width: 18px;
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

  .connect-wallet-btn {
    width: 100%;
    margin-bottom: 40px;
    border: 2px solid #000000; /* Added 2px black border */
  }

  .mobile-menu-bottom {
    margin-top: 40px;
    border-top: 1px solid rgba(var(--accent-color-rgb, 29, 255, 150), 0.1);
    padding-top: 20px;

    .mobile-menu-bottom-inner {
      .theme-toggle-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;

        span {
          font-family: ${({ theme }) => theme.fonts.primary};
          color: var(--heading-text);
          font-size: 16px;
        }
      }

      .copyright-text {
        text-align: center;

        p {
          font-family: ${({ theme }) => theme.fonts.primary};
          color: var(--body-text);
          font-size: 14px;
          margin: 0;
        }
      }
    }
  }

  @media screen and (max-width: 480px) {
    .gittu-mobile-menu-content {
      width: 100%;
      padding: 20px;
    }

    .mobile-menu-top {
      margin-bottom: 60px;
    }

    .mobile-menu-list {
      margin-bottom: 30px;
    }
  }
`;

export default MobileMenuWrapper;
