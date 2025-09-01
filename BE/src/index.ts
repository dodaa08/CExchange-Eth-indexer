import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth/route.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;
const connection = process.env.MONGO_DB_CONNECTION || "";

// Connect to DB first
const connectDB = async () => {
  try {
    await mongoose.connect(connection);
    console.log("✅ MongoDB connected");

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit process if DB fails
  }
};

connectDB();

app.get("/health", (req, res) => {
  console.log("Healthy");
  res.send("Healthy 200!");
});
