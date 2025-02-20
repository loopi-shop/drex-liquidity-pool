import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("SimplePool", function () {
  
  async function deploySimplePool() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const DREX = await hre.ethers.getContractFactory("Drex");
    const drex1 = await DREX.deploy(owner.address);
    // const drex2 = await DREX.deploy(owner.address);
    const TPFT = await hre.ethers.getContractFactory("TPFT");
    const tpft = await TPFT.deploy(owner.address);

    const WrappedTPFT = await hre.ethers.getContractFactory("ERC1155ToERC20Wrapper");
    const wTpft = await WrappedTPFT.deploy(owner.address, tpft.target, 1);
    // console.log(tpft.target);
    
    const SimplePool = await hre.ethers.getContractFactory("SimplePoolProductConstant");
    const simplePool = await SimplePool.deploy(drex1.target, wTpft.target);

    await drex1.approve(simplePool.target, ethers.MaxUint256);
    // await drex2.approve(simplePool.target, ethers.MaxUint256);
    await tpft.setApprovalForAll(wTpft.target, true);
    // await tpft.setApprovalForAll(simplePool.target, true);
    // await wTpft.approve(simplePool.target, ethers.MaxUint256);
    await simplePool.approveWrapper(tpft.target, wTpft.target);
    await simplePool.approveWrapper(tpft.target, owner.address);//burn

    console.log({
      owner: owner.address,
      simplePool: simplePool.target,
      drex1: drex1.target,
      // drex2: drex2.target,
      tpft: tpft.target,
      wTpft: wTpft.target,
    })

    return { simplePool, owner, otherAccount, drex1, tpft, wTpft };
  }
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  // async function deployOneYearLockFixture() {
  //   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  //   const ONE_GWEI = 1_000_000_000;

  //   const lockedAmount = ONE_GWEI;
  //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, otherAccount] = await hre.ethers.getSigners();

  //   const Lock = await hre.ethers.getContractFactory("Lock");
  //   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  //   return { lock, unlockTime, lockedAmount, owner, otherAccount };
  // }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { simplePool, drex1, tpft, wTpft, owner } = await loadFixture(deploySimplePool);

      await drex1.mint(owner.address, ethers.parseEther("1000"));

      // await drex2.mint(owner.address, ethers.parseEther("1000"));

      await tpft.mint(owner, 1, ethers.parseEther("1000"), "0x");

      await simplePool.addLiquidity(ethers.parseEther("500"), ethers.parseEther("500"));

      console.log("Shares", await simplePool.balanceOf(owner.address)); 

      console.log("Saldo drex1", await drex1.balanceOf(owner.address));
      // console.log("Saldo drex2", await drex2.balanceOf(owner.address));
      console.log("Saldo tpft", await tpft.balanceOf(owner.address, 1));
      console.log("Saldo wTpft", await wTpft.balanceOf(owner.address));
      console.log("APPROVE", await tpft.isApprovedForAll("0x0165878A594ca255338adfa4d48449f69242Eb8F", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"));

      await simplePool.swap(drex1.target, ethers.parseEther("10"));

      console.log("Saldo drex1", await drex1.balanceOf(owner.address));
      // console.log("Saldo drex2", await drex2.balanceOf(owner.address));
      console.log("Saldo tpft", await tpft.balanceOf(owner.address, 1));
      console.log("Saldo wTpft", await wTpft.balanceOf(owner.address));


      await simplePool.swap(wTpft.target, ethers.parseEther("10"));

      console.log("Saldo drex1", await drex1.balanceOf(owner.address));
      // console.log("Saldo drex2", await drex2.balanceOf(owner.address));
      console.log("Saldo tpft", await tpft.balanceOf(owner.address, 1));
      console.log("Saldo wTpft", await wTpft.balanceOf(owner.address));

      // expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should liquidate TPFT", async function () {
      const { simplePool, drex1, tpft, wTpft, owner } = await loadFixture(deploySimplePool);

      await drex1.mint(owner.address, ethers.parseEther("1000"));

      // await drex2.mint(owner.address, ethers.parseEther("1000"));

      await tpft.mint(owner, 1, ethers.parseEther("1000"), "0x");

      await simplePool.addLiquidity(ethers.parseEther("1000"), ethers.parseEther("1000"));

      const tpftTotalSupply = await tpft["totalSupply()"]();
      
      console.log("Shares", await simplePool.balanceOf(owner.address));  
      await tpft.burn(simplePool.target, 1, tpftTotalSupply);
      await drex1.mint(owner.address, ethers.parseEther("10000"));
      console.log("Shares", await simplePool.balanceOf(owner.address)); 

      console.log("Saldo drex1", await drex1.balanceOf(owner.address));
      await simplePool.removeLiquidity(await simplePool.balanceOf(owner.address));
      console.log("Saldo drex1", await drex1.balanceOf(owner.address));

    });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await hre.ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
