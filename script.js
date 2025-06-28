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

async function isOwner() {
  if (!signer || !contract) return false;
  const walletAddress = await signer.getAddress();
  const ownerAddress = await contract.myAddress();
  return walletAddress.toLowerCase() === ownerAddress.toLowerCase();
}


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

    const address = await signer.getAddress();
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
    document.getElementById("walletStatus").innerText = `🟢 Connected: ${shortAddr}`;
    document.getElementById("walletStatus").style.color = "#7f5af0";

    // ✅ Delay a bit and then load the message
    setTimeout(() => {
      readMessage();
    }, 200);

  } catch (err) {
    console.error("Connection error:", err);
  }
}


async function readMessage() {
  try {
    const message = await contract.worldMessage();
    const counter = await contract.changeCounter();
    document.getElementById("messageDisplay").innerText = message;
    document.getElementById("counterDisplay").innerText = counter;
  } catch (err) {
    console.error("Read failed:", err);
    alert("Failed to read from contract. Make sure your wallet is connected.");
  }
}

async function updateMessage() {
  if (!contract) {
    alert("Please connect your wallet first");
    return;
  }

  try {
    const msg = document.getElementById("msgInput").value;
    
    const ownerCheck = await isOwner();
    if (!ownerCheck) {
      alert("❌ You are not the owner. Only the contract owner can update the message.");
      return;
    }

    const tx = await contract.updateMessage(msg);
    await tx.wait();
    readMessage();
    alert("✅ Message updated!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Transaction failed.");
  }
}



