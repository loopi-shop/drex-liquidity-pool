  import hre, { ethers } from "hardhat";
  import * as config from "../config/config";
  
  async function main() {
    const [owner] = await ethers.getSigners();
   
    const contractFactroy = await ethers.getContractFactory("ERC1155ToERC20Wrapper");
    const contract = await contractFactroy.deploy(owner.address, config.TPFT_ADDRESS, config.TPFT_ID);

    console.log("Deployed! Address:", contract.target);
  }

  main();
  