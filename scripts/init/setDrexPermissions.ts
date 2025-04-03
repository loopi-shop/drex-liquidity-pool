import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiSTR from "../../abis/STR.json";
import abiRealDigitalEnableAccount from "../../abis/RealDigitalEnableAccount.json";

async function main() {

    const STR = await ethers.getContractAt(abiSTR, config.STR_ADDRESS);
    const enableAccount = await ethers.getContractAt(abiRealDigitalEnableAccount, config.REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS);
    
    // Após ter um endereço habilitado pelo BACEN, a instituição pode habilitar novos endereços
    await enableAccount.enableAccount(config.WRAPPER_ADDRESS);
    console.log("Wrapper enabled");

    await enableAccount.enableAccount(config.POOL_ADDRESS);
    console.log("Pool enabled");
  
}

main();
