import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigital from '../../abis/RealDigital.json';
import abiTpft from "../../abis/ITPFt.json";
import { printBalances } from "../exec/utils";
// import abiRealDigitalDefaultAccount from '../abi/RealDigitalDefaultAccount.json';



async function main() {
  const [owner] = await ethers.getSigners();
  const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);
  const drex = await ethers.getContractAt(abiRealDigital, config.DREX_ADDRESS);

  console.log("Saldo Drex", (await drex.balanceOf(user.address)).toString());
  // console.log("Decimals Drex", await drex.decimals());



  /**
 * Obtém contrato TPFt
 */
  const TPFt = await ethers.getContractAt(
    abiTpft,
    config.TPFT_ADDRESS
  );

  // for (let index = 0; index < 5; index++) {
    const balanceOfTPFt = await TPFt.balanceOf(
      user.address,
      config.TPFT_ID
    )
  
    //Saldo do TPFt.
    console.log(`Saldo TPFt id ${config.TPFT_ID}`, balanceOfTPFt.toString());


    await printBalances(config.POOL_ADDRESS);
    
    
  // }

  // console.log("Decimals Tpft", await TPFt.decimals());

  // console.log("TpftId", await TPFt.getTPFtId(
  //   {
  //     acronym: 'LTN',
  //     code: '100000',
  //     // A função Math.floor(date.getTime() / 1000) transformar data milissegundos em segundos(timestamp Unix)
  //     maturityDate: 1733011200,
  //   }
  // ));
  
  // console.log("TpftId", await TPFt.getTPFtId(
  //   {
  //     acronym: 'LTN',
  //     code: '100000',
  //     // A função Math.floor(date.getTime() / 1000) transformar data milissegundos em segundos(timestamp Unix)
  //     maturityDate: 1731628800,
  //   }
  // ));

  // console.log("TpftId", await TPFt.getTPFtId(
  //   {
  //     acronym: 'LTN',
  //     code: '100000',
  //     // A função Math.floor(date.getTime() / 1000) transformar data milissegundos em segundos(timestamp Unix)
  //     maturityDate: 1703203200,
  //   }
  // ));

}

main();
