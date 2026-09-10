const practices = [
  {id:'om', title:'108 mantras OM', short:'108 Mantras OM', img:'assets/practices/om.png', contain:true,
   subtitle:'Sonido · conciencia · presencia', timer:null,
   instructions:['Sentarse con columna erguida','Inspirar por la nariz','Exhalar cantando OM','Repetir 108 veces con ritmo consciente']},
  {id:'saludos', title:'12 Saludos al Sol', short:'12 Saludos al Sol', img:'assets/practices/saludos.jpg', contain:true,
   subtitle:'Energía para tu día', timer:null,
   instructions:['Completar 12 secuencias','Sincronizar respiración y movimiento','Moverse con fluidez, sin rebotes']},
  {id:'bhramari', title:'Bhramari Pranayama', short:'Bhramari Pranayama', img:'assets/practices/bhramari.png', contain:true,
   subtitle:'Respira, escucha, tranquiliza tu mente', timer:{mode:'down', seconds:600},
   instructions:['Sentarse con espalda erguida','Inspirar suavemente por la nariz','Exhalar con zumbido continuo','Percibir la vibración']},
  {id:'kapalabhati', title:'Kapalabhati', short:'Kapalabhati', img:'assets/practices/kapalabhati.jpg', contain:true,
   subtitle:'Respiración purificadora', timer:{mode:'down', seconds:600},
   instructions:['Sentarse erguido','Exhalaciones activas y breves','Inspiración pasiva','Relajar rostro y hombros']},
  {id:'solar', title:'Meditación Solar', short:'Meditación Solar', img:'assets/practices/solar.jpg', contain:true,
   subtitle:'Calma, claridad y energía positiva', timer:{mode:'down', seconds:1200},
   instructions:['Adoptar una postura estable','Colocarse los auriculares','Cerrar los ojos y respirar natural','Volver al audio y a la atención']},
  {id:'moola', title:'Moola Bandha', short:'Moola Bandha', img:'assets/practices/moola.jpg', contain:true,
   subtitle:'Activa tu energía vital desde la raíz', timer:null,
   instructions:['Llevar la atención al suelo pélvico','Contraer de forma suave','Mantener brevemente','Relajar por completo']},
  {id:'vajroli', title:'Vajroli Mudra', short:'Vajroli Mudra', img:'assets/practices/vajroli.jpg', contain:true,
   subtitle:'Conserva tu energía vital', timer:null,
   instructions:['Sentarse con columna erguida','Relajar abdomen y glúteos','Contraer suavemente la musculatura urogenital','Relajar completamente']},
  {id:'ashwini', title:'Ashwini Mudra', short:'Ashwini Mudra', img:'assets/practices/ashwini.jpg', contain:true,
   subtitle:'Activa y tonifica la energía vital', timer:null,
   instructions:['Respirar naturalmente','Contraer suavemente el esfínter anal','Mantener brevemente','Relajar completamente']},
  {id:'agni', title:'Agni Sar Kriya', short:'Agni Sar Kriya', img:'assets/practices/agni.jpg', contain:true,
   subtitle:'Activa la energía digestiva', timer:null,
   instructions:['Preferentemente con el estómago vacío','Exhalar primero','Mover el abdomen hacia dentro y relajarlo','Respirar normal entre repeticiones']},
  {id:'khechari', title:'Khechari Mudra', short:'Khechari Mudra', img:'assets/practices/khechari.png', contain:false,
   subtitle:'Quietud interior y respiración consciente', timer:{mode:'up', seconds:0},
   instructions:['Sentarse cómodamente','Relajar mandíbula y rostro','Llevar la lengua hacia arriba y atrás','Respirar por la nariz sin forzar']}
];

const app = document.getElementById('app');
let route = {view:'home', id:null};
let installPrompt = null;
let timerTick = null;

function todayKey(date=new Date()){
  const y=date.getFullYear(); const m=String(date.getMonth()+1).padStart(2,'0'); const d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function dailyKey(date=new Date()){ return `rpc:daily:${todayKey(date)}`; }
function getDaily(date=new Date()){
  try{return JSON.parse(localStorage.getItem(dailyKey(date)))||{};}catch{return {};}
}
function setDaily(data,date=new Date()){ localStorage.setItem(dailyKey(date),JSON.stringify(data)); }
function isDone(id){return !!getDaily()[id];}
function setDone(id,value){const d=getDaily(); d[id]=!!value; setDaily(d);}
function doneCount(){const d=getDaily(); return practices.filter(p=>d[p.id]).length;}
function pct(){return Math.round(doneCount()/practices.length*100);}

function timerKey(id){return `rpc:timer:${id}`;}
function defaultTimer(p){return {running:false, value:p.timer?.seconds||0, last:null};}
function getTimer(p){
  if(!p.timer) return null;
  let s; try{s=JSON.parse(localStorage.getItem(timerKey(p.id)))||defaultTimer(p);}catch{s=defaultTimer(p);}
  if(s.running && s.last){
    const elapsed=Math.floor((Date.now()-s.last)/1000);
    if(p.timer.mode==='down') s.value=Math.max(0,s.value-elapsed); else s.value=Math.max(0,s.value+elapsed);
    s.last=Date.now();
    if(p.timer.mode==='down' && s.value===0) s.running=false;
    saveTimer(p,s);
  }
  return s;
}
function saveTimer(p,s){localStorage.setItem(timerKey(p.id),JSON.stringify(s));}
function formatTime(sec){sec=Math.max(0,Math.floor(sec)); const m=Math.floor(sec/60); const s=sec%60; return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function resetTimer(p){const s=defaultTimer(p); saveTimer(p,s); render();}
function toggleTimer(p){
  let s=getTimer(p);
  s.running=!s.running; s.last=s.running?Date.now():null; saveTimer(p,s); render();
}
function startTimerLoop(p){
  clearInterval(timerTick);
  if(!p.timer) return;
  timerTick=setInterval(()=>{
    if(route.view!=='practice'||route.id!==p.id){clearInterval(timerTick);return;}
    let s=getTimer(p); const el=document.querySelector('.timer-value'); if(el) el.textContent=formatTime(s.value);
    const b=document.querySelector('[data-timer-toggle]'); if(b) b.innerHTML=s.running?'❚❚&nbsp; Pausar':'▶&nbsp; Iniciar';
  },500);
}

function nav(){
  return `<nav class="bottom-nav" aria-label="Navegación principal">
    <button class="nav-btn ${route.view==='home'?'active':''}" data-nav="home"><span class="nav-icon">⌂</span><span>Inicio</span></button>
    <button class="nav-btn ${route.view==='practice'?'active':''}" data-nav="practice"><span class="nav-icon">♧</span><span>Prácticas</span></button>
    <button class="nav-btn ${route.view==='progress'?'active':''}" data-nav="progress"><span class="nav-icon">▥</span><span>Progreso</span></button>
  </nav>`;
}

function home(){
  const n=doneCount();
  app.innerHTML=`<main class="screen home-screen">
    <header class="home-header"><div class="lotus">♧</div><h1>Rutina de<br>Práctica Consciente</h1><p>Tilda tus prácticas o entra para ver la guía</p><button id="installBtn" class="install-btn ${installPrompt?'show':''}">Instalar</button></header>
    <section class="practice-list" aria-label="Prácticas de hoy">
      ${practices.map((p,i)=>`<article class="practice-item ${isDone(p.id)?'done':''}" data-open="${p.id}">
        <button class="mini-check" data-check="${p.id}" aria-label="${isDone(p.id)?'Desmarcar':'Marcar'} ${p.title}"></button>
        <div class="practice-number">${i+1}</div>
        <div><div class="practice-name">${p.short}</div><div class="practice-meta">${p.timer?formatTime(p.timer.seconds)+(p.timer.mode==='up'?' ascendente':''):''}</div></div>
        <img class="practice-thumb" src="${p.img}" alt="" />
        <div class="chev">›</div>
      </article>`).join('')}
    </section>
    <section class="home-progress"><div class="ring">${pct()}%</div><div><strong>Hoy: ${n}/10 completadas</strong><span>Pequeñas prácticas, grandes cambios</span></div></section>
  </main>${nav()}`;
  bindCommon();
  document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('[data-check]'))return; openPractice(el.dataset.open);}));
  document.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation(); const id=el.dataset.check; setDone(id,!isDone(id)); home();}));
  document.getElementById('installBtn')?.addEventListener('click',async()=>{if(!installPrompt)return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt=null; home();});
}

function practice(p){
  const done=isDone(p.id); const ts=p.timer?getTimer(p):null;
  app.innerHTML=`<main class="screen practice ${p.timer?'has-timer':''}">
    <header class="topbar"><button class="icon-btn" data-back aria-label="Volver">‹</button><h1>${p.title}</h1><button class="icon-btn" data-home aria-label="Inicio">⌂</button></header>
    <section class="hero ${p.contain?'object-contain':''}"><img src="${p.img}" alt="Ilustración de ${p.title}" /><div class="hero-badge"><strong>${p.title}</strong><span>${p.subtitle}</span></div></section>
    ${p.timer?`<section class="timer-card"><div class="timer-face"><div class="timer-value">${formatTime(ts.value)}</div><div class="timer-label">Tiempo de práctica</div></div><div class="timer-actions"><button class="timer-btn primary" data-timer-toggle>${ts.running?'❚❚  Pausar':'▶  Iniciar'}</button><button class="timer-btn secondary" data-timer-reset>↻  Reiniciar</button></div></section>`:''}
    <section class="instructions"><h2>Instrucciones</h2><ol class="instruction-list">${p.instructions.map((x,i)=>`<li><span class="step">${i+1}</span><span>${x}</span></li>`).join('')}</ol></section>
    <label class="complete-row ${done?'checked':''}"><input type="checkbox" ${done?'checked':''} data-complete /><span class="checkbox-ui"></span><span>Marcar como realizada</span></label>
  </main>${nav()}`;
  bindCommon();
  document.querySelector('[data-back]').addEventListener('click',()=>go('home'));
  document.querySelector('[data-home]').addEventListener('click',()=>go('home'));
  document.querySelector('[data-complete]').addEventListener('change',e=>{setDone(p.id,e.target.checked); practice(p);});
  if(p.timer){
    document.querySelector('[data-timer-toggle]').addEventListener('click',()=>toggleTimer(p));
    document.querySelector('[data-timer-reset]').addEventListener('click',()=>resetTimer(p));
    startTimerLoop(p);
  }
}

function progress(){
  clearInterval(timerTick);
  const rows=[];
  for(let i=0;i<14;i++){
    const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-i);
    const data=getDaily(d); const count=practices.filter(p=>data[p.id]).length;
    rows.push({d,count});
  }
  const completedDays=rows.filter(r=>r.count===10).length;
  const total=rows.reduce((a,b)=>a+b.count,0);
  app.innerHTML=`<main class="screen progress-screen"><h1>Progreso</h1><p>Tu práctica se guarda sólo en este dispositivo.</p>
    <section class="progress-summary"><div class="big">${doneCount()}/10</div><strong>Prácticas completadas hoy</strong><div style="margin-top:8px;color:#5d84b3;font-weight:600">Últimos 14 días: ${total} prácticas · ${completedDays} días completos</div></section>
    <section class="history">${rows.map(r=>`<div class="history-row"><strong>${r.d.toLocaleDateString('es-AR',{weekday:'short',day:'2-digit',month:'short'})}</strong><span>${r.count}/10 · ${Math.round(r.count/10*100)}%</span></div>`).join('')}</section>
  </main>${nav()}`; bindCommon();
}

function openPractice(id){route={view:'practice',id}; render();}
function go(view){route={view,id:null}; render();}
function render(){
  if(route.view==='home')home(); else if(route.view==='progress')progress(); else if(route.view==='practice'&&route.id) practice(practices.find(p=>p.id===route.id)); else home();
}
function bindCommon(){
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>{
    const v=b.dataset.nav; if(v==='practice'){openPractice(route.id||practices[0].id);} else go(v);
  }));
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;if(route.view==='home')home();});
window.addEventListener('appinstalled',()=>{installPrompt=null;if(route.view==='home')home();});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
let activeDay=todayKey(); setInterval(()=>{if(todayKey()!==activeDay){activeDay=todayKey(); render();}},60000);
render();
