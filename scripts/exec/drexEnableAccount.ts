import hre, { ethers } from "hardhat";
import * as config from "../config/config";
import abiRealDigitalEnableAccount from "../../abis/RealDigitalEnableAccount.json";

async function main() {
    const user = new ethers.Wallet(config.USER_WALLET_PK, ethers.provider);

    const enableAccount = await ethers.getContractAt(abiRealDigitalEnableAccount, config.REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS);
    
    console.log("Enabling wallet", user.address);
    await enableAccount.enableAccount(user.address);
    console.log("Enabled! Wallet", user.address);
}

main();
