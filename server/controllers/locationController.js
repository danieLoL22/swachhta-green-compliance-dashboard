const Location=require('../models/Location');
const {asyncHandler}=require('../middleware/errorHandler');
exports.list=asyncHandler(async(req,res)=>{res.json(await Location.find().sort({name:1}));});
exports.create=asyncHandler(async(req,res)=>{const{name,type,description,incharge}=req.body;if(!name)return res.status(400).json({message:'Name required'});
res.status(201).json(await Location.create({name,type,description,incharge}));});
exports.update=asyncHandler(async(req,res)=>{const l=await Location.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!l)return res.status(404).json({message:'Location not found'});res.json(l);});
exports.remove=asyncHandler(async(req,res)=>{const l=await Location.findById(req.params.id);if(!l)return res.status(404).json({message:'Location not found'});await l.deleteOne();res.json({message:'Location deleted'});});
