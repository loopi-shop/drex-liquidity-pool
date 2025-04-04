import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpftIERC1155 from "../../abis/IERC1155.json";


async function main() {
  const user = new ethers.Wallet(config.USER_WALLET_PK);

  console.log("Approving ", user.address);

  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);
  const tpft = await ethers.getContractAt(abiTpftIERC1155, config.TPFT_ADDRESS);
  const simplePool = await ethers.getContractAt("SimplePoolProductConstant", config.POOL_ADDRESS);
  const wTpft = await ethers.getContractAt("ERC1155ToERC20Wrapper", config.WRAPPER_ADDRESS);

  await (drex.connect(user) as any).approve(simplePool.target, ethers.MaxUint256);
  await (tpft.connect(user) as any).setApprovalForAll(wTpft.target, true);

  console.log("Approved! Wallet ", user.address);  


}

main();
