/* ============================================
   VictorFit v5.0 — Futuristic Application Logic
   ============================================ */

const APP_STORAGE_KEY = 'vfit5_data';

const initialAppState = {
  water: 0,
  foods: [],
  logs: [],
  streak: 1,
  totalWorkouts: 0,
  totalCalories: 0,
  totalMinutes: 0,
  bestStreak: 1,
  lastDate: new Date().toDateString(),
  weeklyCalories: [350, 520, 0, 640, 480, 0, 0],
  weeklyMinutes: [45, 60, 0, 75, 50, 0, 0]
};

function loadState() {
  try {
    const data = JSON.parse(localStorage.getItem(APP_STORAGE_KEY));
    return data ? { ...initialAppState, ...data } : { ...initialAppState };
  } catch (e) {
    return { ...initialAppState };
  }
}

function saveState() {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
}

let appState = loadState();

// ================= EXERCISES DATABASE =================
const EXERCISES_DB = [
  { id: 1, name: 'Barbell Bench Press', cat: 'chest', emoji: '🏋️', diff: 'intermediate', sets: 4, reps: '8-10', cals: 180, desc: 'The gold standard for chest hyperthrophy & pressing power.' },
  { id: 2, name: 'Incline Dumbbell Press', cat: 'chest', emoji: '🔥', diff: 'intermediate', sets: 3, reps: '10-12', cals: 150, desc: 'Targets upper clavicular chest fibers with full range of motion.' },
  { id: 3, name: 'Bodyweight Push-Ups', cat: 'chest', emoji: '💪', diff: 'beginner', sets: 3, reps: '15-20', cals: 100, desc: 'Fundamental compound exercise for chest, shoulders & core stability.' },
  { id: 4, name: 'Conventional Deadlift', cat: 'back', emoji: '⚡', diff: 'advanced', sets: 4, reps: '5-6', cals: 260, desc: 'Ultimate posterior chain builder engaging lats, glutes & lower back.' },
  { id: 5, name: 'Weighted Pull-Ups', cat: 'back', emoji: '💪', diff: 'intermediate', sets: 4, reps: '6-8', cals: 170, desc: 'Pillar for back width, lat activation and upper body pulling strength.' },
  { id: 6, name: 'Seated Cable Row', cat: 'back', emoji: '⬇️', diff: 'beginner', sets: 3, reps: '10-12', cals: 130, desc: 'Develops mid-back thickness, rhomboids and rear delt isolation.' },
  { id: 7, name: 'Barbell Back Squat', cat: 'legs', emoji: '🦵', diff: 'intermediate', sets: 4, reps: '8-10', cals: 230, desc: 'King of leg exercises for quadriceps, hamstrings and glute drive.' },
  { id: 8, name: 'Romanian Deadlift', cat: 'legs', emoji: '🔥', diff: 'intermediate', sets: 3, reps: '10-12', cals: 180, desc: 'Stretches and overloads hamstrings and posterior chain.' },
  { id: 9, name: 'Standing Bicep Curls', cat: 'arms', emoji: '💪', diff: 'beginner', sets: 3, reps: '10-12', cals: 90, desc: 'Isolated bicep extension builder for peak arm mass.' },
  { id: 10, name: 'Tricep Dips', cat: 'arms', emoji: '🔻', diff: 'intermediate', sets: 3, reps: '10-12', cals: 120, desc: 'Overhead tricep lockout builder utilizing bodyweight load.' },
  { id: 11, name: 'Overhead Military Press', cat: 'shoulders', emoji: '⬆️', diff: 'intermediate', sets: 4, reps: '8-10', cals: 160, desc: 'Compound shoulder press developing anterior & lateral delts.' },
  { id: 12, name: 'Dumbbell Lateral Raises', cat: 'shoulders', emoji: '🤷', diff: 'beginner', sets: 4, reps: '12-15', cals: 85, desc: 'Isolation raise for broad, capped lateral deltoid heads.' },
  { id: 13, name: 'Plank Hold', cat: 'core', emoji: '🧘', diff: 'beginner', sets: 3, reps: '60s', cals: 60, desc: 'Isometric core brace strengthening transverse abdominis.' },
  { id: 14, name: 'Hanging Leg Raises', cat: 'core', emoji: '🦵', diff: 'advanced', sets: 3, reps: '12-15', cals: 95, desc: 'Lower abdominal & hip flexor exercise with vertical hang.' },
  { id: 15, name: 'HIIT Treadmill Sprints', cat: 'cardio', emoji: '🏃', diff: 'advanced', sets: 8, reps: '30s Sprint', cals: 300, desc: 'High-intensity interval cardio for explosive fat burn.' }
];

// ================= ACHIEVEMENTS DATABASE =================
const ACHIEVEMENTS_DB = [
  { id: 'w1', icon: '🥇', name: 'First Lift', desc: 'Complete your 1st workout', thr: 1, type: 'w' },
  { id: 'w5', icon: '🔥', name: 'On Fire', desc: 'Complete 5 workouts', thr: 5, type: 'w' },
  { id: 'w10', icon: '💪', name: 'Dedicated Athlete', desc: 'Complete 10 workouts', thr: 10, type: 'w' },
  { id: 'w25', icon: '🏆', name: 'Cyber Legend', desc: 'Complete 25 workouts', thr: 25, type: 'w' },
  { id: 'h8', icon: '💧', name: 'Hydration Hero', desc: 'Drink 8 glasses of water', thr: 8, type: 'h' },
  { id: 's3', icon: '⚡', name: '3-Day Streak', desc: 'Maintain a 3-day workout streak', thr: 3, type: 's' },
  { id: 'c1k', icon: '🔥', name: 'Calorie Crusher', desc: 'Burn 1,000+ total calories', thr: 1000, type: 'c' }
];

const QUOTES_DB = [
  '"The only bad workout is the one that didn\'t happen."',
  '"Discipline is choosing between what you want now and what you want most."',
  '"Your body can stand almost anything. It\'s your mind you have to convince."',
  '"The pain you feel today will be the strength you feel tomorrow."',
  '"Strive for progress, not perfection."'
];

let activeExerciseObj = null;
let currentUpiAmount = '';
let currentUpiPlan = '';
const OFFICIAL_UPI_ID = 'arasu9629hf@okhdfcbank';

// Stopwatch variables
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

// ================= NAVIGATION ROUTER =================
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.cyber-nav-item a, .mobile-bottom-dock a').forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshViewData(viewId);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initDashboard();
  renderWorkoutsGrid('all');
  renderWaterCupsVisual();
  renderCharts();
  renderAchievements();
  updateProfileStats();
  checkDailyStreak();
});

function initHeaderScroll() {
  const header = document.getElementById('cyberHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function refreshViewData(viewId) {
  if (viewId === 'dashboard') {
    initDashboard();
  } else if (viewId === 'progress') {
    renderCharts();
    renderAchievements();
  } else if (viewId === 'profile') {
    updateProfileStats();
  }
}

// ================= DASHBOARD CONTROLLER =================
function initDashboard() {
  const now = new Date();
  const hours = now.getHours();
  const greetingEl = document.getElementById('greetingTime');
  if (greetingEl) {
    greetingEl.textContent = hours < 12 ? 'Good Morning!' : hours < 17 ? 'Good Afternoon!' : 'Good Evening!';
  }

  const dateEl = document.getElementById('heroCurrentDate');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }

  const quoteEl = document.getElementById('heroQuoteText');
  if (quoteEl) {
    quoteEl.textContent = QUOTES_DB[Math.floor(Math.random() * QUOTES_DB.length)];
  }

  document.getElementById('heroStreakCount').textContent = appState.streak;
  document.getElementById('dashStreakVal').textContent = appState.streak;

  const totalFoodCals = appState.foods.reduce((sum, item) => sum + item.cal, 0);
  document.getElementById('dashCalories').textContent = totalFoodCals.toLocaleString();
  document.getElementById('dashWorkouts').textContent = appState.totalWorkouts;
  document.getElementById('dashWater').textContent = appState.water;

  // Ring Calculation
  const todayLogs = appState.logs.filter(l => l.date === new Date().toDateString()).length;
  const totalCompleted = Math.min(todayLogs + appState.water, 12);
  const ringPct = Math.round((totalCompleted / 12) * 100);

  const circle = document.getElementById('dashRingCircle');
  if (circle) {
    const circumference = 2 * Math.PI * 66; // r=66 -> ~414
    const offset = circumference - (ringPct / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
  document.getElementById('dashRingPct').textContent = ringPct + '%';

  // Today Routine List
  const todayListEl = document.getElementById('dashTodayList');
  if (todayListEl) {
    const todayExercises = EXERCISES_DB.slice(0, 4);
    todayListEl.innerHTML = todayExercises.map(ex => {
      const isDone = appState.logs.some(l => l.id === ex.id && l.date === new Date().toDateString());
      return `
        <div class="workout-mini-pill" onclick="openExerciseModal(${ex.id})">
          <div class="mini-icon">${ex.emoji}</div>
          <div class="mini-details">
            <h4>${ex.name}</h4>
            <p>${ex.sets} sets × ${ex.reps}</p>
          </div>
          <div class="mini-status-dot ${isDone ? 'completed' : ''}"></div>
        </div>
      `;
    }).join('');
  }
}

// ================= WORKOUTS CONTROLLER =================
function renderWorkoutsGrid(category) {
  const grid = document.getElementById('exercisesGrid');
  if (!grid) return;

  const list = category === 'all' ? EXERCISES_DB : EXERCISES_DB.filter(e => e.cat === category);

  grid.innerHTML = list.map(ex => `
    <div class="ex-cyber-card" onclick="openExerciseModal(${ex.id})">
      <div class="ex-card-top">
        <span class="ex-emoji-badge">${ex.emoji}</span>
        <span class="ex-diff-pill diff-${ex.diff}">${ex.diff}</span>
      </div>
      <div class="ex-card-body">
        <h3>${ex.name}</h3>
        <p>${ex.desc}</p>
      </div>
      <div class="ex-card-stats">
        <span>📋 ${ex.sets} × ${ex.reps}</span>
        <span>🔥 ${ex.cals} cal</span>
      </div>
    </div>
  `).join('');
}

function filterWorkouts(category, btnElement) {
  document.querySelectorAll('#categoryFilterBar .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderWorkoutsGrid(category);
}

function openExerciseModal(id) {
  activeExerciseObj = EXERCISES_DB.find(e => e.id === id);
  if (!activeExerciseObj) return;

  document.getElementById('modalExEmoji').textContent = activeExerciseObj.emoji;
  document.getElementById('modalExTitle').textContent = activeExerciseObj.name;
  document.getElementById('modalExDesc').textContent = activeExerciseObj.desc;
  document.getElementById('modalExSets').textContent = activeExerciseObj.sets;
  document.getElementById('modalExReps').textContent = activeExerciseObj.reps;
  document.getElementById('modalExCals').textContent = activeExerciseObj.cals;

  const isDone = appState.logs.some(l => l.id === activeExerciseObj.id && l.date === new Date().toDateString());
  const btn = document.getElementById('btnModalLogExercise');
  btn.textContent = isDone ? '✅ Already Logged Today' : '✅ Log Completed Workout';
  btn.style.opacity = isDone ? '0.6' : '1';

  openModal('exerciseModal');
}

function confirmLogExercise() {
  if (!activeExerciseObj) return;

  const todayStr = new Date().toDateString();
  if (appState.logs.some(l => l.id === activeExerciseObj.id && l.date === todayStr)) {
    triggerToast('Workout already logged for today!');
    closeModal('exerciseModal');
    return;
  }

  appState.logs.push({ id: activeExerciseObj.id, date: todayStr });
  appState.totalWorkouts++;
  appState.totalCalories += activeExerciseObj.cals;
  appState.totalMinutes += 15;

  const dayIndex = new Date().getDay();
  appState.weeklyCalories[dayIndex] = (appState.weeklyCalories[dayIndex] || 0) + activeExerciseObj.cals;
  appState.weeklyMinutes[dayIndex] = (appState.weeklyMinutes[dayIndex] || 0) + 15;

  saveState();
  triggerToast(`💪 ${activeExerciseObj.name} logged! +${activeExerciseObj.cals} cal`);
  closeModal('exerciseModal');

  initDashboard();
}

// ================= TOOLS CONTROLLERS =================

// Water Tracker
function renderWaterCupsVisual() {
  const container = document.getElementById('waterCupsVisual');
  if (!container) return;

  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const cup = document.createElement('div');
    cup.className = 'water-cup-item' + (i < appState.water ? ' filled' : '');
    cup.onclick = () => setWaterCount(i + 1);
    container.appendChild(cup);
  }

  document.getElementById('waterGlassCount').textContent = appState.water;
}

function setWaterCount(count) {
  appState.water = count;
  saveState();
  renderWaterCupsVisual();
  initDashboard();
  if (count >= 8) {
    triggerToast('💧 Daily Hydration Target Reached!');
  }
}

function incrementWater() {
  if (appState.water >= 8) {
    triggerToast('Hydration target already completed!');
    return;
  }
  setWaterCount(appState.water + 1);
}

function resetWaterTracker() {
  setWaterCount(0);
}

// Timer
function formatStopwatch(sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return [mins, secs].map(v => String(v).padStart(2, '0')).join(':') + '.00';
}

function startTimer() {
  if (isTimerRunning) return;
  isTimerRunning = true;
  document.getElementById('btnTimerStart').style.display = 'none';
  document.getElementById('btnTimerPause').style.display = 'flex';

  timerInterval = setInterval(() => {
    timerSeconds++;
    document.getElementById('timerClockDisplay').textContent = formatStopwatch(timerSeconds);
  }, 1000);
}

function pauseTimer() {
  isTimerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('btnTimerStart').style.display = 'flex';
  document.getElementById('btnTimerPause').style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  document.getElementById('timerClockDisplay').textContent = '00:00.00';
}

// BMI Calculator
function computeBMI() {
  const w = parseFloat(document.getElementById('bmiWeight').value);
  const h = parseFloat(document.getElementById('bmiHeight').value);

  if (!w || !h || w <= 0 || h <= 0) {
    triggerToast('Please enter valid weight & height!');
    return;
  }

  const bmi = (w / ((h / 100) ** 2)).toFixed(1);
  document.getElementById('bmiVal').textContent = bmi;

  let cat = 'Normal';
  if (bmi < 18.5) cat = 'Underweight';
  else if (bmi >= 25 && bmi < 30) cat = 'Overweight';
  else if (bmi >= 30) cat = 'Obese';

  document.getElementById('bmiCategory').textContent = cat;
  document.getElementById('bmiResultBox').classList.add('show');
}

// Food Logger
function logFoodItem() {
  const name = document.getElementById('foodNameInput').value.trim();
  const cal = parseInt(document.getElementById('foodCalInput').value);

  if (!name || !cal || cal <= 0) {
    triggerToast('Please enter valid food name & calories');
    return;
  }

  appState.foods.push({ name, cal });
  saveState();

  document.getElementById('foodNameInput').value = '';
  document.getElementById('foodCalInput').value = '';

  renderFoodList();
  initDashboard();
  triggerToast(`🍽️ ${name} logged (+${cal} cals)`);
}

function renderFoodList() {
  const listEl = document.getElementById('foodLoggedList');
  if (!listEl) return;

  if (appState.foods.length === 0) {
    listEl.innerHTML = '<p style="color: var(--c-text-muted); font-size: 13px; text-align: center;">No food logged today.</p>';
    return;
  }

  listEl.innerHTML = appState.foods.map((item, idx) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); margin-bottom: 8px;">
      <span style="font-size: 14px; font-weight: 600;">🍽️ ${item.name}</span>
      <span style="font-size: 13px; color: var(--neon-magenta); font-weight: 700;">${item.cal} cal</span>
    </div>
  `).join('');
}

// ================= PROGRESS CONTROLLER =================
function renderCharts() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxCals = Math.max(...appState.weeklyCalories, 100);
  const maxMins = Math.max(...appState.weeklyMinutes, 10);

  const calChart = document.getElementById('chartCaloriesContainer');
  if (calChart) {
    calChart.innerHTML = appState.weeklyCalories.map((val, idx) => `
      <div class="bar-column-item">
        <div class="bar-pill-graphic bar-cal-gradient" style="height: ${Math.max((val / maxCals) * 100, 6)}%;"></div>
        <div class="bar-day-label">${days[idx]}</div>
      </div>
    `).join('');
  }

  const minChart = document.getElementById('chartMinutesContainer');
  if (minChart) {
    minChart.innerHTML = appState.weeklyMinutes.map((val, idx) => `
      <div class="bar-column-item">
        <div class="bar-pill-graphic bar-work-gradient" style="height: ${Math.max((val / maxMins) * 100, 6)}%;"></div>
        <div class="bar-day-label">${days[idx]}</div>
      </div>
    `).join('');
  }
}

function renderAchievements() {
  const grid = document.getElementById('achievementsGridSystem');
  if (!grid) return;

  grid.innerHTML = ACHIEVEMENTS_DB.map(ach => {
    let currentVal = 0;
    if (ach.type === 'w') currentVal = appState.totalWorkouts;
    if (ach.type === 'h') currentVal = appState.water;
    if (ach.type === 's') currentVal = appState.bestStreak;
    if (ach.type === 'c') currentVal = appState.totalCalories;

    const isUnlocked = currentVal >= ach.thr;

    return `
      <div class="achievement-badge-card ${isUnlocked ? '' : 'locked'}">
        <span class="ach-icon-emoji">${ach.icon}</span>
        <h4 class="ach-title">${ach.name}</h4>
        <p class="ach-desc-text">${isUnlocked ? ach.desc : '🔒 ' + ach.desc}</p>
      </div>
    `;
  }).join('');
}

function updateProfileStats() {
  document.getElementById('profTotalWorkouts').textContent = appState.totalWorkouts;
  document.getElementById('profTotalCalories').textContent = appState.totalCalories.toLocaleString();
  document.getElementById('profBestStreak').textContent = appState.bestStreak;
  document.getElementById('profTotalMinutes').textContent = appState.totalMinutes;
}

function checkDailyStreak() {
  const today = new Date().toDateString();
  if (appState.lastDate !== today) {
    const diffDays = Math.floor((new Date(today) - new Date(appState.lastDate)) / 86400000);
    appState.streak = diffDays === 1 ? appState.streak + 1 : diffDays > 1 ? 1 : appState.streak;
    appState.lastDate = today;
    if (appState.streak > appState.bestStreak) {
      appState.bestStreak = appState.streak;
    }
    saveState();
  }
}

// ================= UPI PAYMENT CONTROLLER =================
function openUpiModal(amount, planTitle) {
  currentUpiAmount = amount;
  currentUpiPlan = planTitle;

  const titleEl = document.getElementById('upiModalTitle');
  const subEl = document.getElementById('upiModalSub');
  const customAmtWrap = document.getElementById('upiCustomAmtWrapper');

  if (amount === 'Custom') {
    titleEl.textContent = 'Donate Custom Amount';
    subEl.textContent = 'Enter your preferred contribution in INR';
    customAmtWrap.style.display = 'block';
  } else {
    titleEl.textContent = planTitle;
    subEl.textContent = `Transfer ${amount} securely via UPI`;
    customAmtWrap.style.display = 'none';
  }

  openModal('upiPaymentModal');
}

function copyUpiToClipboard() {
  navigator.clipboard.writeText(OFFICIAL_UPI_ID).then(() => {
    triggerToast('✅ Official UPI ID copied to clipboard!');
  }).catch(() => {
    triggerToast('Failed to copy. Copy manually: ' + OFFICIAL_UPI_ID);
  });
}

function initiateUpiRedirect() {
  let finalAmt = currentUpiAmount;
  if (finalAmt === 'Custom') {
    finalAmt = document.getElementById('upiCustomAmtInput').value;
    if (!finalAmt || isNaN(finalAmt) || finalAmt <= 0) {
      triggerToast('Please enter a valid donation amount!');
      return;
    }
  } else {
    finalAmt = finalAmt.replace('₹', '');
  }

  const note = encodeURIComponent(`VictorFit - ${currentUpiPlan}`);
  const upiUrl = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=VictorFit&am=${finalAmt}&cu=INR&tn=${note}`;

  window.location.href = upiUrl;

  setTimeout(() => {
    triggerToast(`Opening UPI application to pay ₹${finalAmt}...`);
  }, 400);
}

// ================= MODALS & TOAST HELPERS =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

document.querySelectorAll('.modal-cyber-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-cyber-backdrop')) {
      closeModal(e.target.id);
    }
  });
});

function triggerToast(message) {
  const host = document.getElementById('toastContainer');
  if (!host) return;

  const toast = document.createElement('div');
  toast.className = 'toast-pill';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  host.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
