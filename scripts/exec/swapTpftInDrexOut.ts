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

  const amountIn = ethers.parseUnits("8", 2);
  const amountOut = await simplePool.getAmountOut(config.WRAPPER_ADDRESS, amountIn);

  console.log(`Estimativa de retorno para compra de ${ethers.formatUnits(amountIn, 2)} tpft é de ${ethers.formatUnits(amountOut, 2)} drex`);

  let transaction = await simplePool.connect(user).swap(config.WRAPPER_ADDRESS, amountIn);
  console.log("Compra realizada! Transação", transaction.hash);

  await sleep(10000);

  await printBalances(user.address);

}

main();
