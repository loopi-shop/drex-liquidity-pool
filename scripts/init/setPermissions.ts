import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiTpftIERC1155 from "../../abis/IERC1155.json";
import abiRealDigital from '../../abis/RealDigital.json';

async function main() {

  const [owner] = await ethers.getSigners();
  
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);
  const tpft = await ethers.getContractAt(abiTpftIERC1155, config.TPFT_ADDRESS);
  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  const wTpft = await ethers.getContractAt("ERC1155ToERC20Wrapper", config.WRAPPER_ADDRESS);


  
  await drex.approve(simplePool.target, ethers.MaxUint256);
  console.log("Drex approved!");
  await tpft.setApprovalForAll(wTpft.target, true);
  console.log("Tpft approved!");
  await simplePool.approveWrapper(tpft.target, wTpft.target);
  console.log("Pool approved 1!");
  await simplePool.approveWrapper(tpft.target, owner.address);//burn
  console.log("Pool approved 2!");
  
}


main();
