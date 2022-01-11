const { assert, expect } = require("chai");
const { waffle } = require("hardhat");
const truffleAssert = require("truffle-assertions");
const { accounts, contract } = require('@openzeppelin/test-environment');
//const { ethers } = require("ethers");
const { ethers } = require("hardhat");
const MultSig = hre.artifacts.readArtifact("contracts/MultiSig.sol:MultiSig");


describe("MultiSig contract", () => {

    let MultiSig;
    let hardhatMultiSig;
    let owner;
    let addr1;
    let externalAddr;
    let zero_addr = '0x0000000000000000000000000000000000000000';
    let amountWei = 1000;
    beforeEach(async () => {
        MultiSig = await ethers.getContractFactory("MultiSig");
        [owner, addr1, externalAddr] = await ethers.getSigners();
        hardhatMultiSig = await MultiSig.deploy();
    });
    
    describe("Deployment", () => {

        it("should not be able add new owner when address that calls function is the owner of contract",
         async () => {
            
            await truffleAssert.reverts(hardhatMultiSig.connect(owner).addOwner(owner.address),  
            "'newOwner' can't be msg.sender");
        });

        it("Should not be able transfer money to zero address ",
         async () => {

            await expect(
                hardhatMultiSig.connect(owner).createTransaction(zero_addr, amountWei
                    )).to.be.revertedWith("zero address");  

        });

        it("Zero address should not be able sign", async () => {
            
            await expect(hardhatMultiSig.signTransaction(zero_addr,1), "zero addr");
                
            
        })
        
    });
    
})