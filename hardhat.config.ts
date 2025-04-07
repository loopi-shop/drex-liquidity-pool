import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv'; 

dotenv.config();

let deployerPk = process.env.DEPLOYER_WALLET_PK;
console.log("1", deployerPk);
if (deployerPk === undefined) {
  console.log("if");
  deployerPk = process.env.USER_WALLET_PK;
}
console.log("2", deployerPk);

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