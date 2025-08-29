import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import ProfitCalculatorWrapper from "../profitCalculator/ProfitCalculator.style";
import { REFERRAL_TIERS } from "../../contracts/referralConfig";

const Card = styled.div`
  position: relative;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px;
`;

const Section = styled.section`
  position: relative;
  z-index: 0;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${({ $bgImage }) => ($bgImage ? `url(${$bgImage}) center/cover no-repeat` : 'none')};
    opacity: 0.18;
  }
`;

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  background: rgba(0,0,0,.35);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px;
  padding: 12px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const TierPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 6px;

  ${({ $achieved }) => $achieved ? `
    border: 1px solid rgba(243,186,47,0.6);
    background: rgba(243,186,47,0.12);
    color: #F3BA2F;
    font-weight: 700;
  ` : `
    border: 1px solid #444;
    background: rgba(255,255,255,.05);
    color: #fff;
  `}
`;


const EarningsCalculator = ({ bgImage }) => {
  const [buyers, setBuyers] = useState(10);
  const [avgSpend, setAvgSpend] = useState(100);

  const tier = useMemo(() => {
    // find highest tier less than or equal to buyers
    let current = REFERRAL_TIERS[0];
    for (const t of REFERRAL_TIERS) {
      if (buyers >= t.minBuyers) current = t;
    }
    return current;
  }, [buyers]);

  const earnings = useMemo(() => {
    const totalVolume = buyers * avgSpend;
    const pct = tier.bonus / 100;
    return totalVolume * pct;
  }, [buyers, avgSpend, tier]);

  return (
    <ProfitCalculatorWrapper>
      <Section $bgImage={bgImage}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card>
                <h3 style={{ color: "#fff", marginBottom: 10 }}>Earnings Calculator</h3>
                <p style={{ color: "rgba(255,255,255,.7)", marginBottom: 20 }}>
                  Estimate how much you can earn based on your referred buyers and average purchase size.
                </p>

              <Row className="g-3">
                <Col md={4}>
                  <label style={{ color: "#fff" }}>Buyers Referred</label>
                  <input type="number" min="0" value={buyers} onChange={(e)=>setBuyers(parseInt(e.target.value||0))} className="form-control" />
                </Col>
                <Col md={4}>
                  <label style={{ color: "#fff" }}>Average Spend per Buyer (USDT)</label>
                  <input type="number" min="0" value={avgSpend} onChange={(e)=>setAvgSpend(parseFloat(e.target.value||0))} className="form-control" />
                </Col>
                <Col md={4}>
                  <label style={{ color: "#fff" }}>Calculated Tier</label>
                  <div className="form-control" style={{ background:"rgba(0,0,0,.3)", color:"#fff" }}>
                    Tier {tier.tier} — {tier.label} ({tier.bonus}% bonus)
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <TierGrid>
                    {REFERRAL_TIERS.map(t => {
                      const achieved = buyers >= t.minBuyers;
                      return (
                        <TierPill key={t.tier} $achieved={achieved}>
                          T{t.tier} {t.label}: {t.bonus}% • {t.minBuyers}+ buyers
                        </TierPill>
                      );
                    })}
                  </TierGrid>
                </Col>
              </Row>

              <Row className="mt-3 g-3">
                <Col md={6}>
                  <div style={{ color:"rgba(255,255,255,.8)" }}>Bonus Percentage</div>
                  <div style={{ color:"#F3BA2F", fontWeight:800, fontSize:22 }}>{tier.bonus}%</div>

                  <div style={{ color:"rgba(255,255,255,.8)", marginTop:10 }}>Total Referral Volume</div>
                  <div style={{ color:"#F3BA2F", fontWeight:700, fontSize:22 }}>${(buyers*avgSpend).toLocaleString()}</div>
                </Col>
                <Col md={6}>
                  <div style={{ color:"rgba(255,255,255,.8)" }}>Current Tier</div>
                  <div style={{ color:"#d22626", fontWeight:800, fontSize:22 }}>Tier {tier.tier} — {tier.label}</div>

                  <div style={{ color:"rgba(255,255,255,.8)", marginTop:10 }}>Estimated Earnings</div>
                  <div style={{ color:"#22c55e", fontWeight:700, fontSize:22 }}>${earnings.toLocaleString()}</div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
      </Section>
    </ProfitCalculatorWrapper>
  );
};

export default EarningsCalculator;
