import React from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";

const Bar = styled.div`
  background: #d22626;
  color: #fff;
  padding: 12px 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 12px rgba(210, 38, 38, 0.35);
  margin-top: 92px; /* push below absolute header */

  @media (max-width: 991px) {
    margin-top: 82px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${({ $bgImage }) => ($bgImage ? `url(${$bgImage}) center/cover no-repeat` : 'none')};
    opacity: 0.18;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .badge {
    background: rgba(255,255,255,0.15);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.35);
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    text-transform: uppercase;
  }

  a {
    color: #fff;
    text-decoration: underline;
  }
`;

const AnnouncementBar = ({ bgImage }) => {
  return (
    <Bar $bgImage={bgImage}>
      <Container>
        <div className="content">
          <span className="badge">Referral</span>
          <span>Invite buyers and earn up to 70% in rewards — Become a Legend!</span>
        </div>
      </Container>
    </Bar>
  );
};

export default AnnouncementBar;
