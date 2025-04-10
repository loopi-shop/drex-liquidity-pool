import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import { sleep } from "../util/util";
import { printBalances } from "./utils";


async function main() {
  // const [owner] = await ethers.getSigners();
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);

  await printBalances(user.address);

  // let shares = await simplePool.balanceOf(user.address);
  let transaction = await simplePool.connect(user).removeLiquidity(10000);
  console.log("Liquidez removida! Transação", transaction.hash);

  await sleep(10000);

  await printBalances(user.address);
  
}

main();
