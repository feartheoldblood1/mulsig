const { expect } = require("chai");
const { waffle } = require("hardhat");
const MultiSig = hre.artifacts.readArtifact("contracts/MultiSig.sol:MultiSig");
const truffleAssert = require("truffle-assertions");

// await truffleAssert.reverts(
//       android.connect(signer1).claimPainting(1),
//       'Android: android not ready'
//     );

describe("MultiSig contract", () => {

    let MultiSig;
    let hardhatMultiSig;
    let owner;
    let addr1;
    let externalAddr;
    let zeroAddr = '0x0000000000000000000000000000000000000000';
    let amount = 1000;
    let createdTransactionId = 0;
    let notCreatedTransactionId = 1;

    beforeEach(async () => {
        MultiSig = await ethers.getContractFactory("MultiSig");
        [owner, addr1, externalAddr] = await ethers.getSigners();
        hardhatMultiSig = await MultiSig.deploy();
        await hardhatLBToken.deployed();
    });
    
    describe("Testing MultiSig", () => {

        it("Should not be able add new owner when his address is the owner of contract",
         async () => {
            await truffleAssert.reverts(hardhatMultiSig.connect(owner).addOwner(owner.address), "'newOwner' can't be msg.sender");
        });

        it("Should not be able transfer tokens to zero address ",
         async () => {
            await expect(hardhatMultiSig.connect(owner).createTransaction(zeroAddr, amount), "'_to' is zero address");
        });

        it("Should not be able sign by zero address",
         async () => {
            await expect(hardhatMultiSig.connect(owner).signTransaction(zeroAddr, createdTransactionId)
            ).to.be.revertedWith("'_signer' is zero address");
        });

        it("Should not be able sign not created transaction",
         async () => {
            await hardhatMultiSig.connect(owner).addOwner(addr1.address);
            await expect(hardhatMultiSig.connect(owner).signTransaction(addr1.address, notCreatedTransactionId)
            ).to.be.revertedWith("'_transactionId' is more than length of '_unsignedTransactions'");
        });

    });
    
});