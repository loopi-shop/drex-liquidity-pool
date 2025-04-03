import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';


async function main() {
  const [owner] = await ethers.getSigners();

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);
  const TPFt = await ethers.getContractAt(abiTpft, config.TPFT_ADDRESS);

  let balanceDrex = await drex.balanceOf(config.MAIN_WALLET_ADDRESS);
  let balanceOfTPFt = await TPFt.balanceOf(config.MAIN_WALLET_ADDRESS, config.TPFT_ID);

  console.log("Saldo Drex antes:", balanceDrex);
  console.log("Saldo TPFt antes:", balanceOfTPFt);

  const amountIn = 10;
  const amountOut = await simplePool.getAmountOut(config.DREX_ADDRESS, amountIn);

  console.log(`Estimativa de retorno para ${amountIn} drex como input: `, amountOut);

  await simplePool.swap(drex.target, amountIn);
  console.log("Swap realizado!");

  balanceDrex = await drex.balanceOf(config.MAIN_WALLET_ADDRESS);
  balanceOfTPFt = await TPFt.balanceOf(config.MAIN_WALLET_ADDRESS, config.TPFT_ID);

  console.log("Saldo Drex depois:", balanceDrex);
  console.log("Saldo TPFt depois:", balanceOfTPFt);

}

main();
