const Inspection=require('../models/Inspection');
const Issue=require('../models/Issue');
const {asyncHandler}=require('../middleware/errorHandler');
exports.summary=asyncHandler(async(req,res)=>{const{from,to,category,location,inspector,status}=req.query;
const f={};if(category)f.category=category;if(location)f.location=location;if(inspector)f.inspector=inspector;if(status)f.rating=status;
if(from||to){f.date={};if(from)f.date.$gte=new Date(from);if(to)f.date.$lte=new Date(to);}
const inspections=await Inspection.find(f).populate('category','name').populate('location','name').populate('inspector','name email');
const iq={};if(from||to){iq.createdAt={};if(from)iq.createdAt.$gte=new Date(from);if(to)iq.createdAt.$lte=new Date(to);}
const issues=await Issue.find(iq).populate('location','name');
const overall=inspections.length?Math.round(inspections.reduce((a,i)=>a+i.score,0)/inspections.length):0;
const byCat={};inspections.forEach(i=>{const n=i.category?.name||'Unknown';byCat[n]=byCat[n]||{count:0,total:0};byCat[n].count++;byCat[n].total+=i.score;});
const byLoc={};inspections.forEach(i=>{const n=i.location?.name||'Unknown';byLoc[n]=byLoc[n]||{count:0,total:0};byLoc[n].count++;byLoc[n].total+=i.score;});
const catRows=Object.entries(byCat).map(([name,v])=>({name,inspections:v.count,score:Math.round(v.total/v.count)}));
const locRows=Object.entries(byLoc).map(([name,v])=>({name,inspections:v.count,score:Math.round(v.total/v.count)}));
res.json({overall,totalInspections:inspections.length,totalIssues:issues.length,openIssues:issues.filter(i=>['Open','In Progress'].includes(i.status)).length,resolvedIssues:issues.filter(i=>['Resolved','Closed'].includes(i.status)).length,categoryRows:catRows,locationRows:locRows,inspections:inspections.slice(0,200).map(i=>({_id:i._id,date:i.date,location:i.location?.name,category:i.category?.name,inspector:i.inspector?.name,score:i.score,rating:i.rating}))});});
