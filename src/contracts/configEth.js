//token contract abi json
import TokenContractAbi from "./TokenContractAbi.json";

//token presale contract abi json
import PresaleContractAbi from "./PresaleContractAbi.json";

// viem public client for optional reads used by attestedReferralBuy
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

//network link
export const networkLink = "https://sepolia.etherscan.io/tx";

//token contract address
const tokenContractAddress = "0x7695d1d53273d9d8684cd9de0beb4998bf1d9727";

//token presale contract address
export const presaleContractAddress = "0xa35f69cd2f2e10a4801bd4b6c7a555f9b24de48a";

//contract chainid
const contractChainId = 11155111;

//token contract configuration
export const tokenContractConfig = {
  address: tokenContractAddress,
  abi: TokenContractAbi,
  chainId: contractChainId,
};

//token name read
export const tokenNameCall = {
  ...tokenContractConfig,
  functionName: "name",
  watch: true,
};

//token symbol read
export const tokenSymbolCall = {
  ...tokenContractConfig,
  functionName: "symbol",
  watch: true,
};

//token decimals read
export const tokenDecimalsCall = {
  ...tokenContractConfig,
  functionName: "decimals",
  watch: true,
};

//token balanceOf read
export const tokenBalanceOfCall = {
  ...tokenContractConfig,
  functionName: "balanceOf",
  watch: true,
};

//token Presale contract configuration
export const presaleContractConfig = {
  address: presaleContractAddress,
  abi: PresaleContractAbi,
  chainId: contractChainId,
};

// Optional helpers used by attestedReferralBuy.js
const sepoliaClient = createPublicClient({ chain: sepolia, transport: http() });
export async function readLastGlobalCount(address) {
  try {
    const res = await sepoliaClient.readContract({
      address: presaleContractAddress,
      abi: PresaleContractAbi,
      functionName: "lastGlobalCount",
      args: [address],
    });
    return Number(res);
  } catch (e) {
    console.warn("readLastGlobalCount(sepolia) failed:", e);
    return 0;
  }
}
export function tierFromCount(count) {
  const thresholds = [930, 430, 180, 80, 40, 15, 5, 0];
  for (let i = 0; i < thresholds.length; i++) {
    if (count >= thresholds[i]) return thresholds.length - i; // 8..1
  }
  return 1;
}

//presale token amount read
export const presaleTokenAmountCall = {
  ...presaleContractConfig,
  functionName: "presaleTokenAmount",
  watch: true,
};

//token total sold read
export const totalSoldCall = {
  ...presaleContractConfig,
  functionName: "totalSold",
  watch: true,
};

//maximum stage read
export const maxStageCall = {
  ...presaleContractConfig,
  functionName: "maxStage",
  watch: true,
};

//current stage id read
export const currentStageIdCall = {
  ...presaleContractConfig,
  functionName: "getCurrentStageIdActive",
  watch: true,
};

//stage info read
export const currentStageInfoCall = {
  ...presaleContractConfig,
  functionName: "stages",
  watch: true,
};

//buy token write (legacy - no referrer)
export const buyTokenCall = {
  ...presaleContractConfig,
  functionName: "buyToken",
  watch: true,
};

//buy token write with referrer
export const buyTokenWithReferrerCall = {
  ...presaleContractConfig,
  functionName: "buyToken",
  watch: true,
};

//buy token write with attestation
export const buyTokenWithAttestationCall = {
  ...presaleContractConfig,
  functionName: "buyToken",
  watch: true,
};

//ETH to USD exchange rate
export const GetUSDExchangeRate = async () => {
  var requestOptions = { method: "GET", redirect: "follow" };
  return fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result.data.rates.USD;
    })
    .catch((error) => {
      return "error", error;
    });
};
