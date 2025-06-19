# Voting DApp – Fullstack Blockchain Voting Platform

## Overview

This project is a **fullstack voting dApp** that enables decentralized, transparent, and secure on-chain voting. It features a robust smart contract for managing proposals, voters, and votes, all wrapped in a modern React front-end for seamless user interaction. The dApp is deployed on the Ethereum Holesky testnet, with all key actions verifiable via Etherscan and accessible to anyone with MetaMask.

---

## Features

- **Chairperson Control:**  
  Only the contract owner (chairperson) can register voters and add proposals.

- **Voter Registration:**  
  Only registered voters can participate in voting.

- **Unlimited Proposals:**  
  The chairperson can add any number of proposals.

- **Voting Deadline:**  
  Voting is allowed only within a set period (default: 1 week from deployment).

- **Vote Delegation:**  
  Voters can delegate their vote to another registered voter.

- **Winner Calculation:**  
  Instantly determine the proposal with the most votes.

- **Event Logging:**  
  All key actions (voter registration, voting, delegation) emit events for easy tracking.

- **Responsive Frontend:**  
  Modern React UI with real-time status, error handling, and MetaMask integration.

---

## Technology Stack

| Layer          | Technologies & Tools                          |
|----------------|----------------------------------------------|
| **Frontend**   | React.js, MetaMask, CSS, ethers.js         |
| **Smart Contract** | Solidity (`Voting.sol`), OpenZeppelin Ownable           |
| **Blockchain** | Ethereum Holesky Testnet     |
| **Development Tools** | Hardhat, MetaMask, Node.js, npm  |
| **Testing**    | Chai, Mocha (unit tests for all contract logic)     |
| **Verification**    | Etherscan API for contract verification |

---

## Setup Guide

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- MetaMask browser extension installed
- Hardhat (Ethereum development environment)

---

### Installation and Running Locally

1. **Clone the Repository**

    ```
    git clone https://github.com/Shubham-Khetan-2005/full-stack-voting-dapp/
    cd voting-dapp
    ```

2. **Install Dependencies**
   #### Backend (Hardhat)

    ```
    npm install
    ```

    #### Frontend (React)
    ```
    cd frontend
    npm install
    ```

3. **Configure Environment Variables**

    Create a `.env` file in the root directory:
    #### Holesky network
    ```
    HOLESKY_RPC_URL=https://holesky.infura.io/v3/YOUR_INFURA_KEY
    PRIVATE_KEY=0xYourPrivateKey
    ETHERSCAN_API_KEY=YourEtherscanApiKey
    CHAIRPERSON=0xYourChairpersonAddress   # (optional, defaults to deployer)
    ```
    

4. **Compile and and Test Contracts**

    ```
    npx hardhat compile
    npx hardhat test
    ```

    This deploys the voting contract to your local blockchain.

5. **Deploy to Holesky**

    Start by funding your deployer address with Holesky test ETH.
    ```
    npx hardhat run scripts/deploy.js --network holesky
    ```
    After deployment, verify the contract:
    ```
    npx hardhat verify --network holesky <CONTRACT_ADDRESS> <CHAIRPERSON_ADDRESS>
    ```
    
6. **Run the Frontend Locally**

    ```
    cd frontend
    npm run start
    ```

    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## User Flow

1. **Chairperson:**  
 - Connects wallet  
 - Registers voters and adds proposals via the Admin Panel

2. **Voter:**  
 - Connects wallet (must be registered)  
 - Votes for a proposal or delegates their vote  
 - Sees confirmation and live winner updates

3. **Public:**  
 - Can view proposals and winner  
 - All actions are logged and visible on Etherscan

---

## License

This project is open source and available under the MIT License.

---
## Author

Developed by Shubham Khetan 

---

**Enjoy decentralized, transparent voting!**
