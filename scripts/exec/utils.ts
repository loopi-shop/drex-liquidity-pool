import hre, { ethers } from "hardhat";
import { Wallet} from "ethers";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";

export async function printBalances(user: Wallet) {
  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);
  const TPFt = await ethers.getContractAt(abiTpft, config.TPFT_ADDRESS);

  let balanceDrex = await drex.balanceOf(user.address);
  let balanceOfTPFt = await TPFt.balanceOf(user.address, config.TPFT_ID);
  let shares = await simplePool.balanceOf(user.address);
  
  console.log("Total pool tokens:", shares.toString());
  console.log("Saldo Drex:", balanceDrex);
  console.log("Saldo TPFt:", balanceOfTPFt);
}