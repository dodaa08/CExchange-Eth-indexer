import userModel from "../db/schema.js";
import { redisClient } from "../config/redis.js";

const CACHE_KEY = "interested_addresses";

export const LoadInteresetdAddresses = async ()=>{
    try{
        const cached = await redisClient.get("interested_addresses");
        if(cached){
            return JSON.parse(cached);
        }

        const users = await userModel.find({}, {DepositAddress : 1, _id : 0});
        const addresse = users.map((user)=>user.DepositAddress);

        redisClient.set(CACHE_KEY, JSON.stringify(addresse));

        return addresse;

    }
    catch(error){
        console.error(error);
        return [];
    }
}
