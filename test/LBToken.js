const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect, assert } = require("chai");
const { waffle } = require("hardhat");

const LBToken = hre.artifacts.readArtifact("contracts/LBToken.sol:LBToken");

describe("LBToken contract", () => {
    let LBTokenContract;
    let hardhatLBToken;
    let owner;
    let externalAddr1;
    let externalAddr2;
    let zeroAddr = '0x0000000000000000000000000000000000000000';
    let amount = 1000;
    let negativeAmount = -10;

    beforeEach(async () =>  {
        LBTokenContract = await ethers.getContractFactory("LBToken");
        [owner, externalAddr1, externalAddr2] = await ethers.getSigners();
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
            await hardhatLBToken.transfer(externalAddr1.address, amount);
            addr1Balance = await hardhatLBToken.balanceOf(externalAddr1.address);
            expect(addr1Balance).to.equal(amount);

            await hardhatLBToken.connect(externalAddr1).transfer(externalAddr2.address, amount);
            addr2Balance = await hardhatLBToken.balanceOf(externalAddr2.address);
            expect(addr2Balance).to.equal(amount);
        });
        
        it("Should not be able to transfer to zero address",
         async () => {
            ownerBalance = await hardhatLBToken.balanceOf(owner.address);
            await expect(hardhatLBToken.connect(owner).transfer(zeroAddr, amount)
            ).to.be.revertedWith("receiver cannot be zero address");
            newOwnerBalance = await hardhatLBToken.balanceOf(owner.address);
            expect(newOwnerBalance).to.equal(ownerBalance);
        });

        it("Should not be able to transfer to the sender from the sender", async ()=> {
            await expect(hardhatLBToken.connect(owner).transfer(owner.address, amount)
            ).to.be.revertedWith("sender cannot send transfer tokens himself");
        });

        it("Should not be able send from an account that doesn't have enough money",
         async () => {
            await expect(hardhatLBToken.connect(externalAddr1).transferFrom(owner.address, externalAddr2.address, amount),
            "not enough money");
        });

       
    });
});
