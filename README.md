# 🌟 Ethereum Indexer

Welcome to **Ethereum Indexer**! 🚀  
A powerful tool to track and index transactions for **interested addresses** on the Ethereum blockchain.

---

##  Features

- Tracks **user addresses** and relevant transactions
- Updates **balances in real-time**
- Stores **transaction history** in MongoDB
- Supports **frontend integration** for live updates
- Checkpoints last processed block to **resume seamlessly**

---

## Tech Stack

- **Blockchain Provider:** `ethers.js`  
- **Database:** MongoDB + Redis  
- **Language:** TypeScript / Node.js  
- **Realtime Updates:** WebSocket or API integration  

---

## ⚡ Usage

```bash
# Install dependencies
npm install

# Set environment variables in .env
ETH_RPC_URL=<your_rpc_url>
MONGO_URI=<your_mongodb_uri>
REDIS_URL=<your_redis_url>

# Run the indexer
npm run dev
