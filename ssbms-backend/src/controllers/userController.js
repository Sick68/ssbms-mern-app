
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Signup section
export const createUser = async(req,res) => {
    try{
          
        const {name,email, password, role}  = req.body;

        
       const salt  = await bcrypt.genSalt();
       const hashedPassword = await bcrypt.hash(req.body.password, salt);
       let isApproved = true;
       if(role === "provider"){
        isApproved = false;
       }
       const user = await User.create({name, email, password: hashedPassword, role: role || "customer", isApproved});
       res.status(200).json(user);

    }catch(error){
       res.status(500).json({msg: error.message});
    }
}
//Login Section 
export const authenticateUser = async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send("Cannot find User");
    }
    try{
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if(isMatch){
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({
            msg: "Login Successfull",
            user: payload,
            accessToken
        })
    }
        
      
     else{return res.status(400).send("Not Allowed")}
    }catch(error){
       res.status(500).json({msg: error.message});
    }
}

export const approveProvider = async(req,res) => {
    try{
        const providerId = req.params.id;
        const user = await User.findById(providerId);

        if(!user || user.role !== "provider"){
            return res.status(404).json({msg: "Provider not found"});
        }
        user.isApproved = true;
        await user.save();
        res.status(200).json({msg: "Provider approved Successfully" })
    }catch(error){
       res.status(500).json({msg: error.message})
    }
}

export const getUser = async(req,res) => {
    try{
        const user = await User.find();
        res.status(200).json(user);
        
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}
export const getUserById = async(req,res) => {
    
try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(500).json({msg: "User not found"});
        res.status(200).json(user);
} catch (error) {
    res.status(500).json({msg: error.message});
}
}

export const toggleUserActive = async(req,res) => {
    try{
        const user = await User.findById(req.params.id);
        
        if(!user) {
            return res.status(400).json({msg: "User not found"})
        }
        if(user.role === "admin"){
            return res.status(403).json({msg: "Admin cannot be suspended"})
        }
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            msg: `User ${user.isActive ? "activated" : "suspended"} successfully`,
            Active: user.isActive
        })
    }catch(error){
        res.status(500).json({msg: "Server error"});
    }
}