import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';import {useAuth} from '../context/AuthContext';
export default function Login(){
 const[email,setEmail]=useState('admin@swachhta.com');const[password,setPassword]=useState('Admin@123');const[err,setErr]=useState('');const[busy,setBusy]=useState(false);
 const{login}=useAuth();const nav=useNavigate();
 const submit=async(e)=>{e.preventDefault();setErr('');setBusy(true);try{await login(email,password);nav('/');}catch(ex){setErr(ex.response?.data?.message||'Invalid login credentials.');}finally{setBusy(false);}};
 return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-600 p-4">
  <form onSubmit={submit} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
   <div className="text-3xl mb-1">🌿</div><h1 className="text-xl font-bold text-green-900">Swachhta & Green Compliance</h1><p className="text-sm text-gray-500 mb-5">College campus monitoring dashboard</p>
   {err&&<div className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">{err}</div>}
   <label className="text-sm">Email</label><input className="input mb-3" value={email} onChange={e=>setEmail(e.target.value)}/>
   <label className="text-sm">Password</label><input className="input mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
   <button className="btn btn-primary w-full" disabled={busy}>{busy?'Signing in...':'Login'}</button>
   <div className="text-xs text-gray-500 mt-4">Demo: admin@swachhta.com / Admin@123<br/>inspector@swachhta.com / Inspector@123</div>
  </form></div>;
}
