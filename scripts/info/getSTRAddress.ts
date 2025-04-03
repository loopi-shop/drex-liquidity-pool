import hre, { ethers } from "hardhat";
import abiAddressDiscovery from "../../abis/AddressDiscovery.json";
import * as config from "../config/config";



async function main() {
  /**
   * Obtém contrato Address Discovery
   */
  const addressDiscrovery = await ethers.getContractAt(
    abiAddressDiscovery,
    config.ADDRESS_DISCOVERY_ADDRESS
  );

  /**
   * Endereço do TPFt
   */
  const address = await addressDiscrovery.addressDiscovery(ethers.id('STR'));

  console.log("STR address", address);




}
  
main();
