  import hre, { ethers } from "hardhat";
  import * as config from "../config/config";
  
  async function main() {
    const [owner] = await ethers.getSigners();
   
    const contractFactroy = await ethers.getContractFactory("SimplePoolProductConstant");
    const contract = await contractFactroy.deploy(config.DREX_ADDRESS, config.WRAPPER_ADDRESS);

    console.log("Deployed! Address:", contract.target);
  }

  main();
  