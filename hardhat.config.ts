import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv'; 

dotenv.config();

let deployerPk = process.env.DEPLOYER_WALLET_PK;
if (deployerPk === undefined) {
  deployerPk = process.env.USER_WALLET_PK;
}

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
      accounts: [deployerPk!]
    }
  }
};

export default config;