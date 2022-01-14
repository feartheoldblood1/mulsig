const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect, assert } = require("chai");
const { waffle } = require("hardhat");

const LBToken = hre.artifacts.readArtifact("contracts/LBToken.sol:LBToken");

describe("LBToken contract", () => {
    let LBTokenContract;
    let hardhatLBToken;
    let owner;
    let ExternalAddr1;
    let ExternalAddr2;
    let zeroAddr = '0x0000000000000000000000000000000000000000';
    let amountWei = 1000;

    beforeEach(async () =>  {
        LBTokenContract = await ethers.getContractFactory("LBToken");
        [owner, ExternalAddr1, ExternalAddr2] = await ethers.getSigners();
        hardhatLBToken = await LBTokenContract.deploy();
        await hardhatLBToken.deployed();
    });

    describe("Testing LBToken", () => {
        
        it("Deployment should assign the total supply of tokens to the owner",
         async () => {
            ownerBalance = await hardhatLBToken.balanceOf(owner.address);
            expect(await hardhatLBToken.connect(owner).totalSupply()).to.equal(ownerBalance); 
        });
    
        it("Should transfer tokens between accounts",
         async () => {
            await hardhatLBToken.transfer(ExternalAddr1.address, amountWei);
            addr1Balance = await hardhatLBToken.balanceOf(ExternalAddr1.address);
            expect(addr1Balance).to.equal(amountWei);
    
            await hardhatLBToken.connect(ExternalAddr1).transfer(ExternalAddr2.address, amountWei);
            addr2Balance = await hardhatLBToken.balanceOf(ExternalAddr2.address);
            expect(addr2Balance).to.equal(amountWei);
        });
        
        it("Should not be able to transfer to zero address",
         async () => {
            ownerBalance = await hardhatLBToken.balanceOf(owner.address);
            await expect(hardhatLBToken.connect(owner).transfer(zeroAddr, amountWei)
            ).to.be.revertedWith("receiver cannot be zero address");
            newOwnerBalance = await hardhatLBToken.balanceOf(owner.address);
            expect(newOwnerBalance).to.equal(ownerBalance);
        });

        it("Should not be able to transfer to the sender from the sender", async ()=> {
            await expect(hardhatLBToken.connect(owner).transfer(owner.address, amountWei)
            ).to.be.revertedWith("sender cannot send transfer money himself");
        });

        it("Should not be able send from an account that doesn't have enough money",
         async () => {
            await expect(hardhatLBToken.connect(ExternalAddr1).transferFrom(owner.address, ExternalAddr2.address, amountWei),
            "not enough money")
        });

        it("Should not be able send to zero address from account",
         async () => {
            ownerBalance = await hardhatLBToken.balanceOf(owner.address);
            await expect(hardhatLBToken.connect(owner).transferFrom(owner.address, zeroAddr, amountWei),
            "'_buyer' cannot be zero address");
        });

    });
});