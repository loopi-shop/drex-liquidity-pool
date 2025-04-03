import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiAccountRules from '../../abis/AccountRules.json';

async function main() {

      //0x51FD57d1f7c9539986333C50978D2E9926300e27 - prod nova versão 10/03/25
      const rulesInstance = await ethers.getContractAt(abiAccountRules, "0x51FD57d1f7c9539986333C50978D2E9926300e27");


      const listedContracts:Array<String> = [config.WRAPPER_ADDRESS, config.POOL_ADDRESS];
      
      for (let i = 0; i < listedContracts.length; i++) {
  
          //realiza a permissão de um contrato para ser executado na rede
          const contract = listedContracts[i];
          await (await rulesInstance.addTarget(contract.toString())).wait();
          
          //Caso queira remover o contrato para não ser mais executado, utilize o removeTarget
          //await (await rulesInstance.removeTarget(contract.toString())).wait();
          
  
          console.log("Contract added:", contract);
      }   
  
}


main();
