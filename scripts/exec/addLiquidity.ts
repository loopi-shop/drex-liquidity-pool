import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import { sleep } from "../util/util";


async function main() {
  const [owner] = await ethers.getSigners();

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);

  let transaction = await simplePool.addLiquidity(500, 500);

  await sleep(10000);

  const shares = await simplePool.balanceOf(owner.address);

  console.log("Total shares:", shares);
}

main();
