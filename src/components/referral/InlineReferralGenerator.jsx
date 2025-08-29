// src/components/referral/InlineReferralGenerator.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCopy, FiLink, FiCheck, FiBarChart2 } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { 
  generateReferralCode,
  addReferralCode,
  generateReferralLink,
  getReferralCodeForAddress
} from '../../utils/referralManager';
import { copyToClipboard } from '../../utils/referralUtils';

const InlineReferralWrapper = styled.div`
  margin-bottom: 20px;

  .referral-field {
    width: 100%;
    padding: 15px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #444;
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.9rem;
    font-family: monospace;
    margin-bottom: 25px;
    margin-top: 20px;
    
    &:focus {
      outline: none;
      border-color: #d22626;
    }
    
    &::placeholder {
      color: #888;
    }
  }

  .referral-buttons {
    display: flex;
    gap: 10px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .referral-btn {
    flex: 1;
    padding: 15px 25px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-height: 50px;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-generate {
    background: linear-gradient(135deg, #d22626, #b91c1c);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(210, 38, 38, 0.4);
    }
  }

  .btn-copy {
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

  .connect-prompt {
    text-align: center;
    color: #888;
    font-size: 0.85rem;
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
    border-radius: 8px;
    margin-top: 20px;
  }
`;

const InlineReferralGenerator = () => {
  const { address: walletAddress, isConnected } = useAccount();
  const navigate = useNavigate();
  const [referralLink, setReferralLink] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const checkExistingCode = async () => {
      if (walletAddress) {
        try {
          const existingCode = await getReferralCodeForAddress(walletAddress);
          if (existingCode) {
            const existingLink = generateReferralLink(existingCode);
            setReferralLink(existingLink);
            setHasGenerated(true);
          } else {
            // Reset state for new address with no existing code
            setReferralLink('');
            setHasGenerated(false);
            setCopied(false);
          }
        } catch (error) {
          console.error('Error checking existing referral code:', error);
          // Reset state on error
          setReferralLink('');
          setHasGenerated(false);
          setCopied(false);
        }
      } else {
        // Reset state when wallet disconnects
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
      
      // Add the mapping to the referral manager
      await addReferralCode(newCode, walletAddress);
      
      // Generate the referral link
      const newLink = generateReferralLink(newCode);
      
      if (newLink) {
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

  const handleNavigateToDashboard = () => {
    navigate('/referral-dashboard');
  };

  if (!isConnected) {
    return (
      <InlineReferralWrapper>
        <div className="connect-prompt">
          Connect your wallet to generate your referral link
        </div>
      </InlineReferralWrapper>
    );
  }

  return (
    <InlineReferralWrapper>
      <input
        type="text"
        className="referral-field"
        value={referralLink}
        placeholder={hasGenerated ? "Your referral link" : "Click 'Generate Link' to create your referral link"}
        readOnly
      />
      
      <div className="referral-buttons">
        <button
          className="referral-btn btn-generate"
          onClick={hasGenerated ? handleNavigateToDashboard : handleGenerateLink}
          disabled={isGenerating || !walletAddress}
        >
          {isGenerating ? (
            <>
              Generating...
            </>
          ) : hasGenerated ? (
            <>
              <FiBarChart2 />
              Referral Dashboard
            </>
          ) : (
            <>
              <FiLink />
              Generate Link
            </>
          )}
        </button>
        
        <button
          className={`referral-btn btn-copy ${copied ? 'copied' : ''}`}
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
    </InlineReferralWrapper>
  );
};

export default InlineReferralGenerator;