// src/services/attestationService.js
// Service for interacting with the attestation API (simple CORS, no preflight)

const RAW_API_BASE_URL =
  (typeof window !== 'undefined' && window.__BNBMAGA_API__) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'https://api.bnbmaga.xyz';

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');
const API_KEY = '771644fbcdbddb5c68083e07f82b09057df6bf99905dbb13be4dc02ab7808941';

const DEFAULT_TIMEOUT_MS = 25000;
const RETRY_TIMEOUT_MS   = 35000;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const fetchWithTimeout = (url, options = {}, ms = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  const opts = { mode: 'cors', credentials: 'omit', ...options, signal: controller.signal };
  return fetch(url, opts).finally(() => clearTimeout(id));
};

const isAbortOrNetworkError = (err) =>
  err?.name === 'AbortError' ||
  err?.message?.includes('The operation was aborted') ||
  err instanceof TypeError;

export const getAttestation = async (referrer, buyerPlannedValueWei, chainId) => {
  const url = new URL('/attest.php', API_BASE_URL);
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('_', Date.now().toString());

  const body = new URLSearchParams({
    referrer,
    buyerPlannedValueWei: String(buyerPlannedValueWei),
    chainId: String(chainId),
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await fetchWithTimeout(
        url.toString(),
        {
          method: 'POST',
          headers: {
            // keep it SIMPLE => no preflight:
            // only safelisted Content-Type with form-urlencoded
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        },
        attempt === 1 ? DEFAULT_TIMEOUT_MS : RETRY_TIMEOUT_MS
      );

      let data;
      try {
        data = await resp.json();
      } catch {
        const txt = await resp.text().catch(() => '');
        throw new Error(`Attestation request failed (${resp.status || 'network'}). ${txt?.slice(0, 200) || ''}`);
      }

      if (!resp.ok || !data?.success) {
        throw new Error(data?.error || data?.message || 'Failed to get attestation');
      }

      return {
        referrer: data.referrer,
        attestedGlobalCount: data.attestedGlobalCount,
        deadline: data.deadline,
        syncFee: String(data.syncFee ?? '0'),
        sig: data.sig,
      };
    } catch (err) {
      if (attempt === 1 && isAbortOrNetworkError(err)) {
        console.warn('[attestation] first attempt aborted/failed, retrying…', err?.message || err);
        await sleep(200);
        continue;
      }
      console.error('[attestation] final failure:', err);
      throw err;
    }
  }

  throw new Error('Unexpected attestation failure');
};

export const hasHigherGlobalTier = async (contract, referrer) => {
  try {
    const localInfo = await contract.getReferrerInfo(referrer);
    const localCount = localInfo[0];
    const globalInfo = await contract.getGlobalReferralInfo(referrer);
    const globalCount = globalInfo[0];
    return globalCount > localCount;
  } catch (error) {
    console.error('Error checking global tier:', error);
    return false;
  }
};

export const formatAttestationForContract = (attestation) => ([
  attestation.referrer,
  attestation.attestedGlobalCount,
  attestation.deadline,
  attestation.syncFee,
  attestation.sig,
]);
