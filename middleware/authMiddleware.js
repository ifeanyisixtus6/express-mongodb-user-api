import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import mongoose from "mongoose";


export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  try {

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    req.user = user;
    req.user.role = decoded.role; 

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};


export const authorizeRoles = (...
  
  roles) => {
  return (req,res,next)=>{
    //console.log("req.user", req.user.role);
   // console.log("roles", roles);
    if(!(roles.includes(req.user.role))){
      const err = new Error(`Access Denied, you are not allowed to access this resource!`);
      err.status = 403;
      return next(err);

    }
    next();
  }
} 
  



































