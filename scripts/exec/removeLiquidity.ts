import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import { sleep } from "../util/util";


async function main() {
  const [owner] = await ethers.getSigners();
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);

  let shares = await simplePool.balanceOf(user.address);
  console.log("Total shares antes:", shares);

  let transaction = await simplePool.connect(user).removeLiquidity(shares)
  console.log("RemoveLiquidity realizado! Transação", transaction.hash);

  await sleep(10000);

  shares = await simplePool.balanceOf(user.address);

  console.log("Total shares depois:", shares);
}

main();
