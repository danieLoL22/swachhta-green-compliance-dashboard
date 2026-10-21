import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Menu,LogOut} from 'lucide-react';
export default function Navbar({onMenu}){
 const{user,logout}=useAuth();const nav=useNavigate();
 return <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
  <button className="md:hidden" onClick={onMenu}><Menu/></button>
  <div className="font-semibold text-green-900">Environmental & Cleanliness Performance</div>
  <div className="flex items-center gap-3"><span className="text-sm hidden sm:block">{user?.email}</span><button className="btn bg-gray-100 flex items-center gap-1" onClick={()=>{logout();nav('/login');}}><LogOut size={15}/> Logout</button></div>
 </header>;
}
