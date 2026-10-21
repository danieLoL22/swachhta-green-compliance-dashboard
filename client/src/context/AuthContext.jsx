import {createContext,useContext,useEffect,useState} from 'react';
import api from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('user')||'null')}catch{return null}});
 const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const t=localStorage.getItem('token');if(t&&!user){try{const{data}=await api.get('/auth/me');setUser(data);localStorage.setItem('user',JSON.stringify(data));}catch{localStorage.removeItem('token');localStorage.removeItem('user');}}setLoading(false);})();},[]);
 const login=async(email,password)=>{const{data}=await api.post('/auth/login',{email,password});localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user));setUser(data.user);return data.user;};
 const logout=()=>{localStorage.removeItem('token');localStorage.removeItem('user');setUser(null);};
 return <C.Provider value={{user,login,logout,loading,setUser}}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);
