// src/components/referral/ReferralLinkGenerator.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCopy, FiLink, FiCheck } from 'react-icons/fi';
import { 
  generateReferralCode,
  addReferralCode,
  getReferralCodeForAddress,
  generateReferralLink,
  copyToClipboard 
} from '../../utils/referralManager';

const LinkGeneratorWrapper = styled.div`
  background: rgba(12, 12, 12, 0.8);
  border: 2px solid #d22626;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .icon {
      font-size: 1.5rem;
      color: #d22626;
      margin-right: 10px;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
    }
  }

  .description {
    color: #cccccc;
    margin-bottom: 25px;
    line-height: 1.6;
  }

  .link-section {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .link-input {
    flex: 1;
    padding: 15px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #444;
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.9rem;
    font-family: monospace;
    
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
    padding: 15px 25px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      flex: 1;
      justify-content: center;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, #d22626, #b91c1c);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(210, 38, 38, 0.4);
    }
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid #444;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      border-color: #d22626;
    }
    
    &.copied {
      background: rgba(34, 197, 94, 0.2);
      border-color: #22c55e;
      color: #22c55e;
    }
  }

  .warning {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 8px;
    padding: 15px;
    color: #f59e0b;
    font-size: 0.9rem;
    margin-top: 15px;
    
    .warning-title {
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
`;

const ReferralLinkGenerator = ({ walletAddress, isConnected }) => {
  const [referralLink, setReferralLink] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const checkExistingCode = async () => {
      if (walletAddress) {
        try {
          // Check if this address already has a referral code
          const existingCode = await getReferralCodeForAddress(walletAddress);
          if (existingCode) {
            setReferralCode(existingCode);
            const link = generateReferralLink(existingCode);
            setReferralLink(link);
            setHasGenerated(true);
          } else {
            // Reset state for new address with no existing code
            setReferralCode('');
            setReferralLink('');
            setHasGenerated(false);
            setCopied(false);
          }
        } catch (error) {
          console.error('Error checking existing referral code:', error);
          // Reset state on error
          setReferralCode('');
          setReferralLink('');
          setHasGenerated(false);
          setCopied(false);
        }
      } else {
        // Reset state when wallet disconnects
        setReferralCode('');
        setReferralLink('');
        setHasGenerated(false);
        setCopied(false);
      }
    };
    
    checkExistingCode();
  }, [walletAddress]);

  const handleGenerateLink = async () => {
    if (!walletAddress || hasGenerated) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a new referral code for this address
      const newCode = generateReferralCode(walletAddress);
      
      // Add the code-to-address mapping to the referral manager
      await addReferralCode(newCode, walletAddress);
      
      // Generate the referral link
      const newLink = generateReferralLink(newCode);
      
      if (newLink) {
        setReferralCode(newCode);
        setReferralLink(newLink);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error('Error generating referral link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!referralLink) return;
    
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <LinkGeneratorWrapper>
        <div className="header">
          <FiLink className="icon" />
          <h3 className="title">Referral Link Generator</h3>
        </div>
        <div className="description">
          Connect your wallet to generate your unique referral link and start earning ETH/BNB cashback bonuses!
        </div>
      </LinkGeneratorWrapper>
    );
  }

  return (
    <LinkGeneratorWrapper>
      <div className="header">
        <FiLink className="icon" />
        <h3 className="title">Your Referral Link</h3>
      </div>
      
      <div className="description">
        Generate your unique referral link to share with friends. You'll earn ETH/BNB cashback bonuses for every successful purchase made through your link!
      </div>

      <div className="link-section">
        <input
          type="text"
          className="link-input"
          value={referralLink}
          placeholder={hasGenerated ? "Your referral link will appear here" : "Click 'Generate Link' to create your referral link"}
          readOnly
        />
        
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={handleGenerateLink}
            disabled={hasGenerated || isGenerating || !walletAddress}
          >
            {isGenerating ? (
              <>
                <div className="spinner" />
                Generating...
              </>
            ) : hasGenerated ? (
              <>
                <FiCheck />
                Generated
              </>
            ) : (
              <>
                <FiLink />
                Generate Link
              </>
            )}
          </button>
          
          <button
            className={`btn btn-secondary ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
            disabled={!referralLink}
          >
            {copied ? (
              <>
                <FiCheck />
                Copied!
              </>
            ) : (
              <>
                <FiCopy />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {hasGenerated && (
        <div className="warning">
          <div className="warning-title">Important:</div>
          Your referral code is <strong>{referralCode}</strong>. Share your link with friends to earn cashback bonuses when they purchase tokens!
        </div>
      )}
    </LinkGeneratorWrapper>
  );
};

export default ReferralLinkGenerator;