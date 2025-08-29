// src/utils/attestedReferralBuy.js
// Enhanced referral purchase with attestation support

import { getAttestation } from '../services/attestationService';

// Flag to use mock service for testing - set to false since mock service is removed
const USE_MOCK_SERVICE = false;

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

/**
 * Prepare the contract call for buying tokens with attestation
 *
 * @param {Object} configModule The chain configuration module
 *   Expected fields already in your app:
 *     - buyTokenCall
 *     - buyTokenWithReferrerCall
 *     - buyTokenWithAttestationCall
 *   Optional helpers this version can use if you provide them:
 *     - async readLastGlobalCount(address) -> number|string|bigint
 *     - tierFromCount(count:number) -> number  // returns tier level 1..8
 *
 * @param {string} referrerAddress The referrer address
 * @param {string|bigint|number} paymentAmount The payment amount in wei
 * @param {number} chainId The current chain ID
 * @returns {Promise<Object>} The contract call configuration
 */
export const prepareAttestedBuyTokenCall = async (
  configModule,
  referrerAddress,
  paymentAmount,
  chainId
) => {
  try {
    // Normalize inputs
    const valueBI = BigInt(paymentAmount);
    const refLower = (referrerAddress || '').toLowerCase();

    // Skip attestation entirely when there is no referrer
    if (!refLower || refLower === ZERO_ADDR) {
      return {
        ...configModule.buyTokenCall,
        args: [],
        value: valueBI,
      };
    }

    // 1) Ask backend for the attestation (includes syncFee if tier-up is expected)
    const attestation = await getAttestation(refLower, String(valueBI), chainId);
    console.log('Attestation received:', attestation);

    // 2) Normalize / coerce types so downstream encoders are happy
    const attReferrer = (attestation.referrer || refLower).toLowerCase();
    const attestedGlobalCountBI = BigInt(attestation.attestedGlobalCount ?? 0);
    const deadlineBI = BigInt(attestation.deadline ?? 0);
    const backendSyncFeeBI = BigInt(attestation.syncFee ?? '0');
    const sig = attestation.sig;

    // 3) Optional “belt & suspenders”: if the app exposes helpers to read the chain’s
    //    current lastGlobalCount and compute tier levels, zero the syncFee unless the
    //    attested count would actually raise the tier on THIS chain.
    let effectiveSyncFeeBI = backendSyncFeeBI;
    if (typeof configModule?.readLastGlobalCount === 'function' &&
        typeof configModule?.tierFromCount === 'function') {
      try {
        const prevGlobalRaw = await configModule.readLastGlobalCount(attReferrer);
        const prevGlobal = Number(prevGlobalRaw);
        const fromTier = configModule.tierFromCount(prevGlobal);
        const toTier   = configModule.tierFromCount(Number(attestedGlobalCountBI));
        if (!(toTier > fromTier)) {
          // No tier-up expected → force syncFee to 0 to avoid contract revert
          effectiveSyncFeeBI = 0n;
        }
      } catch (e) {
        // If local read fails, just trust the backend result
        console.warn('tier guard skipped (read/tier calc failed):', e);
      }
    }

    // 4) Total value = purchase + (maybe) sync fee
    const totalValue = valueBI + effectiveSyncFeeBI;

    // 5) Build the call to the attested entrypoint
    return {
      ...configModule.buyTokenWithAttestationCall,
      args: [
        attReferrer,
        attestedGlobalCountBI,
        deadlineBI,
        effectiveSyncFeeBI,
        sig,
      ],
      value: totalValue,
    };
  } catch (error) {
    console.error('Error preparing attested buy call:', error);

    // Fallback to regular referral purchase without attestation
    console.log('Falling back to regular referral purchase without attestation');
    return {
      ...configModule.buyTokenWithReferrerCall,
      args: [referrerAddress],
      value: BigInt(paymentAmount),
    };
  }
};
