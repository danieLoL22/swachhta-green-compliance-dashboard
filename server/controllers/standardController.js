const Standard=require('../models/Standard');
const {asyncHandler}=require('../middleware/errorHandler');
exports.list=asyncHandler(async(req,res)=>{const f={};if(req.query.category)f.category=req.query.category;if(req.query.active!==undefined)f.active=req.query.active==='true';
res.json(await Standard.find(f).populate('category','name').sort({title:1}));});
exports.create=asyncHandler(async(req,res)=>{const{title,description,category}=req.body;if(!title||!category)return res.status(400).json({message:'Title and category required'});
res.status(201).json(await Standard.create({title,description,category}));});
exports.update=asyncHandler(async(req,res)=>{const s=await Standard.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!s)return res.status(404).json({message:'Standard not found'});res.json(s);});
exports.remove=asyncHandler(async(req,res)=>{const s=await Standard.findById(req.params.id);if(!s)return res.status(404).json({message:'Standard not found'});await s.deleteOne();res.json({message:'Standard deleted'});});
