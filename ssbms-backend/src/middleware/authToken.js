import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const authenticateToken = async (req, res, next) => {
            //get the token we want to verify correct user
            try{
                const authHeader = req.headers.authorization;
                if(!authHeader) return res.status(401).json({msg:"No token provided "})
                
                const token = authHeader.split(" ")[1];
                if(!token) return res.status(401).json({msg:"No token provided "})

                const decode = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decode.id);
            
                //suspended user cant access api's
                if (!user.isActive) {
                return res.status(403).json({ msg: "Your account has been suspended" });
                }

               
                if(!user) return res.status(401).json({msg: "User not Found"});
                req.user = user;
                console.log(req.user.name);
                next();
            }catch(error){
                 return res.status(403).json({ msg: "Token is not valid" });
            }
        }; 

