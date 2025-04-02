  import hre, { ethers } from "hardhat";

  
  async function main() {
   
    const HelloWorld = await ethers.getContractFactory("TestContract");
    const helloWorld = await HelloWorld.deploy();

    console.log("Deployed! Address:", helloWorld.target);
  }

  main();
  