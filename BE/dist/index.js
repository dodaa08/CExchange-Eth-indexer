import express from "express";
const app = express();
const PORT = process.env.PORT;
app.get("/health", (req, res) => {
    console.log("Healthy");
    res.send("Healthy 200!");
});
app.listen(PORT, () => {
    console.log("Running on", PORT);
});
//# sourceMappingURL=index.js.map