import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';



async function main() {
  const [owner] = await ethers.getSigners();

  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);

  await drex.transfer("0x7E4bd9599324EdE4d15454C3fAC2c4a07A59781B", 1);

  console.log("Transfer drex!");

  const wTpft = await ethers.getContractAt("ERC1155ToERC20Wrapper", config.WRAPPER_ADDRESS);

  await wTpft.transfer("0x7E4bd9599324EdE4d15454C3fAC2c4a07A59781B", 1);

  console.log("Transfer tpft!");

}

main();
