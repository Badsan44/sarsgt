# Brand Logos Setup Guide

## Method 1: Local Images (Recommended)

### Step 1: Add Logo Files
1. Place your logo files in: `/public/assets/images/brands/`
2. Use these exact filenames:
   - `binance.png`
   - `coinbase.png`
   - `ethereum.png`
   - `bitcoin.png`
   - `polygon.png`
   - `chainlink.png`
   - `uniswap.png`
   - `pancakeswap.png`
   - `metamask.png`
   - `trustwallet.png`
   - `coinmarketcap.png`
   - `coingecko.png`
   - `avalanche.png`
   - `solana.png`
   - `cardano.png`

### Step 2: Logo Requirements
- **Format**: PNG, JPG, SVG, or WebP
- **Size**: Recommended 150x80px (or similar aspect ratio)
- **Background**: Transparent PNG works best
- **Quality**: High resolution for crisp display

## Method 2: External URLs

Update the `brandLogos` array in `/src/sections/kolQuest/BrandsCarousel.jsx`:

```javascript
const brandLogos = [
  { id: 1, name: "Binance", logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png" },
  { id: 2, name: "Coinbase", logo: "https://cryptologos.cc/logos/coinbase-coin-logo.png" },
  // ... add more
];
```

## Method 3: Import as Modules

1. Place logos in `/src/assets/images/brands/`
2. Import them in the component:

```javascript
import binanceLogo from '../../assets/images/brands/binance.png';
import coinbaseLogo from '../../assets/images/brands/coinbase.png';

const brandLogos = [
  { id: 1, name: "Binance", logo: binanceLogo },
  { id: 2, name: "Coinbase", logo: coinbaseLogo },
  // ...
];
```

## Quick Test

To test with placeholder images, you can temporarily use:
```javascript
{ id: 1, name: "Test Brand", logo: "https://via.placeholder.com/150x80/FF6B6B/FFFFFF?text=Test" }
```

## Adding More Brands

To add more than 15 brands:
1. Add new objects to the `brandLogos` array
2. Follow the same pattern: `{ id: 16, name: "Brand Name", logo: "path/to/logo" }`
3. The carousel will automatically include them in the rotation

## Customizing Brand Names

The `name` field is used for:
- Alt text for accessibility
- Potential tooltips (if added later)
- SEO benefits

Make sure to use the actual brand names for better SEO and accessibility.