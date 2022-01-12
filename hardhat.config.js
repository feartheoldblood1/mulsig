require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.5.3",
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/sQ6cDQmX5rTTPi9UJiKyHk4li_ZOTBpx',
      accounts: ['2d926c2b3afdc04864a0b5bd7cb10c225f86db7469d958b9bef53bd2827d740b']

    }
  }
};
