import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiTpft from "../../abis/ITPFt.json";
import abiRealDigital from '../../abis/RealDigital.json';

async function main() {

  const [owner] = await ethers.getSigners();
  
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);
  const tpft = await ethers.getContractAt(abiTpft, config.TPFT_ADDRESS);
  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  const wTpft = await ethers.getContractAt("ERC1155ToERC20Wrapper", config.WRAPPER_ADDRESS);


  await drex.approve(simplePool.target, ethers.MaxUint256);
  await tpft.setApprovalForAll(wTpft.target, true);
  await simplePool.approveWrapper(tpft.target, wTpft.target);
  await simplePool.approveWrapper(tpft.target, owner.address);//burn
}


main();
