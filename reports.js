/* Device-local daily reports. No tokens, phone numbers or remote activity uploads. */
(function(root){
 'use strict';
 function indiaClock(instant){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(instant);
  const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return {date:`${p.year}-${p.month}-${p.day}`,minute:Number(p.hour)*60+Number(p.minute)};
 }
 function shiftDate(date,days){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
 function availableDate(instant){const c=indiaClock(instant);return shiftDate(c.date,c.minute<5?-2:-1);}
 function validDate(date){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&!isNaN(Date.parse(date+'T12:00:00Z'))&&new Date(date+'T12:00:00Z').toISOString().slice(0,10)===date;}
 function build(records,weekly,date){
  if(!validDate(date))throw Error('Choose a valid report date.');
  const index=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7;
  const e=records[date]||{},p=Array.isArray(e.schedule)?e.schedule:weekly[index];
  const num=v=>Number.isFinite(Number(v))&&Number(v)>=0?Number(v):0;
  const mins=t=>Number(t.slice(0,2))*60+Number(t.slice(3));
  const duration=s=>(mins(s[2])-mins(s[1]))/60;
  const id=s=>s[3]+'|'+s[0]+'|'+s[1]+'|'+s[2];
  const done=p.filter(s=>e.completed?.[id(s)]);
  const actual=k=>Object.prototype.hasOwnProperty.call(e.activity||{},k)?num(e.activity[k]):done.filter(s=>s[3]===k).reduce((n,s)=>n+duration(s),0);
  const fmt=t=>{const [h,m]=t.split(':').map(Number);return `${h%12||12}${m?':'+String(m).padStart(2,'0'):''} ${h>=12?'PM':'AM'}`;};
  const study=actual('study'),workout=actual('workout'),sketch=actual('sketch');
  const lines=['WEEKFLOW DAILY REPORT',date+' · '+['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][index]+' · IST','',...(records[date]?[]:['No saved activity was found on this browser for this date.','']),`Income: ₹${num(e.income)}`,`Delivery: ${num(e.hours)} hours`,`Study: ${study} hours`,`Workout: ${workout} hours (daily goal: 1.5h)`,`Sketching: ${sketch} hours`,`Completed sessions: ${done.length}/${p.length}`,'','COMPLETED TASKS',...(done.length?done.map(s=>`${s[0]} | ${fmt(s[1])}–${fmt(s[2])} | planned ${duration(s)}h\n${s[4]}`):['None marked complete.']),'','NOT MARKED COMPLETE',...p.filter(s=>!e.completed?.[id(s)]).map(s=>`${s[0]} | ${fmt(s[1])}–${fmt(s[2])}`),'','YOUR NOTES',e.notes||'No notes saved.','','Actual logged hours override checklist estimates.','12–2 AM study belongs to the calendar date shown.','This report uses saved entries on this browser only.'];
  return {date,study,workout,sketch,completed:done.length,text:lines.join('\n')};
 }
 const api={indiaClock,availableDate,validDate,build};
 if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 root.WeekflowReports=api;
 const get=id=>document.getElementById(id),dialog=get('dailyReportDialog');
 let activeReport;
 function refresh(){const latest=availableDate(new Date());get('reportDate').max=latest;get('reportAvailable').textContent='Latest report: '+latest+' · available after 12:05 AM IST';return latest;}
 function draw(date){try{activeReport=build(data,plans,date);get('reportOutput').textContent=activeReport.text;get('reportError').textContent='';}catch(e){activeReport=null;get('reportOutput').textContent='';get('reportError').textContent=e.message;}}
 function open(){get('reportDate').value=refresh();draw(get('reportDate').value);if(!dialog.open)dialog.showModal();}
 get('openDailyReport').onclick=open;
 get('closeDailyReport').onclick=()=>dialog.close();
 get('reportDate').onchange=()=>{const v=get('reportDate').value;if(!validDate(v)||v>refresh()){activeReport=null;get('reportOutput').textContent='';get('reportError').textContent='Choose a date up to the latest available report.';return;}draw(v);};
 get('saveViewedReport').onclick=()=>{if(activeReport)downloadText('Weekflow_Report_'+activeReport.date+'.txt',activeReport.text,'text/plain;charset=utf-8');};
 get('shareViewedReport').onclick=async()=>{if(!activeReport)return;try{if(navigator.share){await navigator.share({title:'Weekflow daily report',text:activeReport.text});}else{await navigator.clipboard.writeText(activeReport.text);get('reportError').textContent='Report copied. Paste it in your preferred app.';}}catch(e){if(e.name!=='AbortError')get('reportError').textContent='Sharing unavailable. Use Download report instead.';}};
 dialog.addEventListener('close',()=>{if(location.hash==='#report')history.replaceState(null,'',location.pathname+location.search);});
 window.addEventListener('hashchange',()=>{if(location.hash==='#report')open();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 refresh();setInterval(refresh,60000);if(location.hash==='#report')open();
})(typeof window==='undefined'?{}:window);
