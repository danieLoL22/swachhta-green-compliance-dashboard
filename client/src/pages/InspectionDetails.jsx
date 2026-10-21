import {useEffect,useState} from 'react';import {useParams} from 'react-router-dom';import api from '../services/api';import {Loader} from '../components/UI';import {ratingBadge,fmtDate} from '../utils/helpers';
export default function InspectionDetails(){
 const{id}=useParams();const[d,setD]=useState(null);
 useEffect(()=>{(async()=>{const{data}=await api.get('/inspections/'+id);setD(data);})();},[id]);
 if(!d)return <Loader/>;
 return <div className="space-y-4 max-w-3xl"><h1 className="text-xl font-bold">Inspection Details</h1>
  <div className="card text-sm space-y-1"><div><b>Location:</b> {d.location?.name}</div><div><b>Category:</b> {d.category?.name}</div><div><b>Inspector:</b> {d.inspector?.name} ({d.inspector?.email})</div><div><b>Date:</b> {fmtDate(d.date)}</div><div><b>Score:</b> {d.score}% ({d.obtained}/{d.possible}) <span className={`badge ${ratingBadge(d.rating)}`}>{d.rating}</span></div>{d.notes&&<div><b>Notes:</b> {d.notes}</div>}</div>
  {d.results.map((r,i)=><div key={i} className="card text-sm"><div className="font-semibold">{r.standard?.title}</div><div>Status: <b>{r.status}</b></div>{r.remarks&&<div>Remarks: {r.remarks}</div>}{r.evidence&&<a className="text-green-700 underline" href={'http://localhost:5000'+r.evidence} target="_blank" rel="noreferrer">View evidence</a>}</div>)}
 </div>;
}
