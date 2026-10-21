import {useEffect,useState} from 'react';import api from '../services/api';import {toCSV,download} from '../utils/helpers';
export default function Reports(){
 const[f,setF]=useState({from:'',to:'',category:'',location:'',status:''});const[d,setD]=useState(null);
 const[locs,setLocs]=useState([]);const[cats,setCats]=useState([]);
 useEffect(()=>{(async()=>{const[l,c]=await Promise.all([api.get('/locations'),api.get('/categories')]);setLocs(l.data);setCats(c.data);})();},[]);
 const run=async()=>{const{data}=await api.get('/reports/summary',{params:Object.fromEntries(Object.entries(f).filter(([k,v])=>v))});setD(data);};
 useEffect(()=>{run();},[]);
 const csv=()=>{if(!d)return;download('inspection-report.csv',toCSV(d.inspections,['_id','date','location','category','inspector','score','rating']));};
 return <div className="space-y-4"><div className="flex justify-between items-center"><h1 className="text-xl font-bold">Reports & Analytics</h1><div className="flex gap-2"><button className="btn bg-gray-100" onClick={run}>Run</button><button className="btn btn-primary" onClick={csv}>Export CSV</button><button className="btn bg-gray-100" onClick={()=>window.print()}>PDF / Print</button></div></div>
 <div className="card grid md:grid-cols-5 gap-2">
  <input type="date" className="input" value={f.from} onChange={e=>setF({...f,from:e.target.value})}/>
  <input type="date" className="input" value={f.to} onChange={e=>setF({...f,to:e.target.value})}/>
  <select className="input" value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option value="">All categories</option>{cats.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select>
  <select className="input" value={f.location} onChange={e=>setF({...f,location:e.target.value})}><option value="">All locations</option>{locs.map(l=><option key={l._id} value={l._id}>{l.name}</option>)}</select>
  <select className="input" value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="">All ratings</option><option>Good</option><option>Needs Improvement</option><option>Poor</option></select>
 </div>
 {!d?<div className="card">Run a report to see results.</div>:<div className="space-y-4">
  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{[['Overall',d.overall+'%'],['Inspections',d.totalInspections],['Issues',d.totalIssues],['Open',d.openIssues],['Resolved',d.resolvedIssues]].map(([k,v])=><div key={k} className="card text-center"><div className="text-xs text-gray-500">{k}</div><div className="text-2xl font-bold">{v}</div></div>)}</div>
  <div className="grid md:grid-cols-2 gap-4">
   <div className="card"><h3 className="font-bold mb-2">Category Performance</h3><table className="w-full text-sm"><tbody>{d.categoryRows.map(r=><tr key={r.name} className="border-t"><td className="p-1">{r.name}</td><td className="p-1">{r.inspections}</td><td className="p-1 font-bold">{r.score}%</td></tr>)}</tbody></table></div>
   <div className="card"><h3 className="font-bold mb-2">Location Performance</h3><table className="w-full text-sm"><tbody>{d.locationRows.map(r=><tr key={r.name} className="border-t"><td className="p-1">{r.name}</td><td className="p-1">{r.inspections}</td><td className="p-1 font-bold">{r.score}%</td></tr>)}</tbody></table></div>
  </div>
  <div className="card overflow-x-auto"><h3 className="font-bold mb-2">Inspections ({d.inspections.length})</h3><table className="w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="p-1">Date</th><th className="p-1">Location</th><th className="p-1">Category</th><th className="p-1">Score</th><th className="p-1">Rating</th></tr></thead><tbody>{d.inspections.map(i=><tr key={i._id} className="border-t"><td className="p-1">{new Date(i.date).toLocaleDateString()}</td><td className="p-1">{i.location}</td><td className="p-1">{i.category}</td><td className="p-1">{i.score}%</td><td className="p-1">{i.rating}</td></tr>)}</tbody></table></div>
 </div>}</div>;
}
