// src/components/referral/MaterialsTab.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiDownload, FiCopy, FiImage, FiShare2, FiCode, FiExternalLink, FiCamera, FiUpload, FiCheck } from 'react-icons/fi';
import { FaTelegramPlane, FaInstagram, FaRedditAlien, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { SiGmail, SiX } from 'react-icons/si';
import { useAccount, useReadContract } from 'wagmi';
import QRCode from 'qrcode';
import { generateReferralLink, getReferralCodeForAddress, copyToClipboard } from '../../utils/referralManager';
import * as ConfigModuleEth from '../../contracts/configEth';
import * as ConfigModuleBnb from '../../contracts/configBnb';

// Import placeholder images
// Link Preview backgrounds (1200×628)
import link1 from '../../assets/images/social-cards/link-preview/link1.png';
import link2 from '../../assets/images/social-cards/link-preview/link2.png';
import link3 from '../../assets/images/social-cards/link-preview/link3.png';
import link4 from '../../assets/images/social-cards/link-preview/link4.png';
import link5 from '../../assets/images/social-cards/link-preview/link5.png';

// Post backgrounds (1080×1080)
import post1 from '../../assets/images/social-cards/post/post1.png';
import post2 from '../../assets/images/social-cards/post/post2.png';
import post3 from '../../assets/images/social-cards/post/post3.png';
import post4 from '../../assets/images/social-cards/post/post4.png';
import post5 from '../../assets/images/social-cards/post/post5.png';

// Story backgrounds (1080×1920)
import story1 from '../../assets/images/social-cards/story/story1.png';
import story2 from '../../assets/images/social-cards/story/story2.png';
import story3 from '../../assets/images/social-cards/story/story3.png';
import story4 from '../../assets/images/social-cards/story/story4.png';
import story5 from '../../assets/images/social-cards/story/story5.png';

// OG Preview backgrounds (1200×628)
import og1 from '../../assets/images/social-cards/og-preview/og1.png';
import og2 from '../../assets/images/social-cards/og-preview/og2.png';
import og3 from '../../assets/images/social-cards/og-preview/og3.png';

const Wrapper = styled.div`
  margin-top: 30px;

  .card {
    background: rgba(12, 12, 12, 0.85);
    border: 2px solid #d22626;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-weight: 700;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 991px) {
    .row { grid-template-columns: 1fr; }
  }

  .controls {
    display: flex;
    gap: 15px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .input, .select {
    flex: 1;
    background: rgba(0,0,0,0.5);
    border: 1px solid #444;
    color: #fff;
    padding: 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #d22626;
    }
    
    &::placeholder {
      color: #888;
    }
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #d22626;
    color: #fff;
    background: linear-gradient(135deg, #d22626, #b91c1c);
    border-radius: 8px;
    padding: 15px 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(210, 38, 38, 0.4);
    }
    
    @media (max-width: 768px) {
      flex: 1;
      justify-content: center;
    }
  }

  .btn.secondary {
    background: rgba(255,255,255,0.08);
    border-color: #444;
  }
  .btn.secondary:hover {
    background: rgba(255,255,255,0.2);
    border-color: #d22626;
    transform: none;
    box-shadow: none;
  }
  .btn.secondary.copied {
    background: rgba(34, 197, 94, 0.2);
    border-color: #22c55e;
    color: #22c55e;
  }

  .canvasBox {
    background: rgba(255,255,255,0.05);
    border: 1px dashed rgba(210,38,38,0.6);
    border-radius: 12px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    position: relative;
    overflow: hidden;
  }

  .placeholder-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    opacity: 0.7;
  }

  .background-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .background-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .background-option {
    width: 60px;
    height: 40px;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    object-fit: cover;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #d22626;
      opacity: 0.8;
    }
    
    &.selected {
      border-color: #d22626;
      box-shadow: 0 0 10px rgba(210, 38, 38, 0.5);
    }
  }



  .two-col {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 16px;
  }

  /* Share bar align to referral link-section dimensions */
  .share-bar {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
  }
  .share-bar .btn {
    padding: 10px 12px;
    width: 100%;
    justify-content: center;
    min-height: 40px;
    white-space: nowrap;
    font-size: 0.85rem;
  }
  .share-bar .btn svg {
    font-size: 1rem;
  }

  /* Social media brand colors - override default button styles */
  .share-bar .btn.btn-twitter {
    background: #000000 !important;
    border-color: #000000 !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-twitter:hover {
    background: #1a1a1a !important;
    border-color: #1a1a1a !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  }
  
  .share-bar .btn.btn-telegram {
    background: #0088cc !important;
    border-color: #0088cc !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-telegram:hover {
    background: #006ba3 !important;
    border-color: #006ba3 !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 136, 204, 0.3);
  }
  
  .share-bar .btn.btn-instagram {
    background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%) !important;
    border-color: #e1306c !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-instagram:hover {
    background: linear-gradient(45deg, #d6842a 0%,#c55a33 25%,#b91f3a 50%,#a91e5a 75%,#9a1577 100%) !important;
    border-color: #c42d5c !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(225, 48, 108, 0.3);
  }
  
  .share-bar .btn.btn-reddit {
    background: #ff4500 !important;
    border-color: #ff4500 !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-reddit:hover {
    background: #e03d00 !important;
    border-color: #e03d00 !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(255, 69, 0, 0.3);
  }
  
  .share-bar .btn.btn-facebook {
    background: #1877f2 !important;
    border-color: #1877f2 !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-facebook:hover {
    background: #166fe5 !important;
    border-color: #166fe5 !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(24, 119, 242, 0.3);
  }
  
  .share-bar .btn.btn-linkedin {
    background: #0077b5 !important;
    border-color: #0077b5 !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-linkedin:hover {
    background: #005885 !important;
    border-color: #005885 !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 119, 181, 0.3);
  }
  
  .share-bar .btn.btn-gmail {
    background: #ea4335 !important;
    border-color: #ea4335 !important;
    color: #ffffff !important;
  }
  .share-bar .btn.btn-gmail:hover {
    background: #d33b2c !important;
    border-color: #d33b2c !important;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(234, 67, 53, 0.3);
  }
  @media (max-width: 991px) {
    .share-bar { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  @media (max-width: 600px) {
    .share-bar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  .two-col > * { min-width: 0; }
  .two-col.two-col--equal { grid-template-columns: 1fr 1fr; }
  .two-col.two-col--equal > div { display: flex; flex-direction: column; }
  .two-col.two-col--equal .codebox { flex: 1; }
  @media (max-width: 991px) {
    .two-col { grid-template-columns: 1fr; }
  }

  .textarea {
    width: 100%;
    height: 200px;
    background: rgba(0,0,0,0.5);
    border: 1px solid #444;
    color: #fff;
    padding: 10px 12px;
    border-radius: 8px;
    resize: none;
  }


  .codebox {
    width: 100%;
    height: 160px;
    background: rgba(0,0,0,0.5);
    border: 1px solid #444;
    color: #9fb3c8;
    padding: 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.85rem;
    line-height: 1.4;
    overflow: auto;
    white-space: pre-wrap;
  }

  code, pre {
    color: #ddd;
    background: rgba(0,0,0,0.6);
    border: 1px solid #444;
    border-radius: 8px;
    padding: 10px 12px;
    display: block;
    overflow-x: auto;
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

const sizeDefs = [
  { key: 'link', label: '1200×628 (Link Preview)', w: 1200, h: 628 },
  { key: 'square', label: '1080×1080 (Post)', w: 1080, h: 1080 },
  { key: 'story', label: '1080×1920 (Story)', w: 1080, h: 1920 },
];

// Background options
const backgroundOptions = [
  { 
    key: 'background1', 
    label: 'Background 1', 
    linkSrc: link1, 
    postSrc: post1, 
    storySrc: story1,
    thumbnailSrc: post1 // Use post version for thumbnail preview
  },
  { 
    key: 'background2', 
    label: 'Background 2', 
    linkSrc: link2, 
    postSrc: post2, 
    storySrc: story2,
    thumbnailSrc: post2
  },
  { 
    key: 'background3', 
    label: 'Background 3', 
    linkSrc: link3, 
    postSrc: post3, 
    storySrc: story3,
    thumbnailSrc: post3
  },
  { 
    key: 'background4', 
    label: 'Background 4', 
    linkSrc: link4, 
    postSrc: post4, 
    storySrc: story4,
    thumbnailSrc: post4
  },
  { 
    key: 'background5', 
    label: 'Background 5', 
    linkSrc: link5, 
    postSrc: post5, 
    storySrc: story5,
    thumbnailSrc: post5
  },
];

// OG Background options for Dynamic OG Image
const ogBackgroundOptions = [
  { 
    key: 'og1', 
    label: 'OG Background 1', 
    src: og1,
    thumbnailSrc: og1
  },
  { 
    key: 'og2', 
    label: 'OG Background 2', 
    src: og2,
    thumbnailSrc: og2
  },
  { 
    key: 'og3', 
    label: 'OG Background 3', 
    src: og3,
    thumbnailSrc: og3
  },
];

// Placeholder images are computed dynamically inside the component based on selected background.

function useTokenSymbol() {
  const { data: symEth } = useReadContract({ ...ConfigModuleEth.tokenSymbolCall });
  const { data: symBnb } = useReadContract({ ...ConfigModuleBnb.tokenSymbolCall });
  return useMemo(() => (symBnb || symEth || 'TOKEN'), [symEth, symBnb]);
}

const drawCard = async (canvas, {
  w, h, tokenSymbol, benefit, refCode, includeQr, referralLink, backgroundImage,
}) => {
  const ctx = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;

  // Background - custom image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = backgroundImage;
  });
  ctx.drawImage(img, 0, 0, w, h);



  // Typography (change families here if desired)
  const titleFontFamily = 'Blinker, sans-serif';
  const ctaFontFamily = 'Blinker, sans-serif';
  const benefitFontFamily = 'Blinker, sans-serif';
  const watermarkFontFamily = 'monospace';

  // Common layout paddings
  const marginLeft = Math.round(w * 0.06);
  const topY = Math.round(h * 0.08);

  // Title: Buy $TOKEN
  const titleFontSize = Math.round(w * 0.07);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${titleFontSize}px ${titleFontFamily}`;
  ctx.textBaseline = 'top';
  const title = `Buy $${tokenSymbol}`;
  ctx.fillText(title, marginLeft, topY);
  const titleBottom = topY + titleFontSize;

  // CTA badge
  const cta = 'Buy Now';
  const ctaFontSize = Math.round(w * 0.036);
  ctx.font = `${ctaFontSize}px ${ctaFontFamily}`;
  const ctaTextMetrics = ctx.measureText(cta);
  const ctaPaddingX = Math.round(w * 0.025);
  const ctaPaddingY = Math.round(h * 0.015);
  const ctaWidth = ctaTextMetrics.width + ctaPaddingX * 2;
  const ctaHeight = ctaFontSize + ctaPaddingY * 2;
  const ctaX = marginLeft;
  const ctaY = titleBottom + Math.round(h * 0.04);
  
  // Draw button background
  ctx.fillStyle = '#d22626';
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const r = Math.min(ctaHeight / 2, 15);
  ctx.moveTo(ctaX + r, ctaY);
  ctx.arcTo(ctaX + ctaWidth, ctaY, ctaX + ctaWidth, ctaY + ctaHeight, r);
  ctx.arcTo(ctaX + ctaWidth, ctaY + ctaHeight, ctaX, ctaY + ctaHeight, r);
  ctx.arcTo(ctaX, ctaY + ctaHeight, ctaX, ctaY, r);
  ctx.arcTo(ctaX, ctaY, ctaX + ctaWidth, ctaY, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Draw button text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${ctaFontSize}px ${ctaFontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(cta, ctaX + ctaWidth / 2, ctaY + ctaHeight / 2);
  ctx.textAlign = 'left'; // Reset text alignment

  // Benefit text
  const bodyFontSize = Math.round(w * 0.035);
  const lineHeight = Math.round(bodyFontSize * 1.3);
  ctx.fillStyle = '#dfe7ef';
  ctx.font = `${bodyFontSize}px ${benefitFontFamily}`;
  const maxWidth = Math.round(w * 0.86);
  const textX = marginLeft;
  const textY = ctaY + ctaHeight + Math.round(h * 0.05);
  const words = benefit.split(' ');
  let line = '';
  let y = textY;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, textX, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, textX, y);

  // Watermark with {REF_CODE}
  const watermark = `{${refCode}}`;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `${Math.round(w * 0.03)}px monospace`;
  const wmW = ctx.measureText(watermark).width;
  const wmMargin = Math.round(w * 0.04);
  ctx.fillText(watermark, w - wmW - wmMargin, h - wmMargin);

  // Optional QR
  if (includeQr && referralLink) {
    const qrSize = Math.round(Math.min(w, h) * 0.18);
    const qrDataUrl = await QRCode.toDataURL(referralLink, {
      width: qrSize,
      margin: 1,
      color: { dark: '#000000', light: '#00000000' },
      errorCorrectionLevel: 'M',
    });
    const img = new Image();
    await new Promise((resolve) => { img.onload = resolve; img.src = qrDataUrl; });
    const pad = wmMargin;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    const bg = Math.round(qrSize * 1.05);
    ctx.fillRect(pad - 4, h - bg - pad, bg, bg);
    ctx.drawImage(img, pad, h - qrSize - pad, qrSize, qrSize);
  }
};

// OG Image drawing function (1200x628)
const drawOgCard = async (canvas, {
  tokenSymbol, benefit, refCode, referralLink, backgroundImage,
}) => {
  const w = 1200;
  const h = 628;
  const ctx = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;

  // Background - custom image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = backgroundImage;
  });
  ctx.drawImage(img, 0, 0, w, h);

  // Typography
  const titleFontFamily = 'Blinker, sans-serif';
  const benefitFontFamily = 'Blinker, sans-serif';

  // Layout
  const marginLeft = Math.round(w * 0.06);
  const topY = Math.round(h * 0.12);

  // Title: Buy $TOKEN
  const titleFontSize = Math.round(w * 0.06);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${titleFontSize}px ${titleFontFamily}`;
  ctx.textBaseline = 'top';
  const title = `Buy $${tokenSymbol}`;
  ctx.fillText(title, marginLeft, topY);
  const titleBottom = topY + titleFontSize;

  // Benefit text
  const bodyFontSize = Math.round(w * 0.028);
  const lineHeight = Math.round(bodyFontSize * 1.4);
  ctx.fillStyle = '#dfe7ef';
  ctx.font = `${bodyFontSize}px ${benefitFontFamily}`;
  const maxWidth = Math.round(w * 0.85);
  const textX = marginLeft;
  const textY = titleBottom + Math.round(h * 0.08);
  
  // Word wrap for benefit text
  const words = benefit.split(' ');
  let line = '';
  let y = textY;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, textX, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, textX, y);

  // Watermark with {REF_CODE}
  const watermark = `{${refCode}}`;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `${Math.round(w * 0.025)}px monospace`;
  const wmW = ctx.measureText(watermark).width;
  const wmMargin = Math.round(w * 0.03);
  ctx.fillText(watermark, w - wmW - wmMargin, h - wmMargin);

  // QR Code (smaller for OG images)
  if (referralLink) {
    const qrSize = Math.round(Math.min(w, h) * 0.12);
    const qrDataUrl = await QRCode.toDataURL(referralLink, {
      width: qrSize,
      margin: 1,
      color: { dark: '#000000', light: '#00000000' },
      errorCorrectionLevel: 'M',
    });
    const qrImg = new Image();
    await new Promise((resolve) => { qrImg.onload = resolve; qrImg.src = qrDataUrl; });
    const pad = wmMargin;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    const bg = Math.round(qrSize * 1.05);
    ctx.fillRect(pad - 4, h - bg - pad, bg, bg);
    ctx.drawImage(qrImg, pad, h - qrSize - pad, qrSize, qrSize);
  }
};

const ShareButtons = ({ text, url }) => {
  const enc = encodeURIComponent;

  const openSharePopup = (shareUrl, { w = 640, h = 520 } = {}) => {
    const dualLeft = window.screenLeft ?? window.screenX ?? 0;
    const dualTop = window.screenTop ?? window.screenY ?? 0;
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = dualLeft + (width - w) / 2;
    const top = dualTop + (height - h) / 2;
    const features = `scrollbars=yes,toolbar=0,location=0,status=0,menubar=0,resizable=1,width=${w},height=${h},top=${Math.round(top)},left=${Math.round(left)}`;
    const win = window.open(shareUrl, 'share_popup', features);
    if (win?.focus) win.focus();
  };

  const items = [
    { key: 'twitter', label: 'X / Twitter', url: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`, w: 600, h: 450 },
    { key: 'telegram', label: 'Telegram', url: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`, w: 600, h: 600 },
    { key: 'instagram', label: 'Instagram', url: `https://www.instagram.com/`, w: 600, h: 600 },
    { key: 'reddit', label: 'Reddit', url: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(text)}`, w: 780, h: 600 },
    // New buttons
    { key: 'facebook', label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(text)}`, w: 600, h: 400 },
    { key: 'linkedin', label: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, w: 600, h: 600 },
    { key: 'gmail', label: 'Gmail', url: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${enc('Buy $TOKEN')}&body=${enc(text + '\n\n' + url)}`, w: 720, h: 600 },
  ];

  return (
    <div className="share-bar">
      {items.map(i => (
        <button
          key={i.key}
          type="button"
          className={`btn btn-${i.key}`}
          onClick={(e) => { e.preventDefault(); openSharePopup(i.url, { w: i.w, h: i.h }); }}
        >
          {i.key === 'twitter' && <SiX />}
          {i.key === 'telegram' && <FaTelegramPlane />}
          {i.key === 'instagram' && <FaInstagram />}
          {i.key === 'reddit' && <FaRedditAlien />}
          {i.key === 'facebook' && <FaFacebookF />}
          {i.key === 'linkedin' && <FaLinkedinIn />}
          {i.key === 'gmail' && <SiGmail />}
          {i.label}
        </button>
      ))}
    </div>
  );
};

const MaterialsTab = () => {
  const { address, isConnected } = useAccount();
  const tokenSymbol = useTokenSymbol();
  const [refCode, setRefCode] = useState('');
  const [refLink, setRefLink] = useState('');

  // Controls
  const [benefit, setBenefit] = useState('Utility-rich token with real use cases. Early buyers benefit most.');

  // Store benefit in localStorage when it changes
  useEffect(() => {
    if (refCode && benefit) {
      localStorage.setItem(`og-benefit-${refCode}`, benefit);
    }
  }, [refCode, benefit]);
  const [includeQr, setIncludeQr] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState('background1');
  const [selectedOgBackground, setSelectedOgBackground] = useState('og1');

  const [generated, setGenerated] = useState({ link: false, square: false, story: false });
  const [ogGenerated, setOgGenerated] = useState(false);

  // Copy state for buttons
  const [copiedOg, setCopiedOg] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedLong, setCopiedLong] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);
  const [copiedYt, setCopiedYt] = useState(false);

  const doCopy = async (text, setter) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  const canvases = {
    link: useRef(null),
    square: useRef(null),
    story: useRef(null),
  };

  // OG Image canvas (1200x628)
  const ogCanvas = useRef(null);


	  // Dynamically compute placeholder images based on selected background
	  const selectedBgOption = useMemo(() => (
	    backgroundOptions.find(bg => bg.key === selectedBackground) || backgroundOptions[0]
	  ), [selectedBackground]);
	
	  const placeholderSrcs = useMemo(() => ({
	    link: selectedBgOption?.linkSrc || link1,
	    square: selectedBgOption?.postSrc || post1,
	    story: selectedBgOption?.storySrc || story1,
	  }), [selectedBgOption]);

  useEffect(() => {
    const run = async () => {
      if (!address) return;
      try {
        const code = await getReferralCodeForAddress(address);
        if (code) {
          setRefCode(code);
          setRefLink(generateReferralLink(code));
        }
      } catch (e) {
        console.error('Failed to fetch referral code', e);
      }
    };
    run();
  }, [address]);

  // Function to get the appropriate background based on canvas dimensions
  const getBackgroundForSize = (width, height) => {
    const bgOption = backgroundOptions.find(bg => bg.key === selectedBackground);
    if (!bgOption) return null;

    const aspectRatio = width / height;
    
    if (aspectRatio > 1.5) {
      // Link Preview format (landscape)
      return bgOption.linkSrc;
    } else if (aspectRatio < 0.7) {
      // Story format (portrait)
      return bgOption.storySrc;
    } else {
      // Post format (square)
      return bgOption.postSrc;
    }
  };

  const generateAll = async () => {
    if (!refCode) return;
    const next = { ...generated };
    for (const s of sizeDefs) {
      // Get the appropriate background for this canvas size
      const backgroundImage = getBackgroundForSize(s.w, s.h);
      
      const opts = { 
        tokenSymbol, 
        benefit, 
        refCode, 
        includeQr, 
        referralLink: refLink,
        backgroundImage 
      };
      
      await drawCard(canvases[s.key].current, { w: s.w, h: s.h, ...opts });
      next[s.key] = true;
    }
    setGenerated(next);
  };

  const generateOgImage = useCallback(async () => {
    if (!refCode) return;
    
    // Get the selected OG background
    const selectedOgBgOption = ogBackgroundOptions.find(bg => bg.key === selectedOgBackground);
    if (!selectedOgBgOption) return;
    
    const opts = {
      tokenSymbol,
      benefit,
      refCode,
      referralLink: refLink,
      backgroundImage: selectedOgBgOption.src
    };
    
    await drawOgCard(ogCanvas.current, opts);
    setOgGenerated(true);
  }, [refCode, selectedOgBackground, tokenSymbol, benefit, refLink]);

  const downloadCanvas = (key) => {
    const c = canvases[key].current;
    if (!c) return;
    const link = document.createElement('a');
    link.download = `materials_${key}_${refCode}.png`;
    link.href = c.toDataURL('image/png');
    link.click();
  };



  // Auto-generate OG image when component loads or refCode changes
  useEffect(() => {
    if (refCode && ogCanvas.current) {
      generateOgImage();
    }
  }, [refCode, selectedOgBackground, generateOgImage]);

  const shareCopy = `Why buy $${tokenSymbol}? Real utility, strong roadmap, and early stage advantage. Here's how to buy in minutes:`;

  const disclosure = `Disclosure: I may earn a referral bonus if you buy using my link.`;

  const presets = {
    short: `${shareCopy}\n${refLink}\n${disclosure}`,
    long: `Buy $${tokenSymbol} today — utility-focused with growing momentum.\n\nHow to buy:\n1) Connect wallet\n2) Choose amount\n3) Confirm\n\nStart here: ${refLink}\n\n${disclosure}`,
    dm: `Hey! If you're looking for a promising buy, check out $${tokenSymbol}. Real utility and strong community. You can buy here: ${refLink} — happy to help if you have questions. (${disclosure})`,
    yt: `BUY $${tokenSymbol} — Step-by-step link: ${refLink}\n\nWhy buy: utility, roadmap, and early momentum.\n\nDisclaimer: ${disclosure}`,
  };

  const ogUrl = `${window.location.origin}/#/og/${encodeURIComponent(refCode || 'YOURCODE')}?bg=${selectedOgBackground}`;
  const widgetSrc = `${window.location.origin}/embed/buy-widget.html?ref=${encodeURIComponent(refCode || 'YOURCODE')}`;

  return (
    <Wrapper>
      {/* One-click Share Buttons */}
      <div className="card">
        <div className="card-title"><FiShare2 /> One-click Share (BUY-focused)</div>
        <ShareButtons text={shareCopy} url={refLink} />
        <div style={{ color: '#9fb3c8', marginTop: 10, fontSize: 12 }}>Copy focuses on why buy + how to buy.</div>
      </div>

      {/* Social Cards Generator */}
      <div className="card">
        <div className="card-title"><FiImage /> Social Cards for X / Instagram</div>
        <div className="controls">
          <input className="input" placeholder="Key benefit" value={benefit} onChange={e=>setBenefit(e.target.value)} />
          
          <div className="action-buttons">
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={includeQr} onChange={e=>setIncludeQr(e.target.checked)} /> Include QR Code
            </label>
            <button className="btn" onClick={generateAll}><FiCamera /> Generate All</button>
          </div>
        </div>
        
        {/* Background Selector */}
        <div className="background-selector">
          <span style={{ color: '#ccc', whiteSpace: 'nowrap' }}>Background:</span>
          <div className="background-options">
            {backgroundOptions.map(bg => (
              <img
                key={bg.key}
                src={bg.thumbnailSrc}
                alt={bg.label}
                className={`background-option ${selectedBackground === bg.key ? 'selected' : ''}`}
                onClick={() => setSelectedBackground(bg.key)}
                title={bg.label}
              />
            ))}

          </div>
        </div>
        <div className="row">
          {sizeDefs.map(s => (
            <div key={s.key}>
              <div style={{ color: '#ccc', marginBottom: 8 }}>{s.label}</div>
              <div className="canvasBox">
                {!generated[s.key] && (
                  <img 
                    src={placeholderSrcs[s.key]} 
                    alt={`${s.label} placeholder`}
                    className="placeholder-image"
                  />
                )}
                <canvas 
                  ref={canvases[s.key]} 
                  style={{ 
                    maxWidth: '100%', 
                    width: '100%',
                    display: generated[s.key] ? 'block' : 'none'
                  }} 
                />
              </div>
              {generated[s.key] && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="btn" onClick={() => downloadCanvas(s.key)}><FiDownload /> Download</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ color: '#9fb3c8', marginTop: 10, fontSize: 12 }}>
          Overlays include $TOKEN, key benefit, “Buy Now” CTA, and small {'{REF_CODE}'} watermark. Sizes: 1200×628, 1080×1080, 1080×1920.
        </div>
      </div>



      {/* Dynamic OG Image */}
      <div className="card">
        <div className="card-title"><FiImage /> Dynamic OG Image for Link Previews</div>
        
        <div style={{ color: '#ccc', marginBottom: 8 }}>OG Image URL</div>
        <div className="controls">
          <input className="input" value={ogUrl} readOnly placeholder="OG Image URL" onFocus={(e)=> e.target.select()} />
          <div className="action-buttons">
            <button className={`btn secondary ${copiedOg ? 'copied' : ''}`} onClick={() => doCopy(ogUrl, setCopiedOg)}>
              {copiedOg ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy URL</>)}
            </button>
            <a className="btn" href={ogUrl} target="_blank" rel="noreferrer"><FiExternalLink /> Open</a>
          </div>
        </div>
        
        {/* Background Selector for OG Images */}
        <div className="background-selector">
          <span style={{ color: '#ccc', whiteSpace: 'nowrap' }}>Background:</span>
          <div className="background-options">
            {ogBackgroundOptions.map(bg => (
              <img
                key={bg.key}
                src={bg.thumbnailSrc}
                alt={bg.label}
                className={`background-option ${selectedOgBackground === bg.key ? 'selected' : ''}`}
                onClick={() => setSelectedOgBackground(bg.key)}
                title={bg.label}
              />
            ))}
          </div>
        </div>



        {/* OG Image Preview */}
        <div className="canvas-container">
          <div className="canvas-wrapper">
            {!ogGenerated && (
              <div className="placeholder-image" style={{ 
                width: '100%', 
                aspectRatio: '1200/628',
                background: '#2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px'
              }}>
                Select a background to generate preview
              </div>
            )}
            <canvas
              ref={ogCanvas}
              style={{
                maxWidth: '100%',
                width: '100%',
                display: ogGenerated ? 'block' : 'none'
              }}
            />
          </div>

        </div>
        <div style={{ color: '#ccc', marginTop: 8 }}>Note</div>
        <div style={{ color: '#9fb3c8' }}>
          Generate custom OG images for social media link previews. Choose from different backgrounds to create shareable URLs.
        </div>

      </div>

      {/* Embeddables */}
      <div className="card">
        <div className="card-title"><FiCode /> Embeddables for Blogs / Link-in-bio</div>
        <div className="two-col two-col--equal">
          <div>
            <div style={{ color: '#ccc', marginBottom: 8 }}>HTML Banner</div>
            <div className="codebox">{`<a href="${refLink}" target="_blank" rel="noopener">
  <img src="${window.location.origin}/assets/banner-background-new.jpg" alt="Buy $${tokenSymbol}" style="max-width:100%;border-radius:12px" />
</a>`}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className={`btn secondary ${copiedHtml ? 'copied' : ''}`} onClick={() => doCopy(`<a href="${refLink}" target="_blank" rel="noopener">
  <img src="${window.location.origin}/assets/banner-background-new.jpg" alt="Buy $${tokenSymbol}" style="max-width:100%;border-radius:12px" />
</a>`, setCopiedHtml)}>
                {copiedHtml ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy HTML</>)}
              </button>
            </div>
          </div>
          <div>
            <div style={{ color: '#ccc', marginBottom: 8 }}>Mini “Buy $TOKEN” Widget (iframe)</div>
            <div className="codebox">{`<iframe src="${widgetSrc}" width="320" height="200" style="border:0;border-radius:12px;" allowfullscreen></iframe>`}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className={`btn secondary ${copiedIframe ? 'copied' : ''}`} onClick={() => doCopy(`<iframe src="${widgetSrc}" width="320" height="200" style="border:0;border-radius:12px;" allowfullscreen></iframe>`, setCopiedIframe)}>
                {copiedIframe ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy iframe</>)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Presets */}
      <div className="card">
        <div className="card-title"><FiCopy /> Copy Presets (BUY-oriented)</div>
        <div className="two-col two-col--equal">
          <div>
            <div style={{ color: '#ccc' }}>Short Post</div>
            <textarea className="textarea" readOnly value={presets.short} />
            <div style={{ marginTop: 8 }}>
              <button className={`btn secondary ${copiedShort ? 'copied' : ''}`} onClick={() => doCopy(presets.short, setCopiedShort)}>
                {copiedShort ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy</>)}
              </button>
            </div>
          </div>
          <div>
            <div style={{ color: '#ccc' }}>Long Post</div>
            <textarea className="textarea" readOnly value={presets.long} />
            <div style={{ marginTop: 8 }}>
              <button className={`btn secondary ${copiedLong ? 'copied' : ''}`} onClick={() => doCopy(presets.long, setCopiedLong)}>
                {copiedLong ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy</>)}
              </button>
            </div>
          </div>
        </div>
        <div className="two-col two-col--equal" style={{ marginTop: 16 }}>
          <div>
            <div style={{ color: '#ccc' }}>DM Script</div>
            <textarea className="textarea" readOnly value={presets.dm} />
            <div style={{ marginTop: 8 }}>
              <button className={`btn secondary ${copiedDm ? 'copied' : ''}`} onClick={() => doCopy(presets.dm, setCopiedDm)}>
                {copiedDm ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy</>)}
              </button>
            </div>
          </div>
          <div>
            <div style={{ color: '#ccc' }}>YouTube Description</div>
            <textarea className="textarea" readOnly value={presets.yt} />
            <div style={{ marginTop: 8 }}>
              <button className={`btn secondary ${copiedYt ? 'copied' : ''}`} onClick={() => doCopy(presets.yt, setCopiedYt)}>
                {copiedYt ? (<><FiCheck /> Copied!</>) : (<><FiCopy /> Copy</>)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default MaterialsTab;
