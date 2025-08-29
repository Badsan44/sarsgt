-- Setup tables for the referral attestation system

-- Global referral counts table
CREATE TABLE IF NOT EXISTS global_referral_counts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_address VARCHAR(42) NOT NULL,
    referral_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (referrer_address)
);

-- Referral purchases table for tracking all purchases
CREATE TABLE IF NOT EXISTS referral_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_address VARCHAR(42) NOT NULL,
    buyer_address VARCHAR(42) NOT NULL,
    chain_id VARCHAR(20) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    usd_amount DECIMAL(18,6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (chain_id, tx_hash)
);

-- Attestation logs table for debugging and auditing
CREATE TABLE IF NOT EXISTS attestation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_address VARCHAR(42) NOT NULL,
    attested_count INT NOT NULL,
    deadline BIGINT NOT NULL,
    sync_fee VARCHAR(78) NOT NULL,
    signature TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster queries
CREATE INDEX idx_referrer_address ON global_referral_counts(referrer_address);
CREATE INDEX idx_referrer_address_purchases ON referral_purchases(referrer_address);
CREATE INDEX idx_buyer_address ON referral_purchases(buyer_address);
CREATE INDEX idx_chain_tx ON referral_purchases(chain_id, tx_hash);