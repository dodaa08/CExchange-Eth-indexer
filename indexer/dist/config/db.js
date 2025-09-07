import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const Mongodb_connecttion = process.env.MONGO_DB_CONNECTION || "";
if (!Mongodb_connecttion) {
    throw new Error("MONGO_DB_CONNECTION is missing in .env file");
}
export const connectDB = async () => {
    try {
        await mongoose.connect(Mongodb_connecttion);
        console.log("Db connected..");
    }
    catch (error) {
        console.error(error);
    }
};
connectDB();
//# sourceMappingURL=db.js.map