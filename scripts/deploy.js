const { ethers } = require("hardhat");

async function main () {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const MulSig = await ethers.getContractFactory("MultiSig");
    const mulsig = await MulSig.deploy();

    console.log("MultiSig address:", mulsig.address);
}

main()
.then(()=>process.exit(0))
.catch((error)=> {
    console.error(error);
    process.exit(1);
})