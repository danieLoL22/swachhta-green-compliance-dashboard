export const pctColor=(s)=>s>=80?'bg-green-600':s>=60?'bg-amber-500':'bg-red-500';
export const ratingBadge=(r)=>r==='Good'?'bg-green-100 text-green-800':r==='Needs Improvement'?'bg-amber-100 text-amber-800':'bg-red-100 text-red-800';
export const statusBadge=(s)=>({Open:'bg-red-100 text-red-800','In Progress':'bg-blue-100 text-blue-800',Resolved:'bg-green-100 text-green-800',Closed:'bg-gray-200 text-gray-700'}[s]||'bg-gray-100');
export const priBadge=(p)=>({Low:'bg-gray-200 text-gray-700',Medium:'bg-yellow-100 text-yellow-800',High:'bg-orange-100 text-orange-800',Critical:'bg-red-100 text-red-800'}[p]||'bg-gray-100');
export const fmtDate=(d)=>d?new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'-';
export const toCSV=(rows,cols)=>{const h=cols.join(',');const b=rows.map(r=>cols.map(c=>JSON.stringify(r[c]??'')).join(',')).join('\n');return h+'\n'+b;};
export const download=(name,text,type='text/csv')=>{const b=new Blob([text],{type});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);};
