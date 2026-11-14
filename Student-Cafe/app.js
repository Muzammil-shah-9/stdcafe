const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000
const userRoutes = require("./route/routes.js");
const mongoose = require("mongoose");
const cors = require("cors");

const connectToDatabase = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB conected successfully");

    } catch (error) {
        console.error("failed to connect with MongoDB ", error.message)
    }
}
connectToDatabase()
app.use(cors())
app.use(express.json());
app.use("/users",userRoutes);

app.listen(port,(req,res)=>{
    console.log("our server is running on port ", port)
})
