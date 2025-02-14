import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js"; // Renamed for clarity

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000; // Use environment port if available

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Middleware
app.use(express.json()); // Parses incoming JSON data
app.use(
  cors({
    origin: "http://localhost:5173", // Update this with your frontend URL for security
    
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
  })
);


// ✅ Routes
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  console.log("Hello baba"); // Console log first before sending response
  res.send("Hello baba");
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
