const Inspection=require('../models/Inspection');
const Issue=require('../models/Issue');
const Category=require('../models/Category');
const Location=require('../models/Location');
const {asyncHandler}=require('../middleware/errorHandler');
exports.stats=asyncHandler(async(req,res)=>{
const inspections=await Inspection.find().populate('category','name').populate('location','name');
const issues=await Issue.find().populate('category','name').populate('location','name').populate('standard','title');
const total=inspections.length;
const overall=total?Math.round(inspections.reduce((a,i)=>a+(i.score||0),0)/total):0;
const good=inspections.filter(i=>i.rating==='Good').length;
const need=inspections.filter(i=>i.rating==='Needs Improvement').length;
const poor=inspections.filter(i=>i.rating==='Poor').length;
const open=issues.filter(i=>i.status==='Open'||i.status==='In Progress').length;
const resolved=issues.filter(i=>i.status==='Resolved'||i.status==='Closed').length;
// category scores
const cats=await Category.find();const locs=await Location.find();
const catScores=cats.map(c=>{const arr=inspections.filter(i=>String(i.category._id||i.category)===String(c._id));return{name:c.name,score:arr.length?Math.round(arr.reduce((a,i)=>a+i.score,0)/arr.length):0,count:arr.length};});
const locScores=locs.map(l=>{const arr=inspections.filter(i=>String(i.location._id||i.location)===String(l._id));return{name:l.name,score:arr.length?Math.round(arr.reduce((a,i)=>a+i.score,0)/arr.length):0,count:arr.length};});
// monthly trend last 6 months
const trend=[];const now=new Date();
for(let k=5;k>=0;k--){const d=new Date(now.getFullYear(),now.getMonth()-k,1);const key=d.toLocaleString('en',{month:'short'});const arr=inspections.filter(i=>{const dt=new Date(i.date);return dt.getFullYear()===d.getFullYear()&&dt.getMonth()===d.getMonth();});trend.push({month:key,score:arr.length?Math.round(arr.reduce((a,i)=>a+i.score,0)/arr.length):0,inspections:arr.length});}
// recurring violations: same location+standard non_compliant >=3 OR >=2 in last data
const key={};inspections.forEach(()=>{});
const allIssues=await Issue.find().populate('location','name').populate('standard','title');
const {default:noop}= {};
// compute from inspection results
const inspFull=await Inspection.find().populate('location','name').populate('results.standard','title');
const combo={};
inspFull.forEach(ins=>{(ins.results||[]).forEach(r=>{if(r.status==='non_compliant'){const sid=String(r.standard?._id||r.standard);const lid=String(ins.location?._id||ins.location);const k=lid+'|'+sid;if(!combo[k])combo[k]={count:0,location:ins.location?.name||'Unknown',standard:r.standard?.title||'Unknown',locationId:ins.location?._id||ins.location,standardId:r.standard?._id||r.standard};combo[k].count++;}});});
const recurring=Object.values(combo).filter(x=>x.count>=2).sort((a,b)=>b.count-a.count).slice(0,10);
// alerts
const critical=await Issue.find({priority:'Critical',status:{$in:['Open','In Progress']}}).populate('location','name').limit(10);
const overdue=await Issue.find({dueDate:{$lt:new Date()},status:{$in:['Open','In Progress']}}).populate('location','name').limit(10);
const lowCats=catScores.filter(c=>c.count>0&&c.score<60);
const lowLocs=locScores.filter(l=>l.count>0&&l.score<60);
const recentInspections=await Inspection.find().populate('location','name').populate('category','name').populate('inspector','name').sort({createdAt:-1}).limit(5);
const recentIssues=await Issue.find().populate('location','name').sort({createdAt:-1}).limit(5);
res.json({summary:{overallCompliance:overall,totalInspections:total,compliantInspections:good,nonCompliantInspections:poor,needsImprovement:need,openIssues:open,resolvedIssues:resolved,totalIssues:issues.length},categoryScores:catScores,locationScores:locScores,trend,statusBreakdown:[{name:'Good',value:good},{name:'Needs Improvement',value:need},{name:'Poor',value:poor}],recentInspections,recentIssues,recurring,alerts:{critical,overdue,lowCategories:lowCats,lowLocations:lowLocs}});});
