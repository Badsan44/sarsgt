import styled from 'styled-components';

export const ThemeToggleWrapper = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 56px;
  height: 28px;
  border-radius: 25px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    opacity: 0.9;
  }

  .toggle-track {
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    border-radius: 25px;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 25px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }

  .toggle-icon {
    position: absolute;
    top: 6px;
    width: 16px;
    height: 16px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: #fff;

    &.sun {
      left: 8px;
      opacity: 0;
      color: #f9d71c;
    }

    &.moon {
      right: 8px;
      opacity: 1;
      color: #e1e1fb;
    }
  }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #1dff96;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }

  /* Light theme styles */
  &.light {
    .toggle-track {
      background: rgba(0, 0, 0, 0.1);
    }

    .toggle-icon {
      &.sun {
        opacity: 1;
      }

      &.moon {
        opacity: 0;
      }
    }

    .toggle-thumb {
      left: calc(100% - 25px);
      background: #f39c12;
    }
  }

  @media screen and (max-width: 767px) {
    width: 50px;
    height: 25px;

    .toggle-icon {
      top: 5px;
      width: 14px;
      height: 14px;

      &.sun {
        left: 6px;
      }

      &.moon {
        right: 6px;
      }
    }

    .toggle-thumb {
      width: 19px;
      height: 19px;
    }

    &.light .toggle-thumb {
      left: calc(100% - 22px);
    }
  }
`;
