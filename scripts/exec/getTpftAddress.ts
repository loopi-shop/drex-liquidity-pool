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
  const tpftAddress = await addressDiscrovery.addressDiscovery(ethers.id('TPFt'));

  console.log("tpftAddress", tpftAddress);




}
  
main();
