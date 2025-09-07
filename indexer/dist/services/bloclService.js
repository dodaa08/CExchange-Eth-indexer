import { redisClient } from "../config/redis.js";
const LATEST_BLOCK_KEY = "last_processed_block";
export const getLastProcessedblock = async () => {
    const block = await redisClient.get(LATEST_BLOCK_KEY);
    return block ? parseInt(block) : null;
};
export const setLastProcessedBlock = async (blockNumber) => {
    await redisClient.set(LATEST_BLOCK_KEY, blockNumber.toString());
};
//# sourceMappingURL=bloclService.js.map