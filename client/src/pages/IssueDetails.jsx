import {useEffect,useState} from 'react';import {useParams} from 'react-router-dom';import api from '../services/api';import {Loader} from '../components/UI';import {statusBadge,priBadge,fmtDate} from '../utils/helpers';import {useAuth} from '../context/AuthContext';
export default function IssueDetails(){
 const{id}=useParams();const[d,setD]=useState(null);const[users,setUsers]=useState([]);const[msg,setMsg]=useState('');
 const[f,setF]=useState({status:'',assignedTo:'',priority:'',resolutionRemarks:''});
 const{user}=useAuth();
 useEffect(()=>{(async()=>{const{data}=await api.get('/issues/'+id);setD(data);setF({status:data.status,assignedTo:data.assignedTo?._id||'',priority:data.priority,resolutionRemarks:data.resolutionRemarks||''});if(user?.role==='admin'){const u=await api.get('/users');setUsers(u.data);}})();},[id]);
 const save=async()=>{setMsg('');try{const{data}=await api.put('/issues/'+id,{status:f.status,assignedTo:f.assignedTo||undefined,priority:f.priority,resolutionRemarks:f.resolutionRemarks});setD(data);setMsg('Issue updated successfully.');}catch{setMsg('Failed to update issue.');}};
 if(!d)return <Loader/>;
 return <div className="space-y-4 max-w-3xl"><h1 className="text-xl font-bold">{d.title}</h1>{msg&&<div className="card text-sm">{msg}</div>}
 <div className="card text-sm space-y-1"><div>{d.description}</div><div><b>Location:</b> {d.location?.name} | <b>Category:</b> {d.category?.name||'-'} | <b>Standard:</b> {d.standard?.title||'-'}</div>
 <div><b>Reported by:</b> {d.reportedBy?.name} | <b>Assigned:</b> {d.assignedTo?.name||'Unassigned'}</div>
 <div className="flex gap-2"><span className={`badge ${priBadge(d.priority)}`}>{d.priority}</span><span className={`badge ${statusBadge(d.status)}`}>{d.status}</span></div>
 <div><b>Due:</b> {fmtDate(d.dueDate)} | <b>Resolved:</b> {fmtDate(d.resolvedDate)}</div>{d.resolutionRemarks&&<div><b>Resolution:</b> {d.resolutionRemarks}</div>}</div>
 <div className="card space-y-2"><h3 className="font-bold">Corrective Action / Update</h3>
  <div className="grid md:grid-cols-2 gap-2">
   <div><label className="text-sm">Status</label><select className="input" value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{['Open','In Progress','Resolved','Closed'].map(s=><option key={s}>{s}</option>)}</select></div>
   <div><label className="text-sm">Priority</label><select className="input" value={f.priority} onChange={e=>setF({...f,priority:e.target.value})}>{['Low','Medium','High','Critical'].map(s=><option key={s}>{s}</option>)}</select></div>
  </div>
  {user?.role==='admin'&&<div><label className="text-sm">Assign to</label><select className="input" value={f.assignedTo} onChange={e=>setF({...f,assignedTo:e.target.value})}><option value="">Unassigned</option>{users.map(u=><option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}</select></div>}
  <div><label className="text-sm">Resolution remarks</label><textarea className="input" value={f.resolutionRemarks} onChange={e=>setF({...f,resolutionRemarks:e.target.value})} placeholder="What corrective action was taken?"/></div>
  <button className="btn btn-primary" onClick={save}>Save Changes</button></div></div>;
}
