import styled, { css } from "styled-components";

import ChevronDownIcon from "../../../assets/images/icons/chevron-down.svg";

const DropdownWrapper = styled.div`
  position: relative;

  .dropdown-toggle {
    width: 100%;
    padding: 17px 20px 16px 20px;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.colors.white}26;
    background: rgba(20, 20, 20, 0.49);
    backdrop-filter: blur(5px);
    text-transform: uppercase;
    font-weight: 600;
    font-size: 19px;
    line-height: 26px;
    color: ${({ theme }) => theme.colors.white};
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer; /* Changed to pointer to indicate clickable */
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.fonts.primary};
    
    /* Dropdown arrow animation */
    &.active {
      &::after {
        top: 25px;
        transform: rotate(225deg);
      }
    }

    /* Show the dropdown arrow */
    &::after {
      content: "";
      position: absolute;
      top: 23px;
      right: 15px;
      border: 0;
      transition: 0.3s;
      width: 12px;
      height: 12px;
      border: solid ${({ theme }) => theme.colors.white};
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    
    @media screen and (max-width: 575px) {
      width: 100%;
      justify-content: center;
      margin-bottom: 15px;
    }
  }

  .dropdown-list {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 18px 16px;
    background: ${({ theme }) => theme.colors.bgHeader};
    border: 2px solid ${({ theme }) => theme.colors.white}1a;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: #161f25;

    li a {
      display: flex;
      align-items: center;
      gap: 14px;
      font-weight: 550;
      font-size: 17px;
      line-height: 16px;
      color: ${({ theme }) => theme.colors.white};

      img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }
    }
  }

  ${({ variant }) =>
    variant === "v2" &&
    css`
      .dropdown-toggle {
        min-width: 220px;
        border-radius: 30px;
      }
    `}

  ${({ variant }) =>
    variant === "v3" &&
    css`
      .dropdown-toggle {
        min-width: 220px;
        border-radius: 0;
        border-width: 1px;
      }

      .dropdown-list {
        border-radius: 0;
        border-width: 1px;
      }
    `}

  ${({ variant }) =>
    variant === "v4" &&
    css`
      .dropdown-toggle {
        min-width: 220px;
        border-radius: 10px;
        
        @media screen and (max-width: 575px) {
          min-width: 100%;
          width: 100%;
        }
      }
    `}
    
  @media screen and (max-width: 575px) {
    width: 100%;
    
    .dropdown-toggle {
      width: 100%;
      min-width: 100%;
    }
  }
`;

export default DropdownWrapper;
