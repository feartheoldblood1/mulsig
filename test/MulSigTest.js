const { expect } = require("chai");
const { waffle } = require("hardhat");
const { inputToConfig } = require("@ethereum-waffle/compiler");
//const MultiSig = hre.artifacts.readArtifact("contracts/MultiSig.sol:MultiSig");
const truffleAssert = require("truffle-assertions");



describe("MultiSig contract", () => {

    let MultiSig;
    let hardhatMultiSig;
    let owner;
    let addr1;
    let externalAddr;
    let zeroAddr = '0x0000000000000000000000000000000000000000';
    let amount = 1000;
    let createdTransactionId = 1;
    let notCreatedTransactionId = 2;
    let transactionString = "ID";

    before(async () => {
        [owner, addr1, externalAddr] = await ethers.getSigners();  
     });
    
    describe("Testing MultiSig", () => {
        
        it("Should not be able add new owner when his address is the owner of contract",
         async () => {
            MultiSig1 = await ethers.getContractFactory("MultiSig");
            hardhatMultiSig1 = await MultiSig1.deploy();
            await truffleAssert.reverts(hardhatMultiSig1.connect(owner).addOwner(owner.address), "'newOwner' can't be msg.sender");
        });

        it("Should not be able transfer tokens to zero address ",
         async () => {
            MultiSig = await ethers.getContractFactory("MultiSig");
            hardhatMultiSig = await MultiSig.deploy();
            await hardhatMultiSig.connect(owner).addOwner(addr1.address);
            await hardhatMultiSig.connect(owner).transfer(addr1.address, amount);
            await expect(hardhatMultiSig.connect(addr1).createTransaction(zeroAddr, amount)).to.be.revertedWith("'_to' is zero address'");
        });

        it("Should not be able sign by zero address",
         async () => {
            MultiSig = await ethers.getContractFactory("MultiSig");
            hardhatMultiSig = await MultiSig.deploy();
            await expect(hardhatMultiSig.connect(owner).signTransaction(zeroAddr, createdTransactionId)
            ).to.be.revertedWith("'_signer' is zero address");
        });

        it("Should not be able sign not created transaction",
         async () => {
            MultiSig = await ethers.getContractFactory("MultiSig");
            hardhatMultiSig = await MultiSig.deploy();
            await hardhatMultiSig.connect(owner).addOwner(addr1.address);
            await expect(hardhatMultiSig.connect(owner).signTransaction(externalAddr.address, createdTransactionId)
            ).to.be.revertedWith("''owners' that cant sign a transaction'");
        });

        it("Should be able to revert transaction by negative number of transaction's id",
         async () => {
            MultiSig = await ethers.getContractFactory("MultiSig");
            hardhatMultiSig = await MultiSig.deploy();
            await hardhatMultiSig.connect(owner).addOwner(addr1.address);
            await expect(hardhatMultiSig.connect(owner).signTransaction(addr1.address, transactionString)
            ).to.be.reverted;
        });
    });
    
});