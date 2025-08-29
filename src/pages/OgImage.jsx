import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import QRCode from 'qrcode';
import * as ConfigModuleEth from '../contracts/configEth';
import * as ConfigModuleBnb from '../contracts/configBnb';

// Import OG background images
import og1 from '../assets/images/social-cards/og-preview/og1.png';
import og2 from '../assets/images/social-cards/og-preview/og2.png';
import og3 from '../assets/images/social-cards/og-preview/og3.png';

const ogBackgroundOptions = [
  { key: 'og1', src: og1 },
  { key: 'og2', src: og2 },
  { key: 'og3', src: og3 },
];

function useTokenSymbol() {
  const { data: symEth } = useReadContract({ ...ConfigModuleEth.tokenSymbolCall });
  const { data: symBnb } = useReadContract({ ...ConfigModuleBnb.tokenSymbolCall });
  return useMemo(() => (symBnb || symEth || 'TOKEN'), [symEth, symBnb]);
}

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

const OgImage = () => {
  const { refCode } = useParams();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);
  const [imageGenerated, setImageGenerated] = useState(false);
  const tokenSymbol = useTokenSymbol();

  useEffect(() => {
    const generateImage = async () => {
      if (!canvasRef.current || !refCode) return;

      // Get parameters
      const bg = searchParams.get('bg') || 'og1';
      const selectedBgOption = ogBackgroundOptions.find(option => option.key === bg);
      
      if (!selectedBgOption) return;

      // Try to get custom benefit from localStorage, fallback to default
      const storedBenefit = localStorage.getItem(`og-benefit-${refCode}`);
      const benefit = storedBenefit || 'Utility-rich token with real use cases. Early buyers benefit most.';
      const referralLink = `${window.location.origin}/?ref=${refCode}`;

      const opts = {
        tokenSymbol,
        benefit,
        refCode: refCode || 'YOURCODE',
        referralLink,
        backgroundImage: selectedBgOption.src
      };

      try {
        await drawOgCard(canvasRef.current, opts);
        setImageGenerated(true);
      } catch (error) {
        console.error('Error generating OG image:', error);
      }
    };

    generateImage();
  }, [refCode, searchParams, tokenSymbol]);

  // Set up meta tags for social sharing
  useEffect(() => {
    if (imageGenerated && canvasRef.current) {
      const canvas = canvasRef.current;
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Update meta tags
      let metaImage = document.querySelector('meta[property="og:image"]');
      if (!metaImage) {
        metaImage = document.createElement('meta');
        metaImage.setAttribute('property', 'og:image');
        document.head.appendChild(metaImage);
      }
      metaImage.setAttribute('content', imageDataUrl);

      let metaImageWidth = document.querySelector('meta[property="og:image:width"]');
      if (!metaImageWidth) {
        metaImageWidth = document.createElement('meta');
        metaImageWidth.setAttribute('property', 'og:image:width');
        document.head.appendChild(metaImageWidth);
      }
      metaImageWidth.setAttribute('content', '1200');

      let metaImageHeight = document.querySelector('meta[property="og:image:height"]');
      if (!metaImageHeight) {
        metaImageHeight = document.createElement('meta');
        metaImageHeight.setAttribute('property', 'og:image:height');
        document.head.appendChild(metaImageHeight);
      }
      metaImageHeight.setAttribute('content', '628');

      let metaTitle = document.querySelector('meta[property="og:title"]');
      if (!metaTitle) {
        metaTitle = document.createElement('meta');
        metaTitle.setAttribute('property', 'og:title');
        document.head.appendChild(metaTitle);
      }
      metaTitle.setAttribute('content', `Buy $${tokenSymbol} - Referral Code: ${refCode}`);

      let metaDescription = document.querySelector('meta[property="og:description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('property', 'og:description');
        document.head.appendChild(metaDescription);
      }
      // Use the same benefit logic as the image generation
      const storedBenefit = localStorage.getItem(`og-benefit-${refCode}`);
      const currentBenefit = storedBenefit || 'Utility-rich token with real use cases. Early buyers benefit most.';
      metaDescription.setAttribute('content', currentBenefit);
    }
  }, [imageGenerated, refCode, tokenSymbol]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid #333',
            borderRadius: '8px'
          }}
        />
        {imageGenerated && (
          <div style={{ marginTop: '20px', color: '#ccc' }}>
            <p>OG Image for Referral Code: <strong>{refCode}</strong></p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              This image will be displayed when sharing links on social media platforms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OgImage;