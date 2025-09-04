import express from "express";
import userModel from "../../DB/Schema.js";
const authRouter = express.Router();
// import {ethers} from "ethers";
import MNUMONICS from "../../config/config.js";
import { HDNodeWallet } from "ethers";
import { mnemonicToSeedSync, validateMnemonic } from "bip39";
const seed = mnemonicToSeedSync(MNUMONICS);

const signup = async (req : any, res : any)=>{
    const {email, password} = req.body;
    
    try{
        
        const userFound = await userModel.findOne({
            email : email
        });

        if(userFound){
            res.status(500).json({
                message : "User already exists"
            });
            return;
        }

        const userCount = await userModel.countDocuments();
        const userId = userCount + 1;

        const hdNode = HDNodeWallet.fromSeed(seed);
        const Child  = hdNode.derivePath(`m/44'/60'/${userId}'/0`);
        const private_key = Child.privateKey;
        console.log("Private key", private_key);

        const DepositAddress = Child;
        console.log("Deposit Address", DepositAddress);
        
        
        const user = userModel.create({
            email : email,
            password : password,
            DepositAddress : DepositAddress.address,
            userId : userId,
            privateKey : private_key
        });
        

        console.log("User created...");
        res.json({
            message : "user created",
            user : {
                email : email,
                DepositAddress : DepositAddress
            },
            private_key : private_key,
            userID : userId
            // Deposit_key : DepositAddress
        });
    }
    catch(error){
        console.error(error);
        res.send(error);
    }    
}


authRouter.post("/signup", signup);
export default authRouter;