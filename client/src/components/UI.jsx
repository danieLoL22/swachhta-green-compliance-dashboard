export function StatCard({icon:Icon,title,value,sub,color='bg-green-700'}){
 return <div className="card flex items-center gap-3"><div className={`${color} text-white p-3 rounded-xl`}><Icon size={22}/></div><div><div className="text-xs text-gray-500">{title}</div><div className="text-2xl font-bold">{value}</div>{sub&&<div className="text-xs text-gray-500">{sub}</div>}</div></div>;
}
export function Loader(){return <div className="p-10 text-center text-gray-500">Loading...</div>;}
export function Empty({msg}){return <div className="p-10 text-center text-gray-400 border border-dashed rounded-xl bg-white">{msg||'No data found'}</div>;}
export function Progress({value}){const c=value>=80?'bg-green-600':value>=60?'bg-amber-500':'bg-red-500';return <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${c}`} style={{width:value+'%'}}/></div>;}
export function Modal({open,onClose,title,children}){if(!open)return null;return <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}><div className="bg-white rounded-xl p-5 w-full max-w-lg" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center mb-3"><h3 className="font-bold">{title}</h3><button onClick={onClose} className="text-gray-500">✕</button></div>{children}</div></div>;}
