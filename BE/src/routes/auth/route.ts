import express from "express";
import userModel from "../../DB/Schema.js";
const authRouter = express.Router();
import {ethers} from "ethers";


const signup = async (req : any, res : any)=>{
    const {email, password} = req.body;

    try{
        const user = userModel.create({
            email : email,
            password : password
        });
        const DepositKey = ethers.Wallet.createRandom();
        console.log("Deposit key", DepositKey);

        console.log("User created...");
        res.json({
            message : "user created",
            user,
            Deposit_key : DepositKey
        });
    }
    catch(error){
        console.error(error);
        res.send(error);
    }    
}



authRouter.post("/signup", signup);

export default authRouter;