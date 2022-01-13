console.log("hello dapp developers!")

window.addEventListener('load', function() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask detected!')
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML = "Metamask has been detected!"
    }

    else {
        console.log('MetaMask not available!')
        alert("You need to install MetaMask!")
    }
})

const mmEnable = document.getElementById('mm-connect')

mmEnable.onclick = async () => {
    await ethereum.request({ method:'eth_requestAccounts'})

    const mmCurrentAccount = document.getElementById('mm-current-account')

    mmCurrentAccount.innerHTML = "Here's your current account: " + ethereum.selectedAddress
}

const ssAddress =  0xcB02782c804805e8914Ef0E4926921A2D2503147

const ssABI = [
	{
		"inputs": [
			{
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			},
			{
				"internalType": "contract ERC20",
				"name": "_cERC20Contract",
				"type": "address"
			}
		],
		"name": "authorizeToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "id_",
				"type": "bytes32"
			}
		],
		"name": "bump",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "buy",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "cancel",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "pair",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "maker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "buy_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "pay_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "buy_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "timestamp",
				"type": "uint64"
			}
		],
		"name": "LogBump",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "LogItemUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "pair",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "maker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "buy_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "pay_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "buy_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "timestamp",
				"type": "uint64"
			}
		],
		"name": "LogKill",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "pair",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "maker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "buy_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "pay_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "buy_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "timestamp",
				"type": "uint64"
			}
		],
		"name": "LogMake",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "pair",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "maker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "buy_gem",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "taker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "take_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "give_amt",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "timestamp",
				"type": "uint64"
			}
		],
		"name": "LogTake",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pay_amt",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "buy_amt",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buy_gem",
				"type": "address"
			}
		],
		"name": "LogTrade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "MyLog",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pay_amt",
				"type": "uint256"
			},
			{
				"internalType": "contract ERC20",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "buy_amt",
				"type": "uint256"
			},
			{
				"internalType": "contract ERC20",
				"name": "buy_gem",
				"type": "address"
			}
		],
		"name": "offer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "redeemType",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "_cERC20Contract",
				"type": "address"
			}
		],
		"name": "redeemCERC20Tokens",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "redeemType",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "_cEthERContract",
				"type": "address"
			}
		],
		"name": "redeemCEth",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_ERC20Contract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_cERC20Contract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_numTokensToSupply",
				"type": "uint256"
			}
		],
		"name": "supplyERC20ToCompound",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_cEthERContract",
				"type": "address"
			}
		],
		"name": "supplyEthToCompound",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			}
		],
		"name": "tokenAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			}
		],
		"name": "valueUpdate",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "acceptedTokens",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getOffer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "contract ERC20",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "contract ERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "isActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "last_offer_id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "last_token_id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC20",
				"name": "",
				"type": "address"
			}
		],
		"name": "ledger",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalMarket",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalCommission",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "offers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "pay_amt",
				"type": "uint256"
			},
			{
				"internalType": "contract ERC20",
				"name": "pay_gem",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "buy_amt",
				"type": "uint256"
			},
			{
				"internalType": "contract ERC20",
				"name": "buy_gem",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint64",
				"name": "timestamp",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			}
		],
		"name": "totalCommission",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			}
		],
		"name": "totalMarket",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC20",
				"name": "_ERC20Contract",
				"type": "address"
			}
		],
		"name": "totalToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]