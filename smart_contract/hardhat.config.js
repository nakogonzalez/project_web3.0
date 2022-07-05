require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/Ln0tmudZF1p3e70qqz0XKy9QJ8IfUoI_',
      accounts: ['c2448aa02a557b33a4d91801066c915fd6b925365c787098344fb6dc16b3ead1'],
    },
  },
};