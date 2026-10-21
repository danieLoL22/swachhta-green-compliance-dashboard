import {NavLink} from 'react-router-dom';
import {LayoutDashboard,ClipboardCheck,AlertTriangle,MapPin,Layers,FileText,BarChart3,Users,User} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
const L=[
 {to:'/',label:'Dashboard',icon:LayoutDashboard,roles:['admin','inspector']},
 {to:'/inspections',label:'Inspections',icon:ClipboardCheck,roles:['admin','inspector']},
 {to:'/inspections/new',label:'New Inspection',icon:ClipboardCheck,roles:['inspector']},
 {to:'/issues',label:'Issues',icon:AlertTriangle,roles:['admin','inspector']},
 {to:'/standards',label:'Standards',icon:Layers,roles:['admin','inspector']},
 {to:'/locations',label:'Locations',icon:MapPin,roles:['admin','inspector']},
 {to:'/reports',label:'Reports',icon:FileText,roles:['admin','inspector']},
 {to:'/users',label:'Users',icon:Users,roles:['admin']},
 {to:'/profile',label:'Profile',icon:User,roles:['admin','inspector']},
];
export default function Sidebar({open,onClose}){
 const{user}=useAuth();
 return <aside className={`fixed md:static z-40 h-full w-64 bg-green-900 text-white p-4 transition-transform ${open?'translate-x-0':'-translate-x-full md:translate-x-0'}`}>
  <div className="font-bold text-lg mb-1">🌿 Swachhta Green</div><div className="text-xs text-green-300 mb-6">Compliance Monitoring</div>
  <nav className="space-y-1">{L.filter(l=>l.roles.includes(user?.role)).map(l=><NavLink key={l.to+l.label} to={l.to} end={l.to==='/'} onClick={onClose} className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive?'bg-green-700':'hover:bg-green-800'}`}><l.icon size={17}/>{l.label}</NavLink>)}</nav>
  <div className="mt-6 text-xs text-green-300">Logged in as<br/><b className="text-white">{user?.name}</b> ({user?.role})</div>
 </aside>;
}
