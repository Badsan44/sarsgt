// src/contracts/chainConfig.js
import * as ConfigModuleEth from "./configEth";
import * as ConfigModuleBnb from "./configBnb";
import IconEth from "../assets/images/token/eth.png";
import IconBnb from "../assets/images/token/bnb.png";

const chains = {
  ETH: {
    icon: IconEth,
    name: "Sepolia Testnet",
    chainId: 11155111,
    configModule: ConfigModuleEth,
    payWith: "ETH",
    title: "BUY WITH ETH",
  },
  BNB: {
    icon: IconBnb,
    name: "BSC Testnet",
    chainId: 97,
    configModule: ConfigModuleBnb,
    payWith: "BNB",
    title: "BUY WITH BNB",
  },
};

export const chainInfo = [
  {
    ...chains.ETH,
    buyChainId: chains.BNB.chainId,
    buyTitle: chains.BNB.title,
    buyIcon: chains.BNB.icon,
    buyConfigModule: chains.BNB.configModule,
  },
  {
    ...chains.BNB,
    buyChainId: chains.ETH.chainId,
    buyTitle: chains.ETH.title,
    buyIcon: chains.ETH.icon,
    buyConfigModule: chains.ETH.configModule,
  },
];

export const chainConfig = (chainId) =>
  chainInfo.find((c) => c.chainId === chainId) || chainInfo[0];
