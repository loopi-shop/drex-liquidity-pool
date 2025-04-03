import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';



async function main() {
  const [owner] = await ethers.getSigners();

  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);

  const shares = await simplePool.balanceOf(owner.address);

  console.log("Total shares:", shares);
  

}

main();
