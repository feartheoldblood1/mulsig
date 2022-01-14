const { expect } = require("chai");
const { waffle } = require("hardhat");
const truffleAssert = require("truffle-assertions");
//const { ethers } = require("ethers");
const MultiSig = hre.artifacts.readArtifact("contracts/MultiSig.sol:MultiSig");


describe("MultiSig contract", () => {

    let MultiSig;
    let hardhatMultiSig;
    let owner;
    let addr1;
    let externalAddr;
    let zeroAddr = '0x0000000000000000000000000000000000000000';
    let amountWei = 1000;

    beforeEach(async () => {
        MultiSig = await ethers.getContractFactory("MultiSig");
        [owner, addr1, externalAddr] = await ethers.getSigners();
        hardhatMultiSig = await MultiSig.deploy();
    
    describe("Testing MultiSig", () => {

        it("Should not be able add new owner when address that calls function is the owner of contract",
         async () => {
            await expect(hardhatMultiSig.connect(owner).addOwner(owner.address),  
            "'newOwner' can't be msg.sender");
        });

        it("Should not be able transfer money to zero address ",
         async () => {
            await expect(hardhatMultiSig.connect(owner).createTransaction(zeroAddr.address, amountWei),
            "zero address");  
        });

        it("Should not be able sign by zero address",
         async () => {
            await expect(hardhatMultiSig.connect(owner).signTransaction(zeroAddr.address, 1),
            "zero address");
        });

        it("Should not be able sign not created transaction",
         async () => {
            await hardhatMultiSig.connect(owner).addOwner(addr1.address);
            await expect(hardhatMultiSig.connect(addr1).signTransaction(addr1.address, 0),
            "cannot sign transaction with transation's id equals zero");
        });

    });

});
    
});