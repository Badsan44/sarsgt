import styled, { css } from "styled-components";

const ProgressWrapper = styled.div`
  width: 100%;
  height: 20px;
  background: ${({ theme }) => theme.colors.white}1a;
  border-radius: 10px;

  .progress-done {
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    p {
      padding-right: 5px;
      font-weight: 700;
      font-size: 12px;
      line-height: 15px;
      color: ${({ theme }) => theme.colors.black};
    }
  }

  ${({ variant }) =>
    variant === "v2" &&
    css`
      height: 24px;
      background: ${({ theme }) => theme.colors.white}1a;
      backdrop-filter: blur(10px);
      border-radius: 0;

      .progress-done {
        background: #1dffe0; /* Updated to teal */
        border-radius: 0;

        p {
          padding-right: 5px;
          font-family: ${({ theme }) => theme.fonts.primary};
          font-weight: 600;
          font-size: 14px;
          line-height: 1;
        }
      }
    `}

  ${({ variant }) =>
    variant === "green" &&
    css`
      background: ${({ theme }) => theme.colors.white}1a;

      .progress-done {
        background: ${({ theme }) => theme.colors.secondary};

        p {
          color: ${({ theme }) => theme.colors.white};
        }
      }
    `}

  ${({ variant }) =>
    variant === "green2" &&
    css`
      height: 24px;
      border-radius: 12px;
      background: rgba(20, 20, 20, 0.49); /* Updated darker blue background */
      backdrop-filter: blur(10px);
      padding: 2px; /* Add padding to contain the progress fill */
      overflow: hidden; /* Clip any content that extends beyond container */

      .progress-done {
        background: #d22626; /* Updated to red color */
        border-radius: 10px; /* Slightly smaller radius to fit within container */
        height: 20px; /* Adjust height to fit within container with padding */
        max-width: 100%; /* Ensure it doesn't exceed container width */

        p {
          font-size: 14px; /* Reduced font size to fit better */
          font-weight: 600;
          line-height: 20px; /* Match the height of progress-done */
          color: #ffffff;
        }
      }
    `}

  ${({ variant }) =>
    variant === "dashed" &&
    css`
      width: 100%;
      height: 40px;
      background: ${({ theme }) => theme.colors.white}0d;
      border: 1px dashed ${({ theme }) => theme.colors.white}33;
      border-radius: 20px;
      padding: 8px;

      .progress-done {
        height: 24px;
        background: #1e7a6a; /* Updated to dark teal */
        border-radius: 12px;

        p {
          color: ${({ theme }) => theme.colors.white};
        }
      }
    `}

  ${({ variant }) =>
    variant === "dashed2" &&
    css`
      width: 100%;
      height: 40px;
      background: ${({ theme }) => theme.colors.white}0d;
      border: 1px dashed ${({ theme }) => theme.colors.white}33;
      border-radius: 20px;
      padding: 8px;

      .progress-done {
        height: 24px;
        background: ${({ theme }) => theme.colors.linearGradient2};
        border-radius: 12px;

        p {
          color: ${({ theme }) => theme.colors.white};
        }
      }
    `}

    ${({ variant }) =>
    variant === "dashed3" &&
    css`
      width: 100%;
      height: 40px;
      background: ${({ theme }) => theme.colors.white}0d;
      border: 1px dashed ${({ theme }) => theme.colors.white}4d;
      backdrop-filter: blur(5px);
      border-radius: 20px;
      padding: 8px;

      .progress-done {
        height: 24px;
        background: #1dffe0; /* Updated to teal */
        border-radius: 12px;

        p {
          color: ${({ theme }) => theme.colors.black};
        }
      }
    `}
`;

export default ProgressWrapper;
