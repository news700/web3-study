/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
// require('dotenv').config();
// const Web3 = require("web3");
// const web3 = new Web3();
// const WalletProvider = require("truffle-wallet-provider");
// const Wallet = require('ethereumjs-wallet');
//
// var rinkebyPrivateKey = new Buffer("private key", "hex")
// var rinkebyWallet = Wallet.fromPrivateKey(rinkebyPrivateKey);
// var rinkebyProvider = new WalletProvider(rinkebyWallet, "https://rinkeby.infura.io/");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }/*,
    rinkeby: {
      provider: rinkebyProvider,
      gas: 4600000,
      gasPrice: web3.toWei("20", "gwei"),
      network_id: "3",
    }*/
  }
};
