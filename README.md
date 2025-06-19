# Voting DApp

## Project Overview

This Voting DApp is a full-stack decentralized application built on the Ethereum blockchain that enables secure, transparent, and tamper-proof voting processes. It leverages blockchain technology to ensure the integrity and immutability of election results, providing a trustworthy platform for voters and administrators alike.

The application allows an admin to register candidates and voters, and enables voters to cast their votes securely through a user-friendly interface. All votes are recorded on-chain, ensuring transparency and preventing fraud such as double voting.

---

## Features

- **Secure Authentication:** Integration with MetaMask for wallet-based user authentication.
- **Role-Based Access Control:**  
  - *Admin:* Can add candidates and manage voters.  
  - *Voters:* Can cast one vote per wallet address.
- **Transparent Voting:** Every vote is recorded immutably on the Ethereum blockchain, enabling auditability.
- **Real-Time Vote Counting:** Votes are automatically tallied by the smart contract and results are updated live.
- **Double Voting Prevention:** The smart contract enforces one vote per voter address.
- **User-Friendly Interface:** Clean React-based frontend for easy interaction.
- **Immutable Election Records:** Blockchain guarantees tamper-proof storage of votes and candidate data.

---

## Technology Stack

| Layer          | Technologies & Tools                          |
|----------------|----------------------------------------------|
| **Frontend**   | React.js, TypeScript, CSS, ethers.js         |
| **Smart Contract** | Solidity (version ^0.8.x), Hardhat           |
| **Blockchain** | Ethereum (local Ganache for development)     |
| **Development Tools** | Hardhat, Ganache, MetaMask, Node.js, npm  |
| **Testing**    | Chai, Mocha (via Hardhat)                     |

---

## Setup Guide

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- MetaMask browser extension installed
- Ganache (for local blockchain testing)
- Hardhat (Ethereum development environment)

---

### Installation and Running Locally

1. **Clone the Repository**

    ```
    git clone https://github.com/Shubham-Khetan-2005/full-stack-voting-dapp/
    cd voting-dapp
    ```

2. **Install Dependencies**

    ```
    npm install
    ```

3. **Start Local Blockchain**

    Start Ganache on default port (7545):

    - Open Ganache GUI and start a workspace  
      OR  
    - Run Ganache CLI:

      ```
      ganache-cli -p 7545
      ```

4. **Compile and Deploy Smart Contracts**

    ```
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network localhost
    ```

    This deploys the voting contract to your local blockchain.

5. **Configure Frontend**

    Update the frontend configuration (e.g., contract address, ABI) if needed to point to your deployed contract on localhost.

6. **Run the Frontend**

    ```
    npm run start
    ```

    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

7. **Connect MetaMask**

    - Connect MetaMask to your local blockchain network (usually http://127.0.0.1:7545).
    - Import Ganache accounts into MetaMask to act as voters or admin.

---

### Usage

- As **Admin**, add candidates by providing their name, slogan, and optionally a logo.
- Register voter wallet addresses authorized to vote.
- Voters connect their wallets and cast their vote for a candidate.
- Votes are recorded on-chain and counted automatically.
- Results update in real-time and are fully transparent.

---

## License

This project is open source and available under the MIT License.

---

