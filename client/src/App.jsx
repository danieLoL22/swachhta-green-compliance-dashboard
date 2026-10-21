import {Routes,Route,Navigate} from 'react-router-dom';
import {useAuth} from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';import NewInspection from './pages/NewInspection';import InspectionDetails from './pages/InspectionDetails';
import Issues from './pages/Issues';import IssueDetails from './pages/IssueDetails';
import Standards from './pages/Standards';import Locations from './pages/Locations';
import Reports from './pages/Reports';import Users from './pages/Users';import Profile from './pages/Profile';
function Guard({children,roles}){
 const{user,loading}=useAuth();
 if(loading)return <div className="p-10">Loading...</div>;
 if(!user)return <Navigate to="/login"/>;
 if(roles&&!roles.includes(user.role))return <Navigate to="/"/>;
 return <MainLayout>{children}</MainLayout>;
}
export default function App(){
 return <Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/" element={<Guard><Dashboard/></Guard>}/>
  <Route path="/inspections" element={<Guard><Inspections/></Guard>}/>
  <Route path="/inspections/new" element={<Guard roles={['inspector','admin']}><NewInspection/></Guard>}/>
  <Route path="/inspections/:id" element={<Guard><InspectionDetails/></Guard>}/>
  <Route path="/issues" element={<Guard><Issues/></Guard>}/>
  <Route path="/issues/:id" element={<Guard><IssueDetails/></Guard>}/>
  <Route path="/standards" element={<Guard><Standards/></Guard>}/>
  <Route path="/locations" element={<Guard><Locations/></Guard>}/>
  <Route path="/reports" element={<Guard><Reports/></Guard>}/>
  <Route path="/users" element={<Guard roles={['admin']}><Users/></Guard>}/>
  <Route path="/profile" element={<Guard><Profile/></Guard>}/>
 </Routes>;
}
