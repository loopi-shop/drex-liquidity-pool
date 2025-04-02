import hre, { ethers } from "hardhat";
import abiAddressDiscovery from "../../abis/AddressDiscovery.json";



async function main() {
  /**
   * Obtém contrato Address Discovery
   */
  const addressDiscrovery = await ethers.getContractAt(
    abiAddressDiscovery,
    '<Endereço do Contrato Address Discovery>'
  );

  /**
   * Endereço do TPFt
   */
  const tpftAddress = await addressDiscrovery.addressDiscovery(ethers.id('TPFt'));

  console.log("tpftAddress", tpftAddress);




}
  
main();
