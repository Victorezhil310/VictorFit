/* ============================================
   VictorFit v4.0 — Logic (Bento Style)
   ============================================ */

const KEY = 'vfit4';
const D = JSON.parse(localStorage.getItem(KEY)) || {
  water: 0, foods: [], calGoal: 2200, logs: [], weights: [],
  streak: 1, totalW: 0, totalC: 0, totalM: 0, bestStreak: 1,
  wCals: [320,480,0,560,410,0,0], wMins: [45,60,0,55,40,0,0],
  lastDate: new Date().toDateString()
};
const save = () => localStorage.setItem(KEY, JSON.stringify(D));

const EX = [
  { id:1, name:'Bench Press', cat:'chest', emoji:'🏋️', diff:'intermediate', sets:4, reps:10, cals:180, desc:'Classic barbell press for chest.' },
  { id:2, name:'Push-Ups', cat:'chest', emoji:'💪', diff:'beginner', sets:3, reps:15, cals:100, desc:'Bodyweight fundamental.' },
  { id:3, name:'Deadlift', cat:'back', emoji:'🔥', diff:'advanced', sets:4, reps:6, cals:250, desc:'The ultimate full-body lift.' },
  { id:4, name:'Pull-Ups', cat:'back', emoji:'💪', diff:'intermediate', sets:4, reps:8, cals:160, desc:'Build a wide back.' },
  { id:5, name:'Squat', cat:'legs', emoji:'🦵', diff:'intermediate', sets:4, reps:10, cals:220, desc:'King of leg exercises.' },
  { id:6, name:'Bicep Curl', cat:'arms', emoji:'💪', diff:'beginner', sets:3, reps:12, cals:90, desc:'Isolate the biceps.' },
  { id:7, name:'Overhead Press', cat:'shoulders', emoji:'⬆️', diff:'intermediate', sets:4, reps:8, cals:160, desc:'Build boulder shoulders.' },
  { id:8, name:'Plank', cat:'core', emoji:'🧘', diff:'beginner', sets:3, reps:60, cals:60, desc:'Core stability hold.' },
  { id:9, name:'Jump Rope', cat:'cardio', emoji:'🪢', diff:'beginner', sets:5, reps:60, cals:200, desc:'Intense cardio.' }
];

let curEx = null;

// Routing
function nav(id) {
  document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(a => a.classList.toggle('active', a.dataset.section === id));
  window.scrollTo({top:0});
  initDash();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initDash(); renderEx('all'); checkStreak(); updateStats();
});

function initDash() {
  const dStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  if(document.getElementById('dashDate')) document.getElementById('dashDate').innerText = dStr;
  
  const eaten = D.foods.reduce((a,b)=>a+b.cal, 0);
  if(document.getElementById('dCal')) document.getElementById('dCal').innerText = eaten;
  if(document.getElementById('dWork')) document.getElementById('dWork').innerText = D.totalW;
  if(document.getElementById('dWat')) document.getElementById('dWat').innerText = D.water;
  if(document.getElementById('dStr')) document.getElementById('dStr').innerText = D.streak;
  
  const wDone = D.logs.filter(l => l.date === new Date().toDateString()).length;
  const tot = Math.min(wDone + D.water, 12);
  const pct = Math.round((tot/12)*100);
  if(document.getElementById('ringPct')) {
    document.getElementById('ringPct').innerText = pct + '%';
    const circ = 377;
    document.getElementById('ringFill').style.strokeDashoffset = circ - (pct/100)*circ;
  }

  // Today
  const lst = document.getElementById('dashToday');
  if(lst) {
    const todays = EX.slice(0, 4);
    lst.innerHTML = todays.map(e => {
      const done = D.logs.some(l => l.id === e.id && l.date === new Date().toDateString());
      return `<div class="today-item" onclick="openEx(${e.id})"><div class="ti-icon">${e.emoji}</div><div class="ti-info"><h5>${e.name}</h5><p>${e.sets}x${e.reps}</p></div><div class="ti-badge ${done?'done':''}"></div></div>`;
    }).join('');
  }
}

// Workouts
function renderEx(cat) {
  const grid = document.getElementById('wGrid');
  if(!grid) return;
  const list = cat === 'all' ? EX : EX.filter(e => e.cat === cat);
  grid.innerHTML = list.map(e => `
    <div class="w-card" onclick="openEx(${e.id})">
      <div class="w-head"><span class="w-emoji">${e.emoji}</span><span class="w-diff diff-${e.diff}">${e.diff}</span></div>
      <h3>${e.name}</h3><p>${e.desc}</p>
      <div class="w-stats"><span>📋 ${e.sets}x${e.reps}</span><span>🔥 ${e.cals} cal</span></div>
    </div>
  `).join('');
}

function filterEx(cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderEx(cat);
}

function openEx(id) {
  curEx = EX.find(e => e.id === id);
  if(!curEx) return;
  document.getElementById('emIco').innerText = curEx.emoji;
  document.getElementById('emName').innerText = curEx.name;
  document.getElementById('emDesc').innerText = curEx.desc;
  document.getElementById('emSet').innerText = curEx.sets;
  document.getElementById('emRep').innerText = curEx.reps;
  document.getElementById('emCal').innerText = curEx.cals;
  document.getElementById('exModal').classList.add('open');
}

function logEx() {
  if(!curEx) return;
  if(D.logs.some(l => l.id === curEx.id && l.date === new Date().toDateString())) {
    msg('Already logged today!'); return;
  }
  D.logs.push({id: curEx.id, date: new Date().toDateString()});
  D.totalW++; D.totalC += curEx.cals; D.totalM += 15;
  save(); msg(`Logged ${curEx.name}! +${curEx.cals}cals`);
  cls('exModal'); initDash(); updateStats();
}

function cls(id) { document.getElementById(id).classList.remove('open'); }

// Profile & Stats
function updateStats() {
  if(document.getElementById('pW')) document.getElementById('pW').innerText = D.totalW;
  if(document.getElementById('pC')) document.getElementById('pC').innerText = D.totalC;
  if(document.getElementById('pS')) document.getElementById('pS').innerText = D.bestStreak;
  if(document.getElementById('pM')) document.getElementById('pM').innerText = D.totalM;
  
  if(document.getElementById('cBars')) {
    const m = Math.max(...D.wCals, 100);
    document.getElementById('cBars').innerHTML = D.wCals.map(v => `<div class="bar-col"><div class="bar bc-cal" style="height:${Math.max(v/m*100,5)}%"></div><div class="bar-lbl">D</div></div>`).join('');
    const m2 = Math.max(...D.wMins, 10);
    document.getElementById('mBars').innerHTML = D.wMins.map(v => `<div class="bar-col"><div class="bar bc-work" style="height:${Math.max(v/m2*100,5)}%"></div><div class="bar-lbl">D</div></div>`).join('');
  }
}

function checkStreak() {
  const t = new Date().toDateString();
  if (D.lastDate !== t) {
    const d = Math.floor((new Date(t) - new Date(D.lastDate))/864e5);
    D.streak = d === 1 ? D.streak+1 : d>1 ? 1 : D.streak;
    D.lastDate = t;
    if(D.streak > D.bestStreak) D.bestStreak = D.streak;
    save();
  }
}

// UPI
let uAmt = '', uPlan = '';
const UPI = 'arasu9629hf@okhdfcbank';
function openUpi(amt, plan) {
  uAmt = amt; uPlan = plan;
  document.getElementById('upiDesc').innerText = `Pay ${amt} for ${plan}`;
  if(amt === 'Custom') {
    document.getElementById('upiDesc').innerText = 'Enter donation amount';
    document.getElementById('cstAmt').style.display = 'block';
  } else {
    document.getElementById('cstAmt').style.display = 'none';
  }
  document.getElementById('upiModal').classList.add('open');
}
function copyUpi() { navigator.clipboard.writeText(UPI); msg('UPI ID Copied!'); }
function doPay() {
  let a = uAmt;
  if(a === 'Custom') a = document.getElementById('upiInp').value;
  if(!a || isNaN(a.replace('₹',''))) return msg('Invalid amount');
  a = a.replace('₹','');
  window.location.href = `upi://pay?pa=${UPI}&pn=VictorFit&am=${a}&cu=INR`;
  msg(`Opening UPI for ₹${a}...`);
}

// Tools
function addWat() { if(D.water>=8)return msg('Goal reached!'); D.water++; save(); initDash(); document.getElementById('wBig').innerText = `${D.water}/8`; }
function addFood() {
  const c = parseInt(document.getElementById('fCal').value);
  if(c>0) { D.foods.push({cal:c}); save(); initDash(); msg(`Added ${c} cals`); }
}
function calcBMI() {
  const w = parseFloat(document.getElementById('bmiW').value);
  const h = parseFloat(document.getElementById('bmiH').value);
  if(w>0 && h>0) {
    const b = (w/((h/100)**2)).toFixed(1);
    document.getElementById('bmiRes').style.display='block';
    document.getElementById('bmiRes').innerHTML = `<h2>${b}</h2><p>Your BMI</p>`;
  }
}

// Timer
let tOn=false, tSec=0, tInt;
const fT = s => [Math.floor(s/60), s%60].map(v=>String(v).padStart(2,'0')).join(':') + '.00';
function tStart() {
  if(tOn) return; tOn=true;
  document.getElementById('tBtnStart').innerText='⏸';
  tInt = setInterval(()=>{ tSec++; document.getElementById('tDisp').innerText=fT(tSec); }, 1000);
}
function tReset() { clearInterval(tInt); tOn=false; tSec=0; document.getElementById('tDisp').innerText='00:00.00'; document.getElementById('tBtnStart').innerText='▶'; }
function tLap() { msg(`Lap: ${fT(tSec)}`); }

function msg(m) {
  const t = document.getElementById('toast');
  t.innerText = m; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}
