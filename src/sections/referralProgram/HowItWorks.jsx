import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

const Wrapper = styled.section`
  position: relative;
  padding: 40px 0 80px;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${({ $bgImage }) => ($bgImage ? `url(${$bgImage}) center/cover no-repeat` : 'none')};
    opacity: 0.18;
  }

  .step {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    padding: 22px;
    height: 100%;
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  }

  .step:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 10px 30px rgba(210,38,38,0.15);
    border-color: rgba(210,38,38,0.45);
  }

  .step-number {
    width: 38px; height: 38px; border-radius: 50%;
    background: #d22626; color:#fff; display:flex; align-items:center; justify-content:center;
    font-weight: 800; margin-bottom: 10px;
  }

  h6 { color:#fff; font-weight:700; margin-bottom:6px; }
  p { color: rgba(255,255,255,0.75); margin:0; }
`;

const HowItWorks = ({ bgImage }) => {
  return (
    <Wrapper $bgImage={bgImage}>
      <Container>
        <Row className="justify-content-center mb-3">
          <Col lg={10} className="text-center">
            <h3 style={{ color: "#fff", fontWeight: 800, textTransform: "uppercase" }}>How It Works</h3>
            <p style={{ color: "rgba(255,255,255,.7)" }}>Simple steps to start earning referral rewards</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <div className="step">
              <div className="step-number">1</div>
              <h6>Create & Share</h6>
              <p>Go to your Referral Dashboard, copy your unique link, and share it everywhere.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="step">
              <div className="step-number">2</div>
              <h6>Invite Buyers</h6>
              <p>When users purchase through your link, they count as your referrals and increase your tier.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="step">
              <div className="step-number">3</div>
              <h6>Earn & Withdraw</h6>
              <p>Earn up to 70% depending on your tier. Withdraw rewards subject to cooldown and minimums.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default HowItWorks;
