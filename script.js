const contractAddress = "0x4697073a0160E29b457bf6AEB9e312f672194c25";

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "changeCounter",
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
    "name": "myAddress",
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
        "internalType": "string",
        "name": "_worldMessage",
        "type": "string"
      }
    ],
    "name": "updateMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "worldMessage",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask to use this dApp");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    // ✅ Show connected wallet address
    const address = await signer.getAddress();
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const statusEl = document.getElementById("walletStatus");
    statusEl.innerText = `🟢 Connected: ${shortAddr}`;
    statusEl.style.color = "#7f5af0";

    console.log("Wallet connected:", address);
    readMessage();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

async function readMessage() {
  try {
    const readProvider = new ethers.providers.Web3Provider(window.ethereum);
    const readContract = new ethers.Contract(contractAddress, contractABI, readProvider);
    const message = await readContract.worldMessage();
    const counter = await readContract.changeCounter();
    document.getElementById("messageDisplay").innerText = message;
    document.getElementById("counterDisplay").innerText = counter;
  } catch (err) {
    console.error("Read failed:", err);
  }
}

async function updateMessage() {
  if (!contract) {
    alert("Please connect your wallet first");
    return;
  }

  try {
    const msg = document.getElementById("msgInput").value;
    const tx = await contract.updateMessage(msg);
    await tx.wait();
    readMessage();
    alert("Message updated!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Transaction failed. Are you the owner?");
  }
}

window.addEventListener("load", () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    readMessage();
  }
});
