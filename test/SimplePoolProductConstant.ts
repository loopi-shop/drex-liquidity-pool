import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("SimplePoolProductConstant", function () {
  
  async function deploySimplePool() {
    const [owner, investor, swapUser] = await hre.ethers.getSigners();

    const DREX = await hre.ethers.getContractFactory("Drex");
    const drex = await DREX.deploy(owner.address);
    const TPFT = await hre.ethers.getContractFactory("TPFT");
    const tpft = await TPFT.deploy(owner.address);

    const WrappedTPFT = await hre.ethers.getContractFactory("ERC1155ToERC20Wrapper");
    const wTpft = await WrappedTPFT.deploy(owner.address, tpft.target, 1);
    // console.log(tpft.target);
    
    const SimplePool = await hre.ethers.getContractFactory("SimplePoolProductConstant");
    const simplePool = await SimplePool.deploy(drex.target, wTpft.target);

    await drex.approve(simplePool.target, ethers.MaxUint256);
    await tpft.setApprovalForAll(wTpft.target, true);
    await simplePool.approveWrapper(tpft.target, wTpft.target);
    await simplePool.approveWrapper(tpft.target, owner.address);//burn

    console.log({
      owner: owner.address,
      investor: investor.address,
      swapUser: swapUser.address,
      simplePool: simplePool.target,
      drex: drex.target,
      // drex2: drex2.target,
      tpft: tpft.target,
      wTpft: wTpft.target,
    })

    return { simplePool, owner, investor, swapUser, drex, tpft, wTpft };
  }

  describe("Functional Tests", function () {
    it("Should add liquidity", async function () {
      const { simplePool, drex, tpft, wTpft, investor } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseEther("1000"));
      await tpft.mint(investor, 1, ethers.parseEther("1000"), "0x");

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseEther("500"), ethers.parseEther("500"));

      const shares = await simplePool.balanceOf(investor.address);
      // console.log("Shares", shares); 

      expect(shares).to.equal(ethers.parseEther("500"));
    });

    it("Should remove liquidity", async function () {
      const { simplePool, drex, tpft, wTpft, investor } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseEther("1000"));
      await tpft.mint(investor, 1, ethers.parseEther("1000"), "0x");

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseEther("500"), ethers.parseEther("500"));

      const shares = await simplePool.balanceOf(investor.address);
      await simplePool.connect(investor).removeLiquidity(shares);

      expect(await drex.balanceOf(investor)).to.equal(ethers.parseEther("1000"));
      expect(await tpft.balanceOf(investor, 1)).to.equal(ethers.parseEther("1000"));
    });

    it("Should swap drex to tpft", async function () {
      const { simplePool, drex, tpft, wTpft, investor, swapUser } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseEther("100000000"));
      await tpft.mint(investor, 1, ethers.parseEther("100000000"), "0x");

      await drex.mint(swapUser.address, ethers.parseEther("1000"));

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseEther("100000000"), ethers.parseEther("100000000"));

      await drex.connect(swapUser).approve(simplePool.target, ethers.MaxUint256);
      
      const amountOut = await simplePool.getAmountOut(drex.target, ethers.parseEther("100"));

      await simplePool.connect(swapUser).swap(drex.target, ethers.parseEther("100"));

      expect(await drex.balanceOf(swapUser.address)).to.equal(ethers.parseEther("900"));
      expect(await tpft.balanceOf(swapUser.address, 1)).to.equal(amountOut);
    });

    it("Should add liquidity after swap", async function () {
      const { simplePool, drex, tpft, wTpft, investor, swapUser } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseUnits("8162740000", 2));
      await tpft.mint(investor, 1, ethers.parseUnits("500000", 2), "0x");

      await drex.mint(swapUser.address, ethers.parseUnits("16325.48", 2));

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseUnits("816274000", 2), ethers.parseUnits("50000", 2));

      await drex.connect(swapUser).approve(simplePool.target, ethers.MaxUint256);
      
      const amountOut = await simplePool.getAmountOut(drex.target, ethers.parseUnits("16325.48", 2));

      await simplePool.connect(swapUser).swap(drex.target, ethers.parseUnits("16325.48", 2));

      await simplePool.connect(investor).addLiquidity(ethers.parseUnits("816274000", 2), ethers.parseUnits("50000", 2));

      // expect(await drex.balanceOf(swapUser.address)).to.equal(ethers.parseUnits("900", 2));
      expect(await tpft.balanceOf(swapUser.address, 1)).to.equal(amountOut);
    });

    it("Should swap tpft to drex", async function () {
      const { simplePool, drex, tpft, wTpft, investor, swapUser } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseEther("100000000"));
      await tpft.mint(investor, 1, ethers.parseEther("100000000"), "0x");

      await tpft.mint(swapUser.address, 1, ethers.parseEther("1000"), "0x");

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseEther("100000000"), ethers.parseEther("100000000"));

      await tpft.connect(swapUser).setApprovalForAll(wTpft.target, true);
      
      const amountOut = await simplePool.getAmountOut(wTpft.target, ethers.parseEther("100"));

      await simplePool.connect(swapUser).swap(wTpft.target, ethers.parseEther("100"));

      expect(await tpft.balanceOf(swapUser.address, 1)).to.equal(ethers.parseEther("900"));
      expect(await drex.balanceOf(swapUser.address)).to.equal(amountOut);
    });

    it("Should liquidate tpft", async function () {
      const { simplePool, drex, tpft, wTpft, investor } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseEther("1000"));
      await tpft.mint(investor, 1, ethers.parseEther("1000"), "0x");

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseEther("1000"), ethers.parseEther("1000"));

      //Liquidate
      const tpftTotalSupply = await tpft["totalSupply()"]();
      await tpft.burn(simplePool.target, 1, tpftTotalSupply);
      await drex.mint(simplePool.target, tpftTotalSupply * ethers.parseEther("10000"));

      const drexAvailableInPool = await drex.balanceOf(simplePool.target);

      const shares = await simplePool.balanceOf(investor.address);
      await simplePool.connect(investor).removeLiquidity(shares);

      expect(await drex.balanceOf(investor)).to.equal(drexAvailableInPool);
      expect(await tpft.balanceOf(investor, 1)).to.equal(ethers.parseEther("0"));
    });


    it("Should get price from tpft to drex", async function () {
      const { simplePool, drex, tpft, wTpft, investor, swapUser } = await loadFixture(deploySimplePool);

      await drex.mint(investor.address, ethers.parseEther("10000000000000"));
      await tpft.mint(investor, 1, ethers.parseEther("1000000000"), "0x");

      await tpft.mint(swapUser.address, 1, ethers.parseEther("1000"), "0x");

      await drex.connect(investor).approve(simplePool.target, ethers.MaxUint256);
      await tpft.connect(investor).setApprovalForAll(wTpft.target, true);
      await simplePool.connect(investor).addLiquidity(ethers.parseEther("10000000000000"), ethers.parseEther("1000000000"));

      await tpft.connect(swapUser).setApprovalForAll(wTpft.target, true);
      
      const amountOutDrexTpft = await simplePool.getAmountOut.staticCall(drex.target, ethers.parseEther("1"));
      const amountOutTpftDrex = await simplePool.getAmountOut.staticCall(wTpft.target, ethers.parseEther("1"));

      console.log("price", ethers.formatEther(await simplePool.price(drex.target, ethers.parseEther("1"))));
      console.log("price", ethers.formatEther(await simplePool.price(wTpft.target, ethers.parseEther("1"))));
    });


    // it("Should liquidate TPFT", async function () {
    //   const { simplePool, drex, tpft, wTpft, owner } = await loadFixture(deploySimplePool);

    //   await drex.mint(owner.address, ethers.parseEther("1000"));

    //   // await drex2.mint(owner.address, ethers.parseEther("1000"));

    //   await tpft.mint(owner, 1, ethers.parseEther("1000"), "0x");

    //   await simplePool.addLiquidity(ethers.parseEther("1000"), ethers.parseEther("1000"));

    //   const tpftTotalSupply = await tpft["totalSupply()"]();
      
    //   console.log("Shares", await simplePool.balanceOf(owner.address));  
    //   await tpft.burn(simplePool.target, 1, tpftTotalSupply);
    //   await drex.mint(simplePool.target, ethers.parseEther("10000"));
    //   console.log("Shares", await simplePool.balanceOf(owner.address)); 

    //   console.log("Saldo drex", await drex.balanceOf(owner.address));
    //   await simplePool.removeLiquidity(await simplePool.balanceOf(owner.address));
    //   console.log("Saldo drex", await drex.balanceOf(owner.address));

    // });

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
