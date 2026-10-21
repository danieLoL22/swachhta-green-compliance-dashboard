import {useEffect,useState} from 'react';import {useNavigate} from 'react-router-dom';import api from '../services/api';
export default function NewInspection(){
 const[locs,setLocs]=useState([]);const[cats,setCats]=useState([]);const[stds,setStds]=useState([]);
 const[loc,setLoc]=useState('');const[cat,setCat]=useState('');const[notes,setNotes]=useState('');
 const[vals,setVals]=useState({});const[msg,setMsg]=useState('');const[busy,setBusy]=useState(false);
 const nav=useNavigate();
 useEffect(()=>{(async()=>{const[l,c]=await Promise.all([api.get('/locations'),api.get('/categories')]);setLocs(l.data);setCats(c.data);if(l.data[0])setLoc(l.data[0]._id);if(c.data[0])setCat(c.data[0]._id);})();},[]);
 useEffect(()=>{(async()=>{if(!cat)return;const{data}=await api.get('/standards',{params:{category:cat}});setStds(data);const v={};data.forEach(s=>v[s._id]={status:'compliant',remarks:'',evidence:''});setVals(v);})();},[cat]);
 const upload=async(f)=>{const fd=new FormData();fd.append('file',f);const{data}=await api.post('/inspections/upload',fd,{headers:{'Content-Type':'multipart/form-data'}});return data.url;};
 const submit=async(e)=>{e.preventDefault();setMsg('');if(!stds.length){setMsg('No standards for this category.');return;}setBusy(true);
  try{const results=stds.map(s=>({standard:s._id,...vals[s._id]}));const{data}=await api.post('/inspections',{location:loc,category:cat,notes,results});setMsg('Inspection submitted successfully. Score: '+data.score+'%');setTimeout(()=>nav('/inspections/'+data._id),800);}
  catch(ex){setMsg(ex.response?.data?.message||'Failed to submit inspection.');}finally{setBusy(false);}};
 return <div className="space-y-4 max-w-3xl"><h1 className="text-xl font-bold">New Inspection</h1>{msg&&<div className="card text-sm">{msg}</div>}
  <form onSubmit={submit} className="space-y-4">
   <div className="card grid md:grid-cols-2 gap-3">
    <div><label className="text-sm">Location</label><select className="input" value={loc} onChange={e=>setLoc(e.target.value)}>{locs.map(l=><option key={l._id} value={l._id}>{l.name}</option>)}</select></div>
    <div><label className="text-sm">Category</label><select className="input" value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
    <div className="md:col-span-2"><label className="text-sm">General notes</label><textarea className="input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Overall observations..."/></div>
   </div>
   {stds.map(s=><div key={s._id} className="card"><div className="font-semibold text-sm mb-2">{s.title}</div>
    <div className="flex flex-wrap gap-2 mb-2">{['compliant','partial','non_compliant'].map(st=><label key={st} className={`badge cursor-pointer ${vals[s._id]?.status===st?'bg-green-700 text-white':'bg-gray-100'}`}><input type="radio" className="hidden" checked={vals[s._id]?.status===st} onChange={()=>setVals(v=>({...v,[s._id]:{...v[s._id],status:st}}))}/>{st==='compliant'?'Compliant':st==='partial'?'Partially Compliant':'Non-Compliant'}</label>)}</div>
    <input className="input mb-2" placeholder="Remarks..." value={vals[s._id]?.remarks||''} onChange={e=>setVals(v=>({...v,[s._id]:{...v[s._id],remarks:e.target.value}}))}/>
    <input type="file" accept="image/*,.pdf" onChange={async e=>{if(e.target.files[0]){try{const url=await upload(e.target.files[0]);setVals(v=>({...v,[s._id]:{...v[s._id],evidence:url}}));}catch{alert('Upload failed');}}}}/>
    {vals[s._id]?.evidence&&<div className="text-xs text-green-700 mt-1">Evidence attached ✓</div>}
   </div>)}
   <button className="btn btn-primary" disabled={busy}>{busy?'Submitting...':'Submit Inspection'}</button>
  </form></div>;
}
