import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiTpft from "../../abis/ITPFt.json";

async function main() {

  /**
 * Obtém contrato TPFt
 */
  const TPFt = await ethers.getContractAt(
    abiTpft,
    config.TPFT_ADDRESS
  );


  // const balanceOfTPFt = await TPFt.balanceOf(
  //   config.MAIN_WALLET_ADDRESS,
  //   1
  // );

  // console.log("TPFt balance", balanceOfTPFt);
  console.log("Test", await TPFt.isApprovedForAll(config.MAIN_WALLET_ADDRESS, config.ADDRESS_DISCOVERY_ADDRESS));

}


main();
