const jwt=require('jsonwebtoken');
const User=require('../models/User');
const protect=async(req,res,next)=>{try{let token=null;const h=req.headers.authorization;if(h&&h.startsWith('Bearer '))token=h.split(' ')[1];if(!token)return res.status(401).json({message:'Not authorized, no token'});
const decoded=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(decoded.id).select('-password');if(!user)return res.status(401).json({message:'User not found'});
req.user=user;next();}catch(e){return res.status(401).json({message:'Not authorized, token invalid'});}};
const authorize=(...roles)=>(req,res,next)=>{if(!roles.includes(req.user.role))return res.status(403).json({message:'Forbidden: insufficient permissions'});next();};
module.exports={protect,authorize};
