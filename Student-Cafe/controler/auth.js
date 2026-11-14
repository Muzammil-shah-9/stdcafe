const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const register = async (req,res)=>{
    const {name , email , password}= req.body;

    // check user already exists or not

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new creater
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    })
    // error handling

    try{
        await newUser.save();
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"})
        res.status(201).json({message:"User registered successfully", token})

    } catch(err){
        res.status(500).json({message:"error registering User"})
    }
}

const login = async (req,res)=>{
    const {email,password}= req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User doesnot exists"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
           return res.status(400).json({message:"Invalid Credentials"});

    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET ,{expiresIn:"1h"})
    res.status(200).json({token})
}

const verifyToken = async (req, res) => {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!token) return res.status(401).json({message:"Authentication required"});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select("_id");
        if (!user) return res.status(401).json({message:"Account not found"});
        return res.status(200).json({authenticated:true});
    } catch (err) {
        return res.status(401).json({message:"Invalid or expired session"});
    }
}

module.exports = { register, login, verifyToken }

















