import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';



async function main() {
  const [owner] = await ethers.getSigners();
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);

  await drex.transfer(user.address, 500);

  console.log("Transfer drex!");

  const wTpft = await ethers.getContractAt("ERC1155ToERC20Wrapper", config.WRAPPER_ADDRESS);

  await wTpft.transfer(user.address, 500);

  console.log("Transfer tpft!");

}

main();