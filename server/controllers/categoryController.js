const Category=require('../models/Category');
const {asyncHandler}=require('../middleware/errorHandler');
exports.list=asyncHandler(async(req,res)=>{res.json(await Category.find().sort({name:1}));});
exports.create=asyncHandler(async(req,res)=>{const{name,description,icon}=req.body;if(!name)return res.status(400).json({message:'Name required'});
res.status(201).json(await Category.create({name,description,icon}));});
exports.update=asyncHandler(async(req,res)=>{const c=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!c)return res.status(404).json({message:'Category not found'});res.json(c);});
exports.remove=asyncHandler(async(req,res)=>{const c=await Category.findById(req.params.id);if(!c)return res.status(404).json({message:'Category not found'});await c.deleteOne();res.json({message:'Category deleted'});});
