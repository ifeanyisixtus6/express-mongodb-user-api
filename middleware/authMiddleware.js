import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import mongoose from "mongoose";


export const protect = async (req, res, next) => {
  let token;
  console.log("Raw Authorization Header:", req.headers.authorization);
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

    console.log("Raw Authorization Header:", req.headers.authorization);
    console.log("Token:", token);
    

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
    console.log("req.user", req.user.role);
    console.log("roles", roles);
    if(!(roles.includes(req.user.role))){
      const err = new Error(`Access Denied, you are not allowed to access this resource!`);
      err.status = 403;
      return next(err);

    }
    next();
  }
} 
  



































/*export const protect = async (req, res, next) => {
  let token;
  
  // Extract token
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
    // Verify 
    console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   // console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);

    
    // Add validation for decoded token structure
    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token structure" });
    }
    
    // Validate userId format (if using MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ error: "Invalid user ID in token" });
    }
    
    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }
    
    // Set user data consistently
    req.user = user;
    req.userRole = user.role; // Use user.role from database, not decoded.role
    
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(401).json({ error: "Token verification failed" });
    }
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("req.user.role:", req.user?.role);
    console.log("allowed roles:", roles);
    
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "Access Denied, insufficient permissions" 
      });
    }
    
    next();
  };
};


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
    req.userRole = decoded.role; 

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};


export const authorizeRoles = (...
  
  roles) => {
  return (req,res,next)=>{
    console.log("req.user", req.user.role);
    console.log("roles", roles);
    if(!(roles.includes(req.user.role))){
      const err = new Error(`Access Denied, you are not allowed to access this resource!`);
      err.status = 403;
      return next(err);

    }
    next();
  }
} 
  
*/
