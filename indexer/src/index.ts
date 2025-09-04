// building an indexer to index over the eth blockchain data...
import userModel from "./db/schema.js"
import mongoose from "mongoose"
import dotenv from "dotenv";
import { JsonRpcProvider } from "ethers";
import {ethers} from "ethers";
dotenv.config();

const connection_String = process.env.MONGO_DB_CONNECTION || "";

// A function to get the addresses from the db 
const getAddresses = async ()=>{
    try{
        const connect = await mongoose.connect(connection_String);
        if(!connect){
            console.log("Failed to connect to the db")
            return;
        }

        const users = await userModel.find({}, {DepositAddress : 1, _id : 0});  // get me all the addresses
        const addresses = users.map((user)=>user.DepositAddress);
        
        return addresses;   

    }
    catch(error){
        console.error(error)
    }
}
// inspect the block native eth on the fetched addresses (Single for now) find events
 const interested_addresses = [];
 const addresses = await getAddresses();
 interested_addresses.push(addresses);

const pool_and_index_txns = async ()=>{

    const provider = new JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/MM4Ea2T15gm-OhvQNLjrNI8cqYoV_Wcr"
   );
   const blockNo = 23291859; // what's the point of using this recent but random block no.  ?


    try{
        const block = await provider.getBlock(blockNo, true);
        if(!block){
            return;
        }
        console.log(block?.transactions);


    for (const txHash of block.transactions) {
        const tx = await provider.getTransaction(txHash);

        if(!tx) return;

        console.log(`Txn ${tx.hash}: ${ethers.formatEther(tx.value)} ETH from ${tx.from} to ${tx.to}`);

        const receipt = await provider.getTransactionReceipt(txHash);
        if(!receipt) return;
console.log("recipient logs: ",receipt.logs);
    }

    }
    catch(error){
        console.error(error);
    }
}

// example pooling the ethereum blockchain..

// setTimeout(()=>{
//     pool_and_index_txns();
// }, 10000)


// after fetching the confirmaton from the blockchain, update the db with the updated fetched blockchain data

const confim_and_update_db = async ()=>{

}

pool_and_index_txns();





