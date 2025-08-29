import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

const Wrapper = styled.section`
  position: relative;
  padding: 80px 0 40px;
  background: radial-gradient(1000px 600px at 50% -100px, rgba(210,38,38,0.15), transparent 60%);
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${({ $bgImage }) => ($bgImage ? `url(${$bgImage}) center/cover no-repeat` : 'none')};
    opacity: 0.18;
  }

  .card {
    height: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    padding: 28px;
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  }

  .card:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 10px 30px rgba(210,38,38,0.15);
    border-color: rgba(210,38,38,0.45);
  }

  .title {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 14px;
  }

  .subtitle {
    color: rgba(255,255,255,0.7);
    text-align: center;
    margin-bottom: 30px;
  }

  .item-title { color: #fff; font-weight: 700; margin-bottom: 8px; }
  .item-text { color: rgba(255,255,255,0.75); margin: 0; }
`;

const InfoSection = ({ bgImage }) => {
  return (
    <Wrapper $bgImage={bgImage}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} className="text-center">
            <h2 className="title">Referral Program</h2>
            <p className="subtitle">Share your unique link, bring buyers, and unlock higher tiers and bonuses.</p>
          </Col>
        </Row>

        <Row className="g-4 mt-1">
          <Col md={4}>
            <div className="card">
              <h6 className="item-title">Share Your Link</h6>
              <p className="item-text">Get your referral link from the dashboard and promote it on socials, communities, and friends.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="card">
              <h6 className="item-title">Earn On Every Buyer</h6>
              <p className="item-text">Each buyer who joins with your link adds to your total referrals and earns you a percentage reward.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="card">
              <h6 className="item-title">Climb The Tiers</h6>
              <p className="item-text">Reach higher tiers to boost your bonus up to 70% — the more buyers you bring, the more you earn.</p>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mt-1">
          <Col md={12}>
            <div className="card">
              <h6 className="item-title">Track & Withdraw</h6>
              <p className="item-text">Monitor your progress, see your current tier and bonus, and withdraw rewards easily when thresholds are met. Always review program rules and timelines.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default InfoSection;
