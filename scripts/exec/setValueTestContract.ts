  import hre, { ethers } from "hardhat";

  
  async function main() {
   
    const helloWorld = await ethers.getContractAt("TestContract", "0xFB756d997431460deE22D3B7A7D23dDC16E89B69");
    await helloWorld.setValue("99");    
    console.log("Value set!");

    console.log("Getting value");
    console.log(await helloWorld.value);
  }

  main();
  