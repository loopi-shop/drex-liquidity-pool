import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";



const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  networks: {
    besu: {
      url: process.env.RPC_URL,
      gasPrice: 0,
      accounts: [process.env.DEPLOYER_WALLET_PK!]
    }
  }
};

export default config;