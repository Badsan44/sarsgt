import { useState } from "react";
import KolQuestFormWrapper from "./KolQuestForm.style";

const KolQuestForm = () => {
  const [formData, setFormData] = useState({
    twitterHandle: '',
    walletAddress: '',
    followerCount: '',
    mainNiche: '',
    whyJoin: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validation functions
  const validateTwitterHandle = (handle) => {
    if (!handle.trim()) return "Twitter handle is required";
    if (!handle.startsWith('@')) return "Twitter handle must start with @";
    if (handle.length < 2) return "Twitter handle must be at least 2 characters long";
    if (!/^@[a-zA-Z0-9_]+$/.test(handle)) return "Twitter handle can only contain letters, numbers, and underscores";
    return null;
  };

  const validateWalletAddress = (address) => {
    if (!address.trim()) return "Wallet address is required";
    if (!address.startsWith('0x')) return "BNB wallet address must start with 0x";
    if (address.length !== 42) return "BNB wallet address must be exactly 42 characters long";
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return "Invalid BNB wallet address format";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Auto-add @ for Twitter handle if not present
    if (name === 'twitterHandle' && value && !value.startsWith('@')) {
      processedValue = '@' + value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Real-time validation
    let error = null;
    if (name === 'twitterHandle') {
      error = validateTwitterHandle(processedValue);
    } else if (name === 'walletAddress') {
      error = validateWalletAddress(processedValue);
    }

    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate all fields before submission
    const errors = {};
    errors.twitterHandle = validateTwitterHandle(formData.twitterHandle);
    errors.walletAddress = validateWalletAddress(formData.walletAddress);

    // Check if other required fields are filled
    if (!formData.followerCount.trim()) errors.followerCount = "Follower count is required";
    if (!formData.mainNiche.trim()) errors.mainNiche = "Main niche is required";
    if (!formData.whyJoin.trim()) errors.whyJoin = "Please tell us why you want to join";

    // Filter out null errors
    const validErrors = Object.fromEntries(
      Object.entries(errors).filter(([key, value]) => value !== null)
    );

    if (Object.keys(validErrors).length > 0) {
      setValidationErrors(validErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit to Google Sheets
      await submitToGoogleSheets(formData);
      
      setSubmitStatus('success');
      setFormData({
        twitterHandle: '',
        walletAddress: '',
        followerCount: '',
        mainNiche: '',
        whyJoin: ''
      });
      setValidationErrors({});
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitToGoogleSheets = async (data) => {
    // Google Apps Script Web App URL (replace with your actual URL)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    
    const payload = {
      timestamp: new Date().toISOString(),
      twitterHandle: data.twitterHandle,
      walletAddress: data.walletAddress,
      followerCount: data.followerCount,
      mainNiche: data.mainNiche,
      whyJoin: data.whyJoin
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Note: no-cors mode means we can't read the response, but the data will still be sent
    return true;
  };

  const isFormValid = () => {
    const hasAllFields = Object.values(formData).every(value => value.trim() !== '');
    const hasNoErrors = Object.values(validationErrors).every(error => error === null || error === undefined);
    return hasAllFields && hasNoErrors;
  };

  return (
    <KolQuestFormWrapper id="kol-quest-form">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="form-section">
              <h2 className="form-title">Apply for the KOL Quest</h2>
              <p className="form-subtitle">
                Fill out the form below to join our exclusive influencer program.
              </p>

              <form onSubmit={handleSubmit} className="kol-quest-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="twitterHandle" className="form-label">
                      X (Twitter) Handle *
                    </label>
                    <input
                      type="text"
                      id="twitterHandle"
                      name="twitterHandle"
                      value={formData.twitterHandle}
                      onChange={handleInputChange}
                      placeholder="@yourusername"
                      className={`form-input ${validationErrors.twitterHandle ? 'error' : ''}`}
                      required
                    />
                    {validationErrors.twitterHandle && (
                      <div className="error-message">{validationErrors.twitterHandle}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="walletAddress" className="form-label">
                      Wallet Address (BNB Chain) *
                    </label>
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      className={`form-input ${validationErrors.walletAddress ? 'error' : ''}`}
                      required
                    />
                    {validationErrors.walletAddress && (
                      <div className="error-message">{validationErrors.walletAddress}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="followerCount" className="form-label">
                      Follower Count *
                    </label>
                    <select
                      id="followerCount"
                      name="followerCount"
                      value={formData.followerCount}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select follower range</option>
                      <option value="1k-5k">1,000 - 5,000</option>
                      <option value="5k-10k">5,000 - 10,000</option>
                      <option value="10k-50k">10,000 - 50,000</option>
                      <option value="50k-100k">50,000 - 100,000</option>
                      <option value="100k-500k">100,000 - 500,000</option>
                      <option value="500k+">500,000+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mainNiche" className="form-label">
                      Main Niche *
                    </label>
                    <select
                      id="mainNiche"
                      name="mainNiche"
                      value={formData.mainNiche}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select your main niche</option>
                      <option value="ai">AI</option>
                      <option value="defi">DeFi</option>
                      <option value="presale">Launchpads / Presale</option>
                      <option value="memes">Memecoins</option>
                      <option value="narrative">Narrative Coins</option>
                      <option value="nft">NFT/Gaming Tokens</option>
                      <option value="rwa">Real World Assets</option>
                      <option value="telegram">Telegram Tokens</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="whyJoin" className="form-label">
                    Why do you want to join the $BNBMAGA KOL Quest? *
                  </label>
                  <textarea
                    id="whyJoin"
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleInputChange}
                    placeholder="Tell us about your motivation, experience, and how you plan to promote $BNBMAGA..."
                    className="form-textarea"
                    rows="6"
                    required
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="status-message success">
                    🎉 Application submitted successfully! We'll review your application and get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="status-message error">
                    ❌ There was an error submitting your application. Please try again.
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className={`submit-btn ${!isFormValid() ? 'disabled' : ''}`}
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      'SUBMIT APPLICATION'
                    )}
                  </button>
                </div>

                <p className="form-note">
                  * All fields are required. By submitting this form, you agree to our terms and conditions 
                  and confirm that all information provided is accurate.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </KolQuestFormWrapper>
  );
};

export default KolQuestForm;