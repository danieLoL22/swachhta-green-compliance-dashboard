import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import api from '../services/api';import {Empty} from '../components/UI';import {statusBadge,priBadge,fmtDate} from '../utils/helpers';
export default function Issues(){
 const[list,setList]=useState([]);const[st,setSt]=useState('');const[pr,setPr]=useState('');const[q,setQ]=useState('');const[err,setErr]=useState('');
 const load=async()=>{try{const{data}=await api.get('/issues',{params:{status:st||undefined,priority:pr||undefined,search:q||undefined}});setList(data);}catch{setErr('Failed to load issues.');}};
 useEffect(()=>{load();},[]);
 return <div className="space-y-4"><div className="flex justify-between items-center"><h1 className="text-xl font-bold">Non-Compliance Issues</h1><button className="btn btn-primary" onClick={load}>Refresh</button></div>
 {err&&<div className="card text-red-600">{err}</div>}
 <div className="card flex flex-wrap gap-2"><input className="input max-w-xs" placeholder="Search issues..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/>
 <select className="input max-w-[180px]" value={st} onChange={e=>setSt(e.target.value)}><option value="">All status</option>{['Open','In Progress','Resolved','Closed'].map(s=><option key={s}>{s}</option>)}</select>
 <select className="input max-w-[180px]" value={pr} onChange={e=>setPr(e.target.value)}><option value="">All priorities</option>{['Low','Medium','High','Critical'].map(s=><option key={s}>{s}</option>)}</select>
 <button className="btn bg-gray-100" onClick={load}>Apply</button></div>
 {!list.length?<Empty msg="No issues found"/>:<div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="p-2">Title</th><th className="p-2">Location</th><th className="p-2">Priority</th><th className="p-2">Status</th><th className="p-2">Due</th></tr></thead><tbody>
 {list.map(i=><tr key={i._id} className="border-t"><td className="p-2"><Link className="text-green-800 font-medium" to={'/issues/'+i._id}>{i.title}</Link><div className="text-xs text-gray-500">Reported {fmtDate(i.createdAt)}</div></td><td className="p-2">{i.location?.name}</td><td className="p-2"><span className={`badge ${priBadge(i.priority)}`}>{i.priority}</span></td><td className="p-2"><span className={`badge ${statusBadge(i.status)}`}>{i.status}</span></td><td className="p-2">{fmtDate(i.dueDate)}</td></tr>)}
 </tbody></table></div>}</div>;
}
