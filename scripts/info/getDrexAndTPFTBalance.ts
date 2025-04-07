import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';



async function main() {
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);

  console.log("Saldo Drex", await drex.balanceOf(user.address));



  /**
 * Obtém contrato TPFt
 */
  const TPFt = await ethers.getContractAt(
    abiTpft,
    config.TPFT_ADDRESS
  );

  for (let index = 0; index < 5; index++) {
    const balanceOfTPFt = await TPFt.balanceOf(
      user.address,
      index
    )
  
    //Saldo do TPFt.
    console.log(`Saldo TPFt id ${index}`,balanceOfTPFt.toString());
    
    
  }
  

}

main();
