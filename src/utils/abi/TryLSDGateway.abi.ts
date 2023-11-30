
export const TryLSDGatewayABI = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [],
      "name": "FailedToSendEth",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "MinEthSlippageError",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "MinSharesSlippageError",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "NotPayable",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "TooLittleEthError",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "TooLittleSharesError",
      "type": "error"
  },
  {
      "inputs": [],
      "name": "TransferFromFailed",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "ethAmount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "name": "Deposit",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "ethAmount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "name": "Withdraw",
      "type": "event"
  },
  {
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "name": "calculateEth",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "ethAmount",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
          }
      ],
      "name": "calculatePoolShares",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "minShares",
              "type": "uint256"
          }
      ],
      "name": "swapAndDeposit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          }
      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "minEth",
              "type": "uint256"
          }
      ],
      "name": "withdrawAndSwap",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "ethAmount",
              "type": "uint256"
          }
      ],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "stateMutability": "payable",
      "type": "receive"
  }
] as const;
