const Inspection=require('../models/Inspection');
const Issue=require('../models/Issue');
const Standard=require('../models/Standard');
const {calcScore}=require('../utils/scoreUtils');
const {asyncHandler}=require('../middleware/errorHandler');
exports.list=asyncHandler(async(req,res)=>{const f={};if(req.query.location)f.location=req.query.location;if(req.query.category)f.category=req.query.category;if(req.query.inspector)f.inspector=req.query.inspector;if(req.query.rating)f.rating=req.query.rating;
if(req.user.role!=='admin')f.inspector=req.user._id;
if(req.query.from||req.query.to){f.date={};if(req.query.from)f.date.$gte=new Date(req.query.from);if(req.query.to)f.date.$lte=new Date(req.query.to);}
const list=await Inspection.find(f).populate('location','name').populate('category','name').populate('inspector','name email').populate('results.standard','title').sort({date:-1}).limit(500);res.json(list);});
exports.getOne=asyncHandler(async(req,res)=>{const i=await Inspection.findById(req.params.id).populate('location').populate('category').populate('inspector','name email').populate('results.standard');if(!i)return res.status(404).json({message:'Inspection not found'});res.json(i);});
exports.create=asyncHandler(async(req,res)=>{const{location,category,notes,results,date}=req.body;
if(!location||!category||!results||!results.length)return res.status(400).json({message:'Location, category and results required'});
for(const r of results){if(!['compliant','partial','non_compliant'].includes(r.status))return res.status(400).json({message:'Invalid status value'});}
const parsed=results.map(r=>({standard:r.standard,status:r.status,remarks:r.remarks||'',evidence:r.evidence||''}));
const{score,obtained,possible,rating}=calcScore(parsed);
const insp=await Inspection.create({location,category,inspector:req.user._id,notes:notes||'',results:parsed,score,obtained,possible,rating,date:date?new Date(date):new Date()});
await insp.populate([{path:'location',select:'name'},{path:'category',select:'name'},{path:'results.standard',select:'title'}]);
// auto-create issues for non-compliant
const stdMap={};for(const r of insp.results){stdMap[String(r.standard._id||r.standard)]=r;}
const stds=await Standard.find({_id:{$in:Object.keys(stdMap)}}).select('title');
for(const s of stds){const r=stdMap[String(s._id)];if(r&&r.status==='non_compliant'){
const exists=await Issue.findOne({inspection:insp._id,standard:s._id,status:{$in:['Open','In Progress']}});
if(!exists){await Issue.create({title:s.title+' — '+(insp.location.name||'Location'),description:r.remarks||('Non-compliant finding: '+s.title),location:insp.location._id||location,category:insp.category._id||category,standard:s._id,inspection:insp._id,reportedBy:req.user._id,priority:'Medium',status:'Open',evidence:r.evidence||''});}}}
const full=await Inspection.findById(insp._id).populate('location').populate('category').populate('results.standard');
res.status(201).json(full);});
exports.remove=asyncHandler(async(req,res)=>{const i=await Inspection.findById(req.params.id);if(!i)return res.status(404).json({message:'Inspection not found'});await i.deleteOne();res.json({message:'Inspection deleted'});});
