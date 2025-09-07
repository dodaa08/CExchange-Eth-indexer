import { JsonRpcProvider, TransactionResponse } from "ethers";
import { getLastProcessedblock, setLastProcessedBlock } from "../services/bloclService.js";
import { check_balance_update_db } from "../services/Updatedb.js";
import userModel from "../db/schema.js";

 
const provider = new JsonRpcProvider(process.env.ETH_RPC_URL);


// get the txn details addresses and values being traded on the interested addresses
export const processBlock = async (blockNumber: number, addresses: string[]) => {
  try {
    const block = await provider.getBlock(blockNumber); // ✅ only hashes
    if (!block || !block.transactions) return;

    const updated_Users = {address : String, balance : String};


    for (const txHash of block.transactions) {
      const tx: TransactionResponse | null = await provider.getTransaction(txHash);
      if (!tx) continue;

    //   console.log(tx.hash);
      const from = tx.from?.toLowerCase()??"";
      const to = tx.to?.toLowerCase()??"";

      if (addresses.includes(from) || addresses.includes(to)) {
        console.log(
          `🔎 Relevant tx in block ${blockNumber}: ${tx.hash}, from ${from}, to ${to}, value: ${tx.value.toString()}`
        );

        // step 6: checkBalanceAndUpdate(address)
        for(const address of addresses){
            await check_balance_update_db(address);
            updated_Users.push({address, balance});
        }

        console.log("user updated");
        // return me the user updated data... to on fe 

        const snapshot = await userModel.find(
            {address : {$in : addresses}},
            {_id : 0, address : 1, balance : 1}
        );

        return snapshot;

        console.log("Users up to data with the current block txns")

      }
    }
  } catch (error) {
    console.error(error, `Error processing block no: ${blockNumber}`);
  }
};





export const startBlockListener = async (addresses : string[])=>{
    try{
        let latestBlock = await getLastProcessedblock();

        if(!latestBlock){
            latestBlock = await provider.getBlockNumber();
            await setLastProcessedBlock(latestBlock);   
        }

        provider.on("block", async (blockNumber)=>{
            if(latestBlock!==null){
                if(blockNumber<=latestBlock) return;
                
                for(let b = latestBlock + 1; b<=blockNumber; b++){
                    await processBlock(b, addresses);
                    await setLastProcessedBlock(b);
                    console.log("Saved checkpoint..");
                }
                
                latestBlock = blockNumber;
            }
        })

    }
    catch(error){
        console.error(error);
    }
}

