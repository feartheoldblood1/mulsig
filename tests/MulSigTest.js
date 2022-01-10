const { assert, expect } = require("chai");
const { waffle } = require("hardhat");
const { accounts, contract } = require('@openzeppelin/test-environment');
const MultSig = artifacts.require("/contracts/MultiSig.sol");

describe("MultiSig", function () {
    var [creatorAddress, secondOwner, thirdOwner, externalAddress] = accounts;

    it("should not be able add new owner when address that calls function is not the owner that can sign",
     async () => {
        const hardhatMulSig = await MultSig.deploy();
        const result = await hardhatMulSig.addOwner(thirdOwner, {from: externalAddress});
        expect(result).to.equal(true);
    });
    it("Should set the right owner", async () => {
        expect(await hardhatMulSig.invest(5)).to.be.not.null;
    })
})