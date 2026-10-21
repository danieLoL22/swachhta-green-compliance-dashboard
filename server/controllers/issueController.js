const Issue=require('../models/Issue');
const {asyncHandler}=require('../middleware/errorHandler');
function buildFilter(q,user){const f={};if(q.status)f.status=q.status;if(q.priority)f.priority=q.priority;if(q.location)f.location=q.location;if(q.category)f.category=q.category;if(q.assignedTo)f.assignedTo=q.assignedTo;
if(q.search)f.title={$regex:q.search,$options:'i'};
if(user.role!=='admin'){f.$or=[{reportedBy:user._id},{assignedTo:user._id}];}
if(q.from||q.to){f.createdAt={};if(q.from)f.createdAt.$gte=new Date(q.from);if(q.to)f.createdAt.$lte=new Date(q.to);}return f;}
exports.list=asyncHandler(async(req,res)=>{res.json(await Issue.find(buildFilter(req.query,req.user)).populate('location','name').populate('category','name').populate('standard','title').populate('reportedBy','name email').populate('assignedTo','name email').populate('inspection','date score').sort({createdAt:-1}).limit(500));});
exports.getOne=asyncHandler(async(req,res)=>{const i=await Issue.findById(req.params.id).populate('location').populate('category').populate('standard').populate('reportedBy','name email').populate('assignedTo','name email').populate('inspection');if(!i)return res.status(404).json({message:'Issue not found'});res.json(i);});
exports.create=asyncHandler(async(req,res)=>{const{title,description,location,category,standard,priority,dueDate,assignedTo,evidence}=req.body;if(!title||!location)return res.status(400).json({message:'Title and location required'});
res.status(201).json(await Issue.create({title,description,location,category:category||undefined,standard:standard||undefined,reportedBy:req.user._id,assignedTo:assignedTo||undefined,priority:priority||'Medium',dueDate:dueDate||undefined,status:'Open',evidence:evidence||''}));});
exports.update=asyncHandler(async(req,res)=>{const i=await Issue.findById(req.params.id);if(!i)return res.status(404).json({message:'Issue not found'});
const{status,assignedTo,priority,dueDate,resolutionRemarks,description,title}=req.body;
if(req.user.role!=='admin'&&String(i.reportedBy)!==String(req.user._id)&&String(i.assignedTo)!==String(req.user._id))return res.status(403).json({message:'Forbidden'});
if(title!==undefined)i.title=title;if(description!==undefined)i.description=description;
if(req.user.role==='admin'){if(assignedTo!==undefined)i.assignedTo=assignedTo||undefined;if(priority!==undefined)i.priority=priority;if(dueDate!==undefined)i.dueDate=dueDate||undefined;}
else{if(priority!==undefined)i.priority=priority;}
if(status!==undefined){i.status=status;if(status==='Resolved'||status==='Closed'){i.resolvedDate=new Date();if(resolutionRemarks!==undefined)i.resolutionRemarks=resolutionRemarks;}}
if(resolutionRemarks!==undefined&&req.user.role==='admin')i.resolutionRemarks=resolutionRemarks;
await i.save();await i.populate([{path:'location',select:'name'},{path:'standard',select:'title'},{path:'assignedTo',select:'name email'}]);res.json(i);});
exports.remove=asyncHandler(async(req,res)=>{if(req.user.role!=='admin')return res.status(403).json({message:'Forbidden'});const i=await Issue.findById(req.params.id);if(!i)return res.status(404).json({message:'Issue not found'});await i.deleteOne();res.json({message:'Issue deleted'});});
