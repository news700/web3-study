<template>

  <v-form>
    <img src="@/assets/ethereum.png">
    <v-container>

      <div class="text-xs-center">
        <v-btn round color="blue" dark @click="loadWalletForEth">Load Ethereum</v-btn>
        <v-btn round color="green" dark @click="loadWalletForToken">Load ERC-20 Token</v-btn>
      </div>

      <v-layout row wrap>

        <v-flex xs12>
          <v-text-field label="Address" v-model="address"></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field label="Balance" v-model="balance"></v-text-field>
        </v-flex>
      </v-layout>


      <div class="text-xs-center">
        <v-progress-circular indeterminate color="amber" v-show="progress"></v-progress-circular>
      </div>


      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field label="To" v-model="send2.address"></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field label="Amount" v-model="send2.amount"></v-text-field>
        </v-flex>

      </v-layout>

      <div class="text-xs-center">
        <v-btn round color="red" dark @click="sendTo">Send To</v-btn>
      </div>

      <v-flex xs12>
        <div class="text-xs-left">
          <vue-json-pretty :path="'result'" :data="receipt" :deep="1" :showLength="true"></vue-json-pretty>
        </div>
      </v-flex>

    </v-container>
  </v-form>
</template>

<script>
  import BigNumber from 'bignumber.js'
  import VueJsonPretty from 'vue-json-pretty'

  const wei = new BigNumber(1000000000000000000)

  const tokenAddress = '0x01136cc7dd8a193d1bd0236bb5159eb969e681d3';
  const minABI = [
    // balanceOf
    {
      "constant": true,
      "inputs": [
        {
          "name": "_who",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const contract = web3.eth.contract(minABI).at(tokenAddress);

  export default {
    name: 'HelloWeb3',
    components: {
      VueJsonPretty
    },
    data() {
      return {
        progress: false,
        image: '',
        symbol: '',
        address: '',
        balance: 0,
        send2: {
          address: '',
          amount: 0
        },
        receipt: ''
      }
    },
    methods: {
      initialize() {
        return new Promise(resolve => {
          if (typeof web3 !== 'undefined') {
            //Use Mist/MetaMask's provider
            window.web3 = new Web3(web3.currentProvider)
          } else {
            console.log('No web3? You should consider trying MetaMask!')
            //fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            window.web3 = new Web3(
              new Web3.providers.HttpProvider("https://localhost:8545")
            )
          }
          return resolve()
        })
      },
      getEthBalance() {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts((error, accounts) => {
            if (!error) {
              web3.eth.getBalance(accounts[0], (error, balance) => {
                if (!error) {
                  console.log('accounts[0]', accounts[0], ', balance', balance.toNumber())
                  const result = {
                    address: accounts[0],
                    balance: (new BigNumber(balance).dividedBy(wei)).toNumber()
                  }
                  this.symbol = 'ETH'
                  return resolve(result)
                } else {
                  return reject(error)
                }
              })
            } else {
              return reject(error)
            }
          })
        })
      },
      getTokenBalance() {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts((error, accounts) => {
            if (!error) {
              contract.balanceOf(accounts[0], (error, balance) => {
                if (!error) {
                  console.log('accounts[0]', accounts[0], ', balance', balance.toNumber())
                  const result = {
                    address: accounts[0],
                    balance: (new BigNumber(balance)).toNumber()
                  }
                  this.symbol = 'PLY'
                  return resolve(result)
                } else {
                  return reject(error)
                }
              })
            } else {
              return reject(error)
            }
          })
        })
      },
      getReceipt(txHash) {
        return new Promise((resolve, reject) => {
          web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
            // it returns tx hash because sending tx
            this.progress = false
            if (!err) {
              this.receipt = receipt
              if (this.symbol === 'ETH') {
                this.loadWalletForEth()
              } else {
                this.loadWalletForToken()
              }
              return resolve(receipt)
            }
            return reject(err)
          })
        })
      },
      setBalance(result) {
        console.log(result)
        this.address = result.address
        this.balance = result.balance
      },
      loadWalletForEth() {
        this.getEthBalance()
        .then(this.setBalance)
        .catch((err) => this.error(err))
      },
      loadWalletForToken() {
        this.getTokenBalance()
        .then(this.setBalance)
        .catch((err) => this.error(err))
      },
      sendTo() {
        this.progress = true
        if (this.symbol === 'ETH') {
          this.sendEth()
          .then(this.getReceipt)
        } else {
          this.sendToken()
          .then(this.getReceipt)
        }
      },
      sendEth() {
        return new Promise((resolve, reject) => {
          //using the callback
          web3.eth.sendTransaction({
            from: this.address,
            to: this.send2.address,
            value: web3.toHex(web3.toWei(this.send2.amount, 'ether'))
          }, (err, txHash) => {
            // it returns tx hash because sending tx
            if (!err) {
              return resolve(txHash)
            }
            return reject(err)
          })
        })
      },
      sendToken() {
        return new Promise((resolve, reject) => {
          //using the callback
          contract.transfer(
            this.send2.address,
            this.send2.amount,
            (err, txHash) => {
              // it returns tx hash because sending tx
              if (!err) {
                return resolve(txHash)
              }
              return reject(err)
            })
        })
      },
      error(err) {
        console.log(err)
      }
    }, created() {
      this.initialize()
      .catch((err) => this.error(err))
    }
  }
</script>
