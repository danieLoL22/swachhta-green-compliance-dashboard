import {useEffect,useState} from 'react';
import api from '../services/api';
import {StatCard,Loader,Empty,Progress} from '../components/UI';
import {ratingBadge,statusBadge,fmtDate} from '../utils/helpers';
import {Leaf,ClipboardCheck,CheckCircle,XCircle,AlertTriangle,CheckCheck} from 'lucide-react';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,LineChart,Line,PieChart,Pie,Cell} from 'recharts';
const COLORS=['#16a34a','#f59e0b','#ef4444'];
export default function Dashboard(){
 const[d,setD]=useState(null);const[err,setErr]=useState('');
 useEffect(()=>{(async()=>{try{const{data}=await api.get('/dashboard/stats');setD(data);}catch(e){setErr('Unable to load dashboard.');}})();},[]);
 if(err)return <div className="card text-red-600">{err}</div>;
 if(!d)return <Loader/>;
 const s=d.summary;
 return <div className="space-y-5">
  <h1 className="text-2xl font-bold text-green-900">Campus Compliance Dashboard</h1>
  <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
   <StatCard icon={Leaf} title="Overall Compliance" value={s.overallCompliance+'%'} color="bg-green-700"/>
   <StatCard icon={ClipboardCheck} title="Total Inspections" value={s.totalInspections} color="bg-emerald-600"/>
   <StatCard icon={CheckCircle} title="Compliant (Good)" value={s.compliantInspections} color="bg-green-500"/>
   <StatCard icon={XCircle} title="Poor" value={s.nonCompliantInspections} color="bg-red-500"/>
   <StatCard icon={AlertTriangle} title="Open Issues" value={s.openIssues} color="bg-amber-500"/>
   <StatCard icon={CheckCheck} title="Resolved Issues" value={s.resolvedIssues} color="bg-teal-600"/>
  </div>
  <div className="grid md:grid-cols-2 gap-4">
   <div className="card"><h3 className="font-bold mb-2">Category Compliance (%)</h3><ResponsiveContainer width="100%" height={250}><BarChart data={d.categoryScores}><XAxis dataKey="name" fontSize={10} interval={0} angle={-15} textAnchor="end" height={70}/><YAxis domain={[0,100]}/><Tooltip/><Bar dataKey="score" fill="#16a34a"/></BarChart></ResponsiveContainer></div>
   <div className="card"><h3 className="font-bold mb-2">Monthly Compliance Trend</h3><ResponsiveContainer width="100%" height={250}><LineChart data={d.trend}><XAxis dataKey="month"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="score" stroke="#15803d" strokeWidth={2}/></LineChart></ResponsiveContainer></div>
   <div className="card"><h3 className="font-bold mb-2">Inspection Status</h3><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={d.statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>{d.statusBreakdown.map((_,i)=><Cell key={i} fill={COLORS[i%3]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
   <div className="card"><h3 className="font-bold mb-2">Location-wise Compliance</h3><ResponsiveContainer width="100%" height={220}><BarChart data={d.locationScores} layout="vertical"><XAxis type="number" domain={[0,100]}/><YAxis type="category" dataKey="name" width={90} fontSize={11}/><Tooltip/><Bar dataKey="score" fill="#0d9488"/></BarChart></ResponsiveContainer></div>
  </div>
  <div className="grid md:grid-cols-2 gap-4">
   <div className="card"><h3 className="font-bold mb-2">Category Scores</h3>{d.categoryScores.map(c=><div key={c.name} className="mb-2"><div className="flex justify-between text-sm"><span>{c.name}</span><b>{c.score}%</b></div><Progress value={c.score}/></div>)}</div>
   <div className="card"><h3 className="font-bold mb-2 text-red-700">⚠ Alerts</h3>
    {!!d.recurring?.length&&<div className="mb-2 text-sm"><b>Recurring Violations:</b>{d.recurring.map((r,i)=><div key={i} className="bg-red-50 border border-red-200 rounded p-2 mt-1">🔁 <b>Recurring Violation</b> — {r.standard} @ {r.location} ({r.count}× failed)</div>)}</div>}
    {d.alerts.critical.map(i=><div key={i._id} className="text-sm bg-red-50 p-2 rounded mb-1">Critical: {i.title}</div>)}
    {d.alerts.overdue.map(i=><div key={i._id} className="text-sm bg-amber-50 p-2 rounded mb-1">Overdue: {i.title} (due {fmtDate(i.dueDate)})</div>)}
    {d.alerts.lowCategories.map(c=><div key={c.name} className="text-sm bg-orange-50 p-2 rounded mb-1">Category below 60%: {c.name} ({c.score}%)</div>)}
    {d.alerts.lowLocations.map(c=><div key={c.name} className="text-sm bg-orange-50 p-2 rounded mb-1">Location below 60%: {c.name} ({c.score}%)</div>)}
    {!d.recurring?.length&&!d.alerts.critical.length&&!d.alerts.overdue.length&&<div className="text-sm text-gray-500">No critical alerts. Campus looks healthy ✅</div>}
   </div>
  </div>
  <div className="grid md:grid-cols-2 gap-4">
   <div className="card"><h3 className="font-bold mb-2">Recent Inspections</h3>{d.recentInspections?.length?d.recentInspections.map(i=><div key={i._id} className="flex justify-between text-sm border-b py-1.5"><span>{i.location?.name} • {i.category?.name}</span><span className={`badge ${ratingBadge(i.rating)}`}>{i.score}%</span></div>):<Empty msg="No inspections yet"/>}</div>
   <div className="card"><h3 className="font-bold mb-2">Recent Issues</h3>{d.recentIssues?.length?d.recentIssues.map(i=><div key={i._id} className="flex justify-between text-sm border-b py-1.5"><span>{i.title}</span><span className={`badge ${statusBadge(i.status)}`}>{i.status}</span></div>):<Empty msg="No issues"/>}</div>
  </div>
 </div>;
}
