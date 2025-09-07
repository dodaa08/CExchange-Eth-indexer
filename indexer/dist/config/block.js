import { JsonRpcProvider, TransactionResponse } from "ethers";
import { getLastProcessedblock, setLastProcessedBlock } from "../services/bloclService.js";
const provider = new JsonRpcProvider(process.env.ETH_RPC_URL);
// get the txn details addresses and values being traded on the interested addresses
export const processBlock = async (blockNumber, addresses) => {
    try {
        const block = await provider.getBlock(blockNumber); // ✅ only hashes
        if (!block || !block.transactions)
            return;
        for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash);
            if (!tx)
                continue;
            //   console.log(tx.hash);
            const from = tx.from?.toLowerCase() ?? "";
            const to = tx.to?.toLowerCase() ?? "";
            if (addresses.includes(from) || addresses.includes(to)) {
                console.log(`🔎 Relevant tx in block ${blockNumber}: ${tx.hash}, from ${from}, to ${to}, value: ${tx.value.toString()}`);
                // 👉 step 6: checkBalanceAndUpdate(address)
            }
        }
    }
    catch (error) {
        console.error(error, `Error processing block no: ${blockNumber}`);
    }
};
export const startBlockListener = async (addresses) => {
    try {
        let latestBlock = await getLastProcessedblock();
        if (!latestBlock) {
            latestBlock = await provider.getBlockNumber();
            await setLastProcessedBlock(latestBlock);
        }
        provider.on("block", async (blockNumber) => {
            if (latestBlock !== null) {
                if (blockNumber <= latestBlock)
                    return;
                const block = await provider.getBlock(blockNumber, true);
                for (let b = latestBlock + 1; b <= blockNumber; b++) {
                    await processBlock(b, addresses);
                    await setLastProcessedBlock(b);
                    console.log("Saved checkpoint..");
                }
                latestBlock = blockNumber;
            }
        });
    }
    catch (error) {
        console.error(error);
    }
};
//# sourceMappingURL=block.js.map