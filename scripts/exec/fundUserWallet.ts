import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpftIERC1155 from "../../abis/IERC1155.json";
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';



async function main() {
  const [owner] = await ethers.getSigners();
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);

  await drex.transfer(user.address, ethers.parseEther("500"));

  console.log("Transfer drex!");

  const wTpft = await ethers.getContractAt(abiTpftIERC1155, config.WRAPPER_ADDRESS);

  await wTpft.transfer(user.address, ethers.parseEther("500"));

  console.log("Transfer tpft!");

}

main();