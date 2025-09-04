import express from "express";
// import { request, response } from "express";
import userModel from "../../DB/Schema.js";
const depositAddressRoute = express.Router();
const getDepositAddress = async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await userModel.findOne({ userId: userid });
        if (!user) {
            res.status(500).send("user not found..");
            return;
        }
        res.status(200).json({
            message: "User deposit address found.",
            DepositAddress: user.DepositAddress
        });
    }
    catch (error) {
        console.error(error);
    }
};
depositAddressRoute.get("/depositAddress/:userid", getDepositAddress);
depositAddressRoute.get("/health", (req, res) => {
    res.send("Route working");
});
export default depositAddressRoute;
//# sourceMappingURL=route.js.map