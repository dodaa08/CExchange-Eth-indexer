import { JsonRpcProvider } from "ethers";
import { getLastProcessedblock, setLastProcessedBlock } from "../services/bloclService.js";

const provider = new JsonRpcProvider(process.env.ETH_RPC_URL);

export const processBlocks = async ()=>{
    try{
        let latestBlock = await getLastProcessedblock();
        if(!latestBlock){
            latestBlock = await provider.getBlockNumber();
            await setLastProcessedBlock(latestBlock);   
        }

        provider.on("block", async (blockNumber)=>{
            if(blockNumber<=latestBlock) return;

            const block = await provider.getBlock(blockNumber, true);
            // process the txn here ?


            await setLastProcessedBlock(blockNumber);
        })

    }
    catch(error){
        console.error(error);
    }
}

