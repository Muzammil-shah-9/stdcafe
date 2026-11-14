const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000
const userRoutes = require("./route/routes.js");
const mongoose = require("mongoose");
const cors = require("cors");

const connectToDatabase = async () => {
    if (!process.env.MONGO_URI) {
        console.warn("MONGO_URI environment variable is not defined.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("failed to connect with MongoDB ", error.message);
    }
};
connectToDatabase();

app.use(cors());
app.use(express.json());

app.get(["/", "/api", "/api/health"], (req, res) => {
    res.json({ status: "ok", service: "Student Cafe API" });
});

app.use(["/api/users", "/users"], userRoutes);

app.listen(port, () => {
    console.log("our server is running on port ", port);
});

module.exports = app;
