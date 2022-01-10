const MultSig = artifacts.require("./MulSig.sol");

contract("MultSig", (accounts) => {
    const creatorAddress = accounts[0];
    const secondOwner = accounts[1];
    const thirdOwner = accounts[2];

    it("should be able add new owner", async() => {
        const contractInstance = await MultSig.new();
    })
})