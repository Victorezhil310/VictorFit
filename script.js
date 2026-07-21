/* ============================================
   VictorFit v2.0 — Ultra Premium App Logic
   ============================================ */

// ============= STORAGE =============
const KEY = 'vfit2';
const defaults = {
  water: 0, foods: [], calGoal: 2200, logs: [], weights: [],
  streak: 1, totalW: 0, totalC: 0, totalM: 0, bestStreak: 1,
  weekGoal: 5, targetWt: 75, lastDate: new Date().toDateString(),
  wCals: [320,480,0,560,410,0,0], wMins: [45,60,0,55,40,0,0]
};

function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); return d ? { ...defaults, ...d } : { ...defaults }; }
  catch { return { ...defaults }; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(D)); }
let D = load();

// ============= EXERCISES DB =============
const EX = [
  { id:1, name:'Bench Press', cat:'chest', emoji:'🏋️', diff:'intermediate',
    desc:'The king of chest exercises. Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower to chest, and press up.',
    sets:4, reps:'8-12', cals:180, muscles:'Chest, Triceps, Front Delts',
    how:'1. Lie flat on the bench with feet planted firmly.\n2. Grip the bar slightly wider than shoulder-width.\n3. Unrack the bar and lower to mid-chest.\n4. Press back up to starting position.\n5. Keep your core tight throughout.' },
  { id:2, name:'Incline Dumbbell Press', cat:'chest', emoji:'🔥', diff:'intermediate',
    desc:'Targets the upper chest with an inclined angle for better development.',
    sets:3, reps:'10-12', cals:150, muscles:'Upper Chest, Triceps',
    how:'1. Set bench to 30-45 degree angle.\n2. Hold dumbbells at shoulder height.\n3. Press up and squeeze at the top.\n4. Lower slowly with control.' },
  { id:3, name:'Push-Ups', cat:'chest', emoji:'💪', diff:'beginner',
    desc:'Classic bodyweight exercise for building chest, shoulders, and triceps strength.',
    sets:3, reps:'15-20', cals:100, muscles:'Chest, Triceps, Core',
    how:'1. Place hands shoulder-width apart.\n2. Keep body in a straight line.\n3. Lower chest to the ground.\n4. Push back up explosively.' },
  { id:4, name:'Cable Flyes', cat:'chest', emoji:'🦋', diff:'beginner',
    desc:'Isolation movement that stretches and contracts the chest muscles effectively.',
    sets:3, reps:'12-15', cals:100, muscles:'Chest',
    how:'1. Set pulleys to chest height.\n2. Step forward with one foot.\n3. Bring hands together in an arc.\n4. Squeeze the chest at the center.' },
  { id:5, name:'Deadlift', cat:'back', emoji:'🔥', diff:'advanced',
    desc:'The ultimate compound lift. Works your entire posterior chain with heavy loads.',
    sets:4, reps:'5-8', cals:250, muscles:'Back, Glutes, Hamstrings',
    how:'1. Stand with feet hip-width, bar over mid-foot.\n2. Hinge at hips, grip the bar.\n3. Lift by driving hips forward.\n4. Keep back neutral throughout.\n5. Lower with control.' },
  { id:6, name:'Pull-Ups', cat:'back', emoji:'💪', diff:'intermediate',
    desc:'Bodyweight king for building a wide, powerful back and strong lats.',
    sets:4, reps:'6-10', cals:160, muscles:'Lats, Biceps, Core',
    how:'1. Hang from bar with overhand grip.\n2. Pull yourself up until chin is over bar.\n3. Lower slowly to full extension.\n4. Avoid swinging or kipping.' },
  { id:7, name:'Barbell Row', cat:'back', emoji:'🏋️', diff:'intermediate',
    desc:'Builds thickness in the mid-back with heavy compound rowing movement.',
    sets:4, reps:'8-12', cals:170, muscles:'Mid Back, Lats, Biceps',
    how:'1. Hinge forward at 45 degrees.\n2. Grip bar slightly wider than shoulder-width.\n3. Pull bar to lower chest.\n4. Squeeze shoulder blades together.' },
  { id:8, name:'Lat Pulldown', cat:'back', emoji:'⬇️', diff:'beginner',
    desc:'Machine-based lat exercise, great for building back width safely.',
    sets:3, reps:'10-12', cals:120, muscles:'Lats, Biceps',
    how:'1. Sit at the lat pulldown machine.\n2. Grip bar wider than shoulder-width.\n3. Pull bar to upper chest.\n4. Control the negative.' },
  { id:9, name:'Barbell Squat', cat:'legs', emoji:'🦵', diff:'intermediate',
    desc:'The king of leg exercises. Builds quads, glutes, and overall lower body strength.',
    sets:4, reps:'8-12', cals:220, muscles:'Quads, Glutes, Hamstrings',
    how:'1. Place bar on upper traps.\n2. Feet shoulder-width apart.\n3. Squat until thighs are parallel.\n4. Drive through heels to stand.\n5. Keep chest up and core tight.' },
  { id:10, name:'Romanian Deadlift', cat:'legs', emoji:'🔥', diff:'intermediate',
    desc:'Targets hamstrings and glutes with a controlled hip hinge pattern.',
    sets:3, reps:'10-12', cals:180, muscles:'Hamstrings, Glutes',
    how:'1. Hold barbell at hip height.\n2. Push hips back with slight knee bend.\n3. Lower bar along your legs.\n4. Feel the stretch in hamstrings.\n5. Drive hips forward to return.' },
  { id:11, name:'Leg Press', cat:'legs', emoji:'🦿', diff:'beginner',
    desc:'Machine-based leg exercise for safe and effective heavy leg training.',
    sets:4, reps:'10-15', cals:190, muscles:'Quads, Glutes',
    how:'1. Sit in the leg press machine.\n2. Place feet shoulder-width on platform.\n3. Lower the weight with control.\n4. Press back up without locking knees.' },
  { id:12, name:'Walking Lunges', cat:'legs', emoji:'🚶', diff:'beginner',
    desc:'Dynamic movement that builds balance, coordination, and leg strength.',
    sets:3, reps:'12 each', cals:140, muscles:'Quads, Glutes, Hamstrings',
    how:'1. Stand tall with dumbbells at sides.\n2. Step forward into a lunge.\n3. Lower back knee toward ground.\n4. Push off front foot and step forward.' },
  { id:13, name:'Barbell Curl', cat:'arms', emoji:'💪', diff:'beginner',
    desc:'Classic bicep builder for bigger, stronger arms with progressive overload.',
    sets:3, reps:'10-12', cals:90, muscles:'Biceps',
    how:'1. Stand with feet shoulder-width apart.\n2. Grip barbell with underhand grip.\n3. Curl bar up to shoulder height.\n4. Squeeze biceps at the top.\n5. Lower slowly.' },
  { id:14, name:'Tricep Dips', cat:'arms', emoji:'🔻', diff:'intermediate',
    desc:'Bodyweight exercise for massive tricep and upper body development.',
    sets:3, reps:'8-12', cals:120, muscles:'Triceps, Chest, Shoulders',
    how:'1. Grip dip bars and lift yourself up.\n2. Lean slightly forward.\n3. Lower body until arms at 90°.\n4. Press back up to full extension.' },
  { id:15, name:'Hammer Curls', cat:'arms', emoji:'🔨', diff:'beginner',
    desc:'Neutral grip curl targeting the brachialis and forearm muscles.',
    sets:3, reps:'10-12', cals:80, muscles:'Biceps, Brachialis, Forearms',
    how:'1. Hold dumbbells with neutral grip.\n2. Curl up keeping palms facing each other.\n3. Squeeze at the top.\n4. Lower slowly.' },
  { id:16, name:'Skull Crushers', cat:'arms', emoji:'💀', diff:'intermediate',
    desc:'Lying tricep extension for serious arm size and strength gains.',
    sets:3, reps:'10-12', cals:100, muscles:'Triceps',
    how:'1. Lie on flat bench with EZ bar.\n2. Extend arms straight up.\n3. Lower bar toward forehead.\n4. Extend back up. Keep elbows still.' },
  { id:17, name:'Overhead Press', cat:'shoulders', emoji:'⬆️', diff:'intermediate',
    desc:'The best compound movement for building massive boulder shoulders.',
    sets:4, reps:'8-10', cals:160, muscles:'Shoulders, Triceps, Core',
    how:'1. Hold barbell at shoulder height.\n2. Brace your core tightly.\n3. Press bar overhead to lockout.\n4. Lower with control back to shoulders.' },
  { id:18, name:'Lateral Raises', cat:'shoulders', emoji:'🤷', diff:'beginner',
    desc:'Isolation exercise to build wide, capped, aesthetically pleasing shoulders.',
    sets:4, reps:'12-15', cals:80, muscles:'Side Delts',
    how:'1. Hold light dumbbells at sides.\n2. Raise arms out to the sides.\n3. Lift until parallel to floor.\n4. Lower slowly with control.' },
  { id:19, name:'Face Pulls', cat:'shoulders', emoji:'🎯', diff:'beginner',
    desc:'Crucial exercise for rear delt development and rotator cuff health.',
    sets:3, reps:'15-20', cals:70, muscles:'Rear Delts, Rotator Cuff',
    how:'1. Set cable at face height with rope.\n2. Pull rope toward your face.\n3. Externally rotate at the end.\n4. Squeeze rear delts hard.' },
  { id:20, name:'Arnold Press', cat:'shoulders', emoji:'🏆', diff:'intermediate',
    desc:'Rotational press hitting all three delt heads. Invented by the legend himself!',
    sets:3, reps:'10-12', cals:130, muscles:'All Deltoids',
    how:'1. Start with dumbbells at chin, palms facing you.\n2. Rotate palms as you press up.\n3. Finish palms forward at top.\n4. Reverse coming down.' },
  { id:21, name:'Plank', cat:'core', emoji:'🧘', diff:'beginner',
    desc:'Isometric core exercise and foundation of all core training programs.',
    sets:3, reps:'30-60s', cals:60, muscles:'Core, Shoulders',
    how:'1. Get into push-up position on forearms.\n2. Keep body in a straight line.\n3. Engage core tightly.\n4. Hold for prescribed time.\n5. Breathe steadily.' },
  { id:22, name:'Hanging Leg Raises', cat:'core', emoji:'🦵', diff:'advanced',
    desc:'Advanced core movement targeting lower abs with full range of motion.',
    sets:3, reps:'10-15', cals:90, muscles:'Lower Abs, Hip Flexors',
    how:'1. Hang from a pull-up bar.\n2. Keep legs straight.\n3. Raise legs to 90° or higher.\n4. Lower slowly with control.' },
  { id:23, name:'Russian Twists', cat:'core', emoji:'🌀', diff:'beginner',
    desc:'Rotational core exercise for building oblique strength and definition.',
    sets:3, reps:'20 total', cals:70, muscles:'Obliques, Core',
    how:'1. Sit with knees bent, lean back slightly.\n2. Hold weight at chest.\n3. Rotate torso side to side.\n4. Tap weight on each side.' },
  { id:24, name:'Ab Rollout', cat:'core', emoji:'🛞', diff:'advanced',
    desc:'Intense core exercise using an ab wheel for maximum muscle engagement.',
    sets:3, reps:'8-12', cals:100, muscles:'Entire Core, Lats',
    how:'1. Kneel on the ground with ab wheel.\n2. Roll forward extending body.\n3. Go as far as you can with form.\n4. Roll back to start.' },
  { id:25, name:'HIIT Sprints', cat:'cardio', emoji:'🏃', diff:'advanced',
    desc:'High-intensity interval sprints for maximum fat burning and cardiovascular fitness.',
    sets:8, reps:'30s on/30s off', cals:350, muscles:'Full Body',
    how:'1. Sprint at max effort 30 seconds.\n2. Walk or jog 30 seconds.\n3. Repeat 8-10 rounds.\n4. Warm up and cool down properly.' },
  { id:26, name:'Jump Rope', cat:'cardio', emoji:'🪢', diff:'beginner',
    desc:'Fun and effective cardio that dramatically improves coordination and endurance.',
    sets:5, reps:'1 min', cals:200, muscles:'Calves, Shoulders, Core',
    how:'1. Hold rope handles at hip height.\n2. Jump with feet together.\n3. Land softly on balls of feet.\n4. Keep jumps small and consistent.' },
  { id:27, name:'Burpees', cat:'cardio', emoji:'🤸', diff:'intermediate',
    desc:'Full-body explosive exercise and the ultimate calorie-burning movement.',
    sets:4, reps:'10-15', cals:280, muscles:'Full Body',
    how:'1. Start standing, drop into squat.\n2. Kick feet back into push-up.\n3. Do a push-up.\n4. Jump feet forward.\n5. Explode upward with a jump.' },
  { id:28, name:'Mountain Climbers', cat:'cardio', emoji:'⛰️', diff:'beginner',
    desc:'Fast-paced bodyweight cardio that torches calories and builds core strength.',
    sets:4, reps:'30s', cals:160, muscles:'Core, Shoulders, Legs',
    how:'1. Start in push-up position.\n2. Drive one knee toward chest.\n3. Quickly switch legs.\n4. Keep hips low and core tight.' },
];

// ============= ACHIEVEMENTS =============
const ACHS = [
  { id:'w1', icon:'🥇', name:'First Step', desc:'Complete 1 workout', thr:1, type:'w' },
  { id:'w5', icon:'🔥', name:'On Fire', desc:'Complete 5 workouts', thr:5, type:'w' },
  { id:'w10', icon:'💪', name:'Dedicated', desc:'Complete 10 workouts', thr:10, type:'w' },
  { id:'w25', icon:'🏆', name:'Champion', desc:'Complete 25 workouts', thr:25, type:'w' },
  { id:'w50', icon:'👑', name:'Fitness King', desc:'Complete 50 workouts', thr:50, type:'w' },
  { id:'h8', icon:'💧', name:'Hydrated', desc:'Drink 8 glasses', thr:8, type:'h' },
  { id:'s3', icon:'⚡', name:'3-Day Streak', desc:'3-day streak', thr:3, type:'s' },
  { id:'s7', icon:'🌟', name:'Week Warrior', desc:'7-day streak', thr:7, type:'s' },
  { id:'s30', icon:'🎖️', name:'Monthly Master', desc:'30-day streak', thr:30, type:'s' },
  { id:'c1k', icon:'🔥', name:'Calorie Crusher', desc:'Burn 1000+ cal', thr:1000, type:'c' },
  { id:'c5k', icon:'💥', name:'Inferno', desc:'Burn 5000+ cal', thr:5000, type:'c' },
  { id:'wl5', icon:'📊', name:'Tracker', desc:'Log weight 5 times', thr:5, type:'wl' },
];

// ============= QUOTES =============
const QUOTES = [
  '"The only bad workout is the one that didn\'t happen."',
  '"Discipline is choosing between what you want now and what you want most."',
  '"Your body can stand almost anything. It\'s your mind you have to convince."',
  '"The pain you feel today will be the strength you feel tomorrow."',
  '"Don\'t count the days, make the days count." — Muhammad Ali',
  '"Success isn\'t always about greatness. It\'s about consistency."',
  '"Sweat is fat crying." — Keep pushing!',
  '"The only way to do great work is to love what you do."',
  '"Wake up. Work out. Look hot. Kick ass."',
  '"Strive for progress, not perfection."',
];

// ============= STATE =============
let curSection = 'dashboard';
let curEx = null;
let timerInt = null, timerSec = 0, timerOn = false, laps = [];

// ============= NAVIGATION =============
function nav(section) {
  curSection = section;
  document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('sec-' + section);
  if (el) el.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-links li a, .bottom-bar li a').forEach(a => {
    a.classList.toggle('active', a.dataset.section === section);
  });

  document.getElementById('navLinks').classList.remove('show');
  document.getElementById('hamburger').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshSection(section);
  initRevealAnimations();
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
  document.getElementById('hamburger').classList.toggle('open');
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initWater();
  renderEx('all');
  renderToday();
  refreshDash();
  renderWeights();
  renderAchs();
  renderCharts();
  renderFoods();
  updateCalSummary();
  updateProfile();
  loadGoals();
  checkStreak();
  initScrollHeader();
  initRevealAnimations();

  document.getElementById('wDate').valueAsDate = new Date();
  setTimeout(() => updateRing(), 500);
});

function refreshSection(s) {
  if (s === 'dashboard') { refreshDash(); setTimeout(() => updateRing(), 200); }
  if (s === 'progress') { renderCharts(); renderWeights(); renderAchs(); }
  if (s === 'profile') updateProfile();
  if (s === 'tools') updateCalSummary();
}

// ============= SCROLL EFFECTS =============
function initScrollHeader() {
  const header = document.getElementById('appHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

function initRevealAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

// ============= GREETING =============
function initGreeting() {
  const h = new Date().getHours();
  document.getElementById('greetTime').textContent = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';

  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('heroDate').textContent = '📅 ' + new Date().toLocaleDateString('en-US', opts);

  document.getElementById('heroQuote').textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('streakBadge').textContent = D.streak;
}

// ============= DASHBOARD =============
function refreshDash() {
  const eaten = D.foods.reduce((s, f) => s + f.cal, 0);
  document.getElementById('dCalories').textContent = eaten.toLocaleString();
  document.getElementById('dWorkouts').textContent = D.totalW;
  document.getElementById('dWater').textContent = D.water;
  document.getElementById('dStreak').textContent = D.streak;
}

function renderToday() {
  const el = document.getElementById('todayList');
  const cats = ['chest','back','legs','arms','shoulders','core','cardio'];
  const todayCat = cats[new Date().getDay() % cats.length];
  const items = EX.filter(e => e.cat === todayCat).slice(0, 4);

  if (!items.length) {
    el.innerHTML = '<p style="padding:20px;color:var(--text-400);text-align:center;">Rest day! Take it easy 😴</p>';
    return;
  }

  el.innerHTML = items.map(ex => {
    const done = D.logs.some(l => l.id === ex.id && l.date === new Date().toDateString());
    return `<div class="workout-list-item" onclick="openEx(${ex.id})">
      <div class="wl-icon ${ex.cat}">${ex.emoji}</div>
      <div class="wl-info">
        <h4>${ex.name}</h4>
        <span>${ex.sets} sets × ${ex.reps}</span>
      </div>
      <span class="wl-badge ${done ? 'done' : 'pending'}">${done ? '✓ Done' : 'Pending'}</span>
    </div>`;
  }).join('');
}

function updateRing() {
  const wDone = D.logs.filter(l => l.date === new Date().toDateString()).length;
  const total = Math.min(wDone + D.water, 12);
  const pct = Math.round((total / 12) * 100);
  const circ = 2 * Math.PI * 72;
  document.getElementById('ringFill').style.strokeDashoffset = circ - (pct / 100) * circ;
  document.getElementById('ringPct').textContent = pct + '%';
}

// ============= EXERCISES =============
function renderEx(cat) {
  const grid = document.getElementById('exGrid');
  const list = cat === 'all' ? EX : EX.filter(e => e.cat === cat);

  grid.innerHTML = list.map(ex => `
    <div class="ex-card" onclick="openEx(${ex.id})">
      <span class="difficulty-tag diff-${ex.diff}">${ex.diff}</span>
      <span class="ex-emoji">${ex.emoji}</span>
      <h3>${ex.name}</h3>
      <p class="ex-desc">${ex.desc}</p>
      <div class="ex-meta">
        <div class="ex-meta-item">📋 ${ex.sets}×${ex.reps}</div>
        <div class="ex-meta-item">🔥 ${ex.cals} cal</div>
        <div class="ex-meta-item">💪 ${ex.muscles.split(',')[0]}</div>
      </div>
    </div>
  `).join('');

  initRevealAnimations();
}

function filterEx(cat) {
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  renderEx(cat);
}

// ============= EXERCISE MODAL =============
function openEx(id) {
  curEx = EX.find(e => e.id === id);
  if (!curEx) return;
  document.getElementById('emTitle').textContent = curEx.name;
  document.getElementById('emEmoji').textContent = curEx.emoji;
  document.getElementById('emDesc').textContent = curEx.desc;
  document.getElementById('emSets').textContent = curEx.sets;
  document.getElementById('emReps').textContent = curEx.reps;
  document.getElementById('emCals').textContent = curEx.cals;
  document.getElementById('emHow').innerHTML = '<strong style="color:var(--text-100)">How to perform:</strong><br>' + curEx.how.split('\n').join('<br>');

  const done = D.logs.some(l => l.id === id && l.date === new Date().toDateString());
  const btn = document.getElementById('emLogBtn');
  btn.textContent = done ? '✅ Already Logged Today' : '✅ Log This Workout';
  btn.style.opacity = done ? '0.5' : '1';

  openModal('exModal');
}

function logFromModal() {
  if (!curEx) return;
  if (D.logs.some(l => l.id === curEx.id && l.date === new Date().toDateString())) {
    toast('Already logged today!', 'info');
    return;
  }

  D.logs.push({ id: curEx.id, name: curEx.name, cat: curEx.cat, cals: curEx.cals, date: new Date().toDateString(), time: new Date().toLocaleTimeString() });
  D.totalW++;
  D.totalC += curEx.cals;
  D.totalM += 15;

  const di = new Date().getDay();
  D.wCals[di] = (D.wCals[di] || 0) + curEx.cals;
  D.wMins[di] = (D.wMins[di] || 0) + 15;

  save();
  toast(`💪 ${curEx.name} logged! +${curEx.cals} cal`, 'success');
  closeModal('exModal');
  renderToday();
  refreshDash();
  updateRing();
}

// ============= BMI =============
function calcBMI() {
  const w = parseFloat(document.getElementById('bmiW').value);
  const h = parseFloat(document.getElementById('bmiH').value);
  if (!w || !h || w <= 0 || h <= 0) { toast('Enter valid weight & height', 'error'); return; }
  const bmi = (w / ((h/100) ** 2)).toFixed(1);
  document.getElementById('bmiVal').textContent = bmi;

  let cat, col;
  if (bmi < 18.5) { cat = 'Underweight'; col = '#3b82f6'; }
  else if (bmi < 25) { cat = 'Normal'; col = '#10b981'; }
  else if (bmi < 30) { cat = 'Overweight'; col = '#f59e0b'; }
  else { cat = 'Obese'; col = '#f43f5e'; }

  const tag = document.getElementById('bmiTag');
  tag.textContent = cat;
  tag.style.background = col + '18';
  tag.style.color = col;

  document.getElementById('bmiRes').classList.add('show');
  toast(`BMI: ${bmi} — ${cat}`, 'success');
}

// ============= 1RM =============
function calcORM() {
  const w = parseFloat(document.getElementById('ormW').value);
  const r = parseInt(document.getElementById('ormR').value);
  if (!w || !r || w <= 0 || r <= 0) { toast('Enter valid weight & reps', 'error'); return; }
  const orm = Math.round(w * (1 + r / 30));
  document.getElementById('ormVal').textContent = orm + ' kg';
  document.getElementById('ormRes').classList.add('show');
  toast(`Estimated 1RM: ${orm} kg 🏋️`, 'success');
}

// ============= BODY FAT =============
function calcBF() {
  const g = document.getElementById('bfG').value;
  const wa = parseFloat(document.getElementById('bfW').value);
  const n = parseFloat(document.getElementById('bfN').value);
  const h = parseFloat(document.getElementById('bfHt').value);
  const hp = parseFloat(document.getElementById('bfHp').value);
  if (!wa || !n || !h) { toast('Fill all required fields', 'error'); return; }

  let bf;
  if (g === 'male') {
    bf = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
  } else {
    if (!hp) { toast('Hip measurement required for females', 'error'); return; }
    bf = 495 / (1.29579 - 0.35004 * Math.log10(wa + hp - n) + 0.22100 * Math.log10(h)) - 450;
  }
  bf = Math.max(2, Math.min(60, bf)).toFixed(1);
  document.getElementById('bfVal').textContent = bf + '%';

  let cat, col;
  if (g === 'male') {
    if (bf < 6) { cat = 'Essential'; col = '#3b82f6'; }
    else if (bf < 14) { cat = 'Athletic'; col = '#10b981'; }
    else if (bf < 18) { cat = 'Fitness'; col = '#8b5cf6'; }
    else if (bf < 25) { cat = 'Average'; col = '#f59e0b'; }
    else { cat = 'Above Avg'; col = '#f43f5e'; }
  } else {
    if (bf < 14) { cat = 'Essential'; col = '#3b82f6'; }
    else if (bf < 21) { cat = 'Athletic'; col = '#10b981'; }
    else if (bf < 25) { cat = 'Fitness'; col = '#8b5cf6'; }
    else if (bf < 32) { cat = 'Average'; col = '#f59e0b'; }
    else { cat = 'Above Avg'; col = '#f43f5e'; }
  }

  const tag = document.getElementById('bfTag');
  tag.textContent = cat;
  tag.style.background = col + '18';
  tag.style.color = col;
  document.getElementById('bfRes').classList.add('show');
  toast(`Body Fat: ${bf}% — ${cat}`, 'success');
}

// ============= CALORIE COUNTER =============
function addFood() {
  const n = document.getElementById('fName').value.trim();
  const c = parseInt(document.getElementById('fCal').value);
  if (!n || !c || c <= 0) { toast('Enter food name & calories', 'error'); return; }

  D.foods.push({ name: n, cal: c, time: new Date().toLocaleTimeString() });
  save();
  document.getElementById('fName').value = '';
  document.getElementById('fCal').value = '';
  renderFoods();
  updateCalSummary();
  refreshDash();
  toast(`🍽️ ${n} added (${c} cal)`, 'success');
}

function removeFood(i) {
  D.foods.splice(i, 1);
  save();
  renderFoods();
  updateCalSummary();
  refreshDash();
}

function renderFoods() {
  const el = document.getElementById('foodList');
  if (!D.foods.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--text-400);padding:18px;font-size:13px;">No food logged yet. Add your meals above!</p>';
    return;
  }
  el.innerHTML = D.foods.map((f, i) => `
    <div class="food-row">
      <span class="fr-name">🍽️ ${f.name}</span>
      <span class="fr-cal">${f.cal} cal</span>
      <button class="fr-del" onclick="removeFood(${i})" title="Remove">✕</button>
    </div>
  `).join('');
}

function updateCalSummary() {
  const g = D.calGoal;
  const e = D.foods.reduce((s, f) => s + f.cal, 0);
  document.getElementById('cGoal').textContent = g.toLocaleString();
  document.getElementById('cEat').textContent = e.toLocaleString();
  document.getElementById('cLeft').textContent = Math.max(0, g - e).toLocaleString();
}

// ============= TIMER =============
function fmt(s) {
  return [Math.floor(s/3600), Math.floor((s%3600)/60), s%60].map(v => String(v).padStart(2,'0')).join(':');
}

function tStart() {
  if (timerOn) return;
  timerOn = true;
  document.getElementById('tStart').style.display = 'none';
  document.getElementById('tPause').style.display = 'flex';
  timerInt = setInterval(() => {
    timerSec++;
    document.getElementById('timerDisp').textContent = fmt(timerSec);
  }, 1000);
}

function tPause() {
  timerOn = false;
  clearInterval(timerInt);
  document.getElementById('tStart').style.display = 'flex';
  document.getElementById('tPause').style.display = 'none';
}

function tReset() {
  tPause();
  timerSec = 0;
  laps = [];
  document.getElementById('timerDisp').textContent = '00:00:00';
  document.getElementById('lapsList').innerHTML = '';
}

function tLap() {
  if (!timerOn && timerSec === 0) return;
  laps.push(timerSec);
  const el = document.createElement('div');
  el.className = 'lap-row';
  el.innerHTML = `<span class="lap-n">Lap ${laps.length}</span><span class="lap-t">${fmt(timerSec)}</span>`;
  document.getElementById('lapsList').prepend(el);
}

// ============= WATER =============
function initWater() {
  const el = document.getElementById('waterCups');
  el.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const cup = document.createElement('div');
    cup.className = 'water-cup' + (i < D.water ? ' filled' : '');
    cup.onclick = () => setWater(i + 1);
    el.appendChild(cup);
  }
  document.getElementById('wCount').textContent = D.water;
}

function setWater(n) {
  D.water = n;
  save();
  initWater();
  refreshDash();
  updateRing();
  if (n >= 8) toast('💧 Water goal achieved! Stay hydrated!', 'success');
}

function addWater() {
  if (D.water >= 8) { toast('Already hit your water goal! 🎉', 'info'); return; }
  setWater(D.water + 1);
  toast(`💧 Glass ${D.water} of 8 logged!`, 'success');
}

function resetWater() {
  D.water = 0;
  save();
  initWater();
  refreshDash();
  updateRing();
  toast('Water tracker reset', 'info');
}

// ============= WEIGHT LOG =============
function saveWeight() {
  const d = document.getElementById('wDate').value;
  const w = parseFloat(document.getElementById('wVal').value);
  if (!d || !w || w <= 0) { toast('Enter valid date & weight', 'error'); return; }
  D.weights.push({ date: d, weight: w });
  D.weights.sort((a, b) => new Date(b.date) - new Date(a.date));
  save();
  closeModal('weightModal');
  renderWeights();
  toast(`📊 Weight logged: ${w} kg`, 'success');
}

function renderWeights() {
  const el = document.getElementById('weightList');
  if (!D.weights.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--text-400);padding:24px;font-size:13px;">No entries yet. Click "Log Weight" to start tracking!</p>';
    return;
  }
  el.innerHTML = D.weights.slice(0, 10).map((e, i, a) => {
    const diff = i < a.length - 1 ? (e.weight - a[i+1].weight).toFixed(1) : 0;
    const cls = diff > 0 ? 'color:var(--rose-500)' : diff < 0 ? 'color:var(--emerald-400)' : 'color:var(--text-400)';
    const txt = diff > 0 ? `+${diff} kg` : diff < 0 ? `${diff} kg` : '—';
    const fd = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `<div class="weight-row"><span class="wr-date">${fd}</span><span class="wr-val">${e.weight} kg</span><span class="wr-diff" style="${cls}">${txt}</span></div>`;
  }).join('');
}

// ============= CHARTS =============
function renderCharts() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const maxC = Math.max(...D.wCals, 100);
  const maxW = Math.max(...D.wMins, 10);

  document.getElementById('calChart').innerHTML = D.wCals.map((v, i) =>
    `<div class="bar-col"><div class="bar cal-bar" style="height:${Math.max((v/maxC)*100, 3)}%"></div><div class="bar-day">${days[i]}</div></div>`
  ).join('');

  document.getElementById('workChart').innerHTML = D.wMins.map((v, i) =>
    `<div class="bar-col"><div class="bar work-bar" style="height:${Math.max((v/maxW)*100, 3)}%"></div><div class="bar-day">${days[i]}</div></div>`
  ).join('');
}

// ============= ACHIEVEMENTS =============
function renderAchs() {
  document.getElementById('achGrid').innerHTML = ACHS.map(a => {
    let v = 0;
    if (a.type === 'w') v = D.totalW;
    if (a.type === 'h') v = D.water;
    if (a.type === 's') v = D.bestStreak;
    if (a.type === 'c') v = D.totalC;
    if (a.type === 'wl') v = D.weights.length;
    const ok = v >= a.thr;
    return `<div class="ach-item ${ok ? '' : 'locked'}">
      <span class="ach-icon">${a.icon}</span>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${ok ? a.desc : '🔒 ' + a.desc}</div>
    </div>`;
  }).join('');
}

// ============= PROFILE =============
function updateProfile() {
  document.getElementById('pWork').textContent = D.totalW;
  document.getElementById('pCal').textContent = D.totalC.toLocaleString();
  document.getElementById('pStreak').textContent = D.bestStreak;
  document.getElementById('pMins').textContent = D.totalM;
}

function loadGoals() {
  document.getElementById('gCal').value = D.calGoal;
  document.getElementById('gWork').value = D.weekGoal;
  document.getElementById('gWt').value = D.targetWt;
}

function saveGoals() {
  D.calGoal = parseInt(document.getElementById('gCal').value) || 2200;
  D.weekGoal = parseInt(document.getElementById('gWork').value) || 5;
  D.targetWt = parseInt(document.getElementById('gWt').value) || 75;
  save();
  updateCalSummary();
  toast('🎯 Goals saved!', 'success');
}

// ============= STREAK =============
function checkStreak() {
  const today = new Date().toDateString();
  if (D.lastDate !== today) {
    const diff = Math.floor((new Date(today) - new Date(D.lastDate)) / 864e5);
    D.streak = diff === 1 ? D.streak + 1 : diff > 1 ? 1 : D.streak;
    D.lastDate = today;
    if (D.streak > D.bestStreak) D.bestStreak = D.streak;
    save();
  }
}

// ============= MODALS =============
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.getElementById('exModal').addEventListener('click', e => { if (e.target.id === 'exModal') closeModal('exModal'); });
document.getElementById('weightModal').addEventListener('click', e => { if (e.target.id === 'weightModal') closeModal('weightModal'); });

// ============= TOASTS =============
function toast(msg, type = 'info') {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  t.innerHTML = `<span class="t-icon">${icon}</span><span class="t-msg">${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3500);
}

// ============= KEYBOARD =============
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.key === '1') nav('dashboard');
  if (e.key === '2') nav('workouts');
  if (e.key === '3') nav('tools');
  if (e.key === '4') nav('progress');
  if (e.key === '5') nav('profile');
  if (e.key === 'Escape') { closeModal('exModal'); closeModal('weightModal'); }
});
