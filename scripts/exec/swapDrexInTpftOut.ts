import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";
import { sleep } from "../util/util";
import { printBalances } from "./utils";
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';


async function main() {
  // const [owner] = await ethers.getSigners();
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
 
  await printBalances(user.address);

  const amountIn = 1;
  const amountOut = await simplePool.getAmountOut(config.DREX_ADDRESS, amountIn);

  console.log(`Estimativa de retorno para ${amountIn} drex: `, amountOut);

  let transaction = await simplePool.connect(user).swap(config.DREX_ADDRESS, amountIn);
  console.log("Swap realizado! Transação", transaction.hash);

  await printBalances(user.address);

  await sleep(10000);

  

}

main();
