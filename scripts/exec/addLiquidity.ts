import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import { sleep } from "../util/util";
import { printBalances } from "./utils";


async function main() {
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  
  await printBalances(user.address);

  let transaction = await simplePool.connect(user).addLiquidity(ethers.parseUnits("816274000", 2), ethers.parseUnits("50000", 2));
  console.log("Liquidez adicionada! Transação", transaction.hash);

  await sleep(10000);

  await printBalances(user.address);
}

main();
