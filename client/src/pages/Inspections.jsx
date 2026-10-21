import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import api from '../services/api';import {Loader,Empty} from '../components/UI';import {ratingBadge,fmtDate} from '../utils/helpers';
export default function Inspections(){
 const[list,setList]=useState([]);const[locs,setLocs]=useState([]);const[cats,setCats]=useState([]);
 const[fLoc,setFLoc]=useState('');const[fCat,setFCat]=useState('');const[q,setQ]=useState('');const[err,setErr]=useState('');
 const load=async()=>{try{const{data}=await api.get('/inspections',{params:{location:fLoc||undefined,category:fCat||undefined}});setList(data);}catch{setErr('Unable to load inspections.');}};
 useEffect(()=>{(async()=>{const[l,c]=await Promise.all([api.get('/locations'),api.get('/categories')]);setLocs(l.data);setCats(c.data);})();load();},[]);
 useEffect(()=>{load();},[fLoc,fCat]);
 const filtered=list.filter(i=>!q||(i.location?.name+i.category?.name).toLowerCase().includes(q.toLowerCase()));
 return <div className="space-y-4"><div className="flex flex-wrap gap-2 items-center justify-between"><h1 className="text-xl font-bold">Inspections</h1><Link to="/inspections/new" className="btn btn-primary">+ New Inspection</Link></div>
  {err&&<div className="card text-red-600">{err}</div>}
  <div className="card flex flex-wrap gap-2"><input className="input max-w-xs" placeholder="Search location / category..." value={q} onChange={e=>setQ(e.target.value)}/>
   <select className="input max-w-xs" value={fLoc} onChange={e=>setFLoc(e.target.value)}><option value="">All locations</option>{locs.map(l=><option key={l._id} value={l._id}>{l.name}</option>)}</select>
   <select className="input max-w-xs" value={fCat} onChange={e=>setFCat(e.target.value)}><option value="">All categories</option>{cats.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
  {!filtered.length?<Empty msg="No inspections found"/>:<div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="p-2">Date</th><th className="p-2">Location</th><th className="p-2">Category</th><th className="p-2">Inspector</th><th className="p-2">Score</th><th className="p-2">Rating</th></tr></thead><tbody>
   {filtered.map(i=><tr key={i._id} className="border-t hover:bg-gray-50"><td className="p-2">{fmtDate(i.date)}</td><td className="p-2">{i.location?.name}</td><td className="p-2">{i.category?.name}</td><td className="p-2">{i.inspector?.name}</td><td className="p-2 font-bold">{i.score}%</td><td className="p-2"><Link to={'/inspections/'+i._id} className={`badge ${ratingBadge(i.rating)}`}>{i.rating}</Link></td></tr>)}
  </tbody></table></div>}
 </div>;
}
