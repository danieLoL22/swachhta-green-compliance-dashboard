import {useState} from 'react';import api from '../services/api';import {useAuth} from '../context/AuthContext';
export default function Profile(){
 const{user,setUser}=useAuth();const[form,setForm]=useState({name:user?.name||'',phone:user?.phone||'',department:user?.department||''});const[msg,setMsg]=useState('');
 const save=async(e)=>{e.preventDefault();try{const{data}=await api.put('/users/profile',form);setUser(data);localStorage.setItem('user',JSON.stringify(data));setMsg('Profile updated.');}catch{setMsg('Update failed.');}};
 return <div className="max-w-md space-y-4"><h1 className="text-xl font-bold">Profile</h1>{msg&&<div className="card text-sm">{msg}</div>}
 <form onSubmit={save} className="card space-y-2"><div className="text-sm text-gray-500">{user?.email} • {user?.role}</div><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone"/><input className="input" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="Department"/><button className="btn btn-primary">Save</button></form></div>;
}
