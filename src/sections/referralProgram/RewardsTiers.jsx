import React from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import { REFERRAL_TIERS } from "../../contracts/referralConfig";


// Default placeholder badge (inline SVG)
const DEFAULT_TIER_BADGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA2NCA2NCc+CiAgPHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nIzFmMjkzNycvPgogIDxwYXRoIGZpbGw9JyNGM0JBMkYnIGQ9J00zMiA2bDYuNSAxMy4yIDE0LjYgMi4xLTEwLjYgMTAuMyAyLjUgMTQuM0wzMiAzOS40IDE5IDQ1bDIuNS0xNC4zTDEwLjkgMjEuM2wxNC42LTIuMXonLz4KPC9zdmc+Cg==";

const Wrapper = styled.section`
  position: relative;
  padding: 60px 0 40px;
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

const Head = styled.div`
  text-align: center;
  margin-bottom: 24px;

  .title {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .subtitle {
    color: rgba(255,255,255,0.75);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 575px) {
    grid-template-columns: 1fr;
  }

  .wide {
    grid-column: 1 / -1;
  }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 22px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(600px 180px at 50% -80px, rgba(210,38,38,0.12), transparent 60%);
  }

  &:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 10px 30px rgba(210,38,38,0.15);
    border-color: rgba(210,38,38,0.45);
  }

  .medal {
    width: 100%;
    height: 120px;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    overflow: hidden;
  }
  .medal img { width: 100%; height: 100%; object-fit: contain; }

  .label { color:#fff; font-weight:700; text-transform: uppercase; letter-spacing:.5px; }
  .bonus { color:#F3BA2F; font-weight:800; font-size:20px; margin:6px 0; }
  .req { color: rgba(255,255,255,0.7); font-size: 13px; }
`;

const RewardsTiers = ({ bgImage, tierBadges = {} }) => {
  return (
    <Wrapper $bgImage={bgImage}>
      <Container>
        <Head>
          <div className="title">Rewards & Tiers</div>
          <div className="subtitle">Unlock higher bonuses by bringing more buyers — up to 70% at the Legend tier</div>
        </Head>

        <Grid>
          {REFERRAL_TIERS.map((t) => {
            const badgeSrc = tierBadges[t.tier] || DEFAULT_TIER_BADGE;
            return (
              <Card key={t.tier}>
                <div className="medal">
                  <img src={badgeSrc} alt={`Tier ${t.tier} badge`} />
                </div>
                <div className="label">{t.label}</div>
                <div className="bonus">{t.bonus}% Bonus</div>
                <div className="req">{t.minBuyers}+ buyers referred</div>
              </Card>
            );
          })}

          <Card className="wide">
            <div className="label">Referral Tips</div>
            <div style={{ color: "rgba(255,255,255,0.75)", marginTop: 6 }}>
              Share your unique link in communities and social channels, collaborate with creators, and write concise CTAs. Track performance weekly and aim for the next tier.
            </div>
          </Card>
        </Grid>
      </Container>
    </Wrapper>
  );
};

export default RewardsTiers;
