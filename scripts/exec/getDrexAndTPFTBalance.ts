import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';
  
  
  
  async function main() {
    const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);

    console.log("Saldo Drex", drex.balanceOf(config.MAIN_WALLET_ADDRESS));
  
  }

  main();
  