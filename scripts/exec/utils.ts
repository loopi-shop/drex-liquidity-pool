import hre, { ethers } from "hardhat";
import { Wallet} from "ethers";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";

export async function printBalances(address: string) {
  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);
  const TPFt = await ethers.getContractAt(abiTpft, config.TPFT_ADDRESS);

  let balanceDrex = await drex.balanceOf(address);
  let balanceOfTPFt = await TPFt.balanceOf(address, config.TPFT_ID);
  let shares = await simplePool.balanceOf(address);
  
  console.log("Saldo pool tokens:", shares.toString());
  console.log("Saldo Drex:", ethers.formatUnits(balanceDrex, 2));
  console.log("Saldo TPFt:", ethers.formatUnits(balanceOfTPFt, 2));
}