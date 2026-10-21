import {useState} from 'react';import Sidebar from '../components/Sidebar';import Navbar from '../components/Navbar';
export default function MainLayout({children}){
 const[open,setOpen]=useState(false);
 return <div className="flex min-h-screen"><Sidebar open={open} onClose={()=>setOpen(false)}/><div className="flex-1 min-w-0"><Navbar onMenu={()=>setOpen(o=>!o)}/><main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main></div></div>;
}
