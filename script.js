/* ============================================
   VictorFit — Complete Application Logic
   ============================================ */

// ============= DATA STORE =============
const APP_KEY = 'victorfit_data';

const defaultData = {
  waterCount: 0,
  foodLog: [],
  calorieGoal: 2200,
  workoutLog: [],
  weightLog: [],
  streak: 1,
  totalWorkouts: 0,
  totalCalories: 0,
  totalMinutes: 0,
  bestStreak: 1,
  weeklyWorkouts: 5,
  targetWeight: 75,
  lastActiveDate: new Date().toDateString(),
  weeklyCalories: [320, 480, 0, 560, 410, 0, 0],
  weeklyWorkoutMins: [45, 60, 0, 55, 40, 0, 0]
};

function loadData() {
  try {
    const raw = localStorage.getItem(APP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultData, ...parsed };
    }
  } catch (e) { /* ignore */ }
  return { ...defaultData };
}

function saveData(data) {
  localStorage.setItem(APP_KEY, JSON.stringify(data));
}

let appData = loadData();

// ============= EXERCISE DATABASE =============
const exercises = [
  // Chest
  { id: 1, name: 'Bench Press', category: 'chest', emoji: '🏋️', difficulty: 'intermediate',
    desc: 'The king of chest exercises. Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower to chest, and press up.',
    sets: 4, reps: '8-12', cals: 180, muscles: 'Chest, Triceps, Front Delts',
    instructions: '1. Lie flat on the bench with feet planted firmly.\n2. Grip the bar slightly wider than shoulder-width.\n3. Unrack the bar and lower to mid-chest.\n4. Press back up to starting position.\n5. Keep your core tight throughout.' },
  { id: 2, name: 'Incline Dumbbell Press', category: 'chest', emoji: '🔥', difficulty: 'intermediate',
    desc: 'Targets the upper chest with an inclined angle for better development.',
    sets: 3, reps: '10-12', cals: 150, muscles: 'Upper Chest, Triceps',
    instructions: '1. Set bench to 30-45 degree angle.\n2. Hold dumbbells at shoulder height.\n3. Press up and squeeze at the top.\n4. Lower slowly with control.' },
  { id: 3, name: 'Push-Ups', category: 'chest', emoji: '💪', difficulty: 'beginner',
    desc: 'Classic bodyweight exercise for building chest, shoulders, and triceps.',
    sets: 3, reps: '15-20', cals: 100, muscles: 'Chest, Triceps, Core',
    instructions: '1. Place hands shoulder-width apart on the floor.\n2. Keep your body in a straight line.\n3. Lower your chest to the ground.\n4. Push back up explosively.' },
  { id: 4, name: 'Cable Flyes', category: 'chest', emoji: '🦋', difficulty: 'beginner',
    desc: 'Isolation movement that stretches and contracts the chest muscles.',
    sets: 3, reps: '12-15', cals: 100, muscles: 'Chest',
    instructions: '1. Set pulleys to chest height.\n2. Step forward with one foot.\n3. Bring hands together in an arc.\n4. Squeeze the chest at the center.' },

  // Back
  { id: 5, name: 'Deadlift', category: 'back', emoji: '🔥', difficulty: 'advanced',
    desc: 'The ultimate compound lift. Works your entire posterior chain.',
    sets: 4, reps: '5-8', cals: 250, muscles: 'Back, Glutes, Hamstrings',
    instructions: '1. Stand with feet hip-width, bar over mid-foot.\n2. Hinge at hips, grip the bar.\n3. Lift by driving hips forward.\n4. Keep back neutral throughout.\n5. Lower with control.' },
  { id: 6, name: 'Pull-Ups', category: 'back', emoji: '💪', difficulty: 'intermediate',
    desc: 'Bodyweight king for building a wide, powerful back.',
    sets: 4, reps: '6-10', cals: 160, muscles: 'Lats, Biceps, Core',
    instructions: '1. Hang from bar with overhand grip.\n2. Pull yourself up until chin is over bar.\n3. Lower slowly to full extension.\n4. Avoid swinging or kipping.' },
  { id: 7, name: 'Barbell Row', category: 'back', emoji: '🏋️', difficulty: 'intermediate',
    desc: 'Builds thickness in the mid-back with heavy rowing.',
    sets: 4, reps: '8-12', cals: 170, muscles: 'Mid Back, Lats, Biceps',
    instructions: '1. Hinge forward at 45 degrees.\n2. Grip bar slightly wider than shoulder-width.\n3. Pull bar to lower chest.\n4. Squeeze shoulder blades together.' },
  { id: 8, name: 'Lat Pulldown', category: 'back', emoji: '⬇️', difficulty: 'beginner',
    desc: 'Machine-based lat exercise, great for building width.',
    sets: 3, reps: '10-12', cals: 120, muscles: 'Lats, Biceps',
    instructions: '1. Sit at the lat pulldown machine.\n2. Grip bar wider than shoulder-width.\n3. Pull bar to upper chest.\n4. Control the negative.' },

  // Legs
  { id: 9, name: 'Barbell Squat', category: 'legs', emoji: '🦵', difficulty: 'intermediate',
    desc: 'The king of leg exercises. Builds quads, glutes, and overall strength.',
    sets: 4, reps: '8-12', cals: 220, muscles: 'Quads, Glutes, Hamstrings',
    instructions: '1. Place bar on upper traps.\n2. Feet shoulder-width apart.\n3. Squat until thighs are parallel.\n4. Drive through heels to stand.\n5. Keep chest up and core tight.' },
  { id: 10, name: 'Romanian Deadlift', category: 'legs', emoji: '🔥', difficulty: 'intermediate',
    desc: 'Targets hamstrings and glutes with a hip hinge pattern.',
    sets: 3, reps: '10-12', cals: 180, muscles: 'Hamstrings, Glutes',
    instructions: '1. Hold barbell at hip height.\n2. Push hips back with slight knee bend.\n3. Lower bar along your legs.\n4. Feel the stretch in hamstrings.\n5. Drive hips forward to return.' },
  { id: 11, name: 'Leg Press', category: 'legs', emoji: '🦿', difficulty: 'beginner',
    desc: 'Machine-based leg exercise for safe heavy lifting.',
    sets: 4, reps: '10-15', cals: 190, muscles: 'Quads, Glutes',
    instructions: '1. Sit in the leg press machine.\n2. Place feet shoulder-width on platform.\n3. Lower the weight with control.\n4. Press back up without locking knees.' },
  { id: 12, name: 'Walking Lunges', category: 'legs', emoji: '🚶', difficulty: 'beginner',
    desc: 'Dynamic movement that builds balance, coordination, and leg strength.',
    sets: 3, reps: '12 each', cals: 140, muscles: 'Quads, Glutes, Hamstrings',
    instructions: '1. Stand tall with dumbbells at sides.\n2. Step forward into a lunge.\n3. Lower back knee toward ground.\n4. Push off front foot and step forward.\n5. Alternate legs.' },

  // Arms
  { id: 13, name: 'Barbell Curl', category: 'arms', emoji: '💪', difficulty: 'beginner',
    desc: 'Classic bicep builder for bigger, stronger arms.',
    sets: 3, reps: '10-12', cals: 90, muscles: 'Biceps',
    instructions: '1. Stand with feet shoulder-width apart.\n2. Grip barbell with underhand grip.\n3. Curl the bar up to shoulder height.\n4. Squeeze biceps at the top.\n5. Lower slowly with control.' },
  { id: 14, name: 'Tricep Dips', category: 'arms', emoji: '🔻', difficulty: 'intermediate',
    desc: 'Bodyweight exercise for massive tricep development.',
    sets: 3, reps: '8-12', cals: 120, muscles: 'Triceps, Chest, Shoulders',
    instructions: '1. Grip the dip bars and lift yourself up.\n2. Lean slightly forward.\n3. Lower body until arms are at 90 degrees.\n4. Press back up to full extension.' },
  { id: 15, name: 'Hammer Curls', category: 'arms', emoji: '🔨', difficulty: 'beginner',
    desc: 'Neutral grip curl targeting the brachialis and forearms.',
    sets: 3, reps: '10-12', cals: 80, muscles: 'Biceps, Brachialis, Forearms',
    instructions: '1. Hold dumbbells with neutral grip (palms facing in).\n2. Curl up keeping palms facing each other.\n3. Squeeze at the top.\n4. Lower slowly.' },
  { id: 16, name: 'Skull Crushers', category: 'arms', emoji: '💀', difficulty: 'intermediate',
    desc: 'Lying tricep extension for serious arm size.',
    sets: 3, reps: '10-12', cals: 100, muscles: 'Triceps',
    instructions: '1. Lie on flat bench with EZ bar.\n2. Extend arms straight up.\n3. Lower bar toward forehead by bending elbows.\n4. Extend back up. Keep elbows stationary.' },

  // Shoulders
  { id: 17, name: 'Overhead Press', category: 'shoulders', emoji: '⬆️', difficulty: 'intermediate',
    desc: 'The best compound movement for building boulder shoulders.',
    sets: 4, reps: '8-10', cals: 160, muscles: 'Shoulders, Triceps, Core',
    instructions: '1. Hold barbell at shoulder height.\n2. Brace your core tightly.\n3. Press bar overhead to lockout.\n4. Lower with control back to shoulders.' },
  { id: 18, name: 'Lateral Raises', category: 'shoulders', emoji: '🤷', difficulty: 'beginner',
    desc: 'Isolation exercise to build wide, capped shoulders.',
    sets: 4, reps: '12-15', cals: 80, muscles: 'Side Delts',
    instructions: '1. Hold light dumbbells at your sides.\n2. Raise arms out to the sides.\n3. Lift until arms are parallel to floor.\n4. Lower slowly with control.' },
  { id: 19, name: 'Face Pulls', category: 'shoulders', emoji: '🎯', difficulty: 'beginner',
    desc: 'Crucial exercise for rear delt and rotator cuff health.',
    sets: 3, reps: '15-20', cals: 70, muscles: 'Rear Delts, Rotator Cuff',
    instructions: '1. Set cable at face height with rope.\n2. Pull rope toward your face.\n3. Externally rotate at the end.\n4. Squeeze rear delts hard.' },
  { id: 20, name: 'Arnold Press', category: 'shoulders', emoji: '🏆', difficulty: 'intermediate',
    desc: 'Rotational press hitting all three delt heads. Invented by Arnold!',
    sets: 3, reps: '10-12', cals: 130, muscles: 'All Deltoids',
    instructions: '1. Start with dumbbells at chin, palms facing you.\n2. Rotate palms as you press up.\n3. Finish with palms facing forward at the top.\n4. Reverse the motion coming down.' },

  // Core
  { id: 21, name: 'Plank', category: 'core', emoji: '🧘', difficulty: 'beginner',
    desc: 'Isometric core exercise. Foundation of all core training.',
    sets: 3, reps: '30-60s', cals: 60, muscles: 'Core, Shoulders',
    instructions: '1. Get into push-up position on forearms.\n2. Keep body in a straight line.\n3. Engage your core tightly.\n4. Hold for prescribed time.\n5. Breathe steadily.' },
  { id: 22, name: 'Hanging Leg Raises', category: 'core', emoji: '🦵', difficulty: 'advanced',
    desc: 'Advanced core movement targeting lower abs.',
    sets: 3, reps: '10-15', cals: 90, muscles: 'Lower Abs, Hip Flexors',
    instructions: '1. Hang from a pull-up bar.\n2. Keep legs straight.\n3. Raise legs to 90 degrees or higher.\n4. Lower slowly with control.\n5. Avoid swinging.' },
  { id: 23, name: 'Russian Twists', category: 'core', emoji: '🌀', difficulty: 'beginner',
    desc: 'Rotational core exercise for building oblique strength.',
    sets: 3, reps: '20 total', cals: 70, muscles: 'Obliques, Core',
    instructions: '1. Sit with knees bent, lean back slightly.\n2. Hold weight at chest.\n3. Rotate torso side to side.\n4. Tap the weight on each side.' },
  { id: 24, name: 'Ab Rollout', category: 'core', emoji: '🛞', difficulty: 'advanced',
    desc: 'Intense core exercise using an ab wheel for maximum engagement.',
    sets: 3, reps: '8-12', cals: 100, muscles: 'Entire Core, Lats',
    instructions: '1. Kneel on the ground with ab wheel.\n2. Roll forward extending your body.\n3. Go as far as you can maintain form.\n4. Roll back to starting position.' },

  // Cardio
  { id: 25, name: 'HIIT Sprints', category: 'cardio', emoji: '🏃', difficulty: 'advanced',
    desc: 'High-intensity interval sprints for maximum fat burning.',
    sets: 8, reps: '30s on/30s off', cals: 350, muscles: 'Full Body',
    instructions: '1. Sprint at max effort for 30 seconds.\n2. Walk or jog for 30 seconds.\n3. Repeat 8-10 rounds.\n4. Warm up and cool down properly.' },
  { id: 26, name: 'Jump Rope', category: 'cardio', emoji: '🪢', difficulty: 'beginner',
    desc: 'Fun and effective cardio that improves coordination.',
    sets: 5, reps: '1 min', cals: 200, muscles: 'Calves, Shoulders, Core',
    instructions: '1. Hold rope handles at hip height.\n2. Jump with feet together.\n3. Land softly on the balls of your feet.\n4. Keep jumps small and consistent.' },
  { id: 27, name: 'Burpees', category: 'cardio', emoji: '🤸', difficulty: 'intermediate',
    desc: 'Full-body explosive exercise. The ultimate calorie burner.',
    sets: 4, reps: '10-15', cals: 280, muscles: 'Full Body',
    instructions: '1. Start standing, drop into squat.\n2. Kick feet back into push-up.\n3. Do a push-up.\n4. Jump feet forward.\n5. Explode upward with a jump.' },
  { id: 28, name: 'Mountain Climbers', category: 'cardio', emoji: '⛰️', difficulty: 'beginner',
    desc: 'Fast-paced bodyweight cardio that torches calories.',
    sets: 4, reps: '30s', cals: 160, muscles: 'Core, Shoulders, Legs',
    instructions: '1. Start in push-up position.\n2. Drive one knee toward chest.\n3. Quickly switch legs.\n4. Keep hips low and core tight.\n5. Move as fast as possible.' },
];

// ============= ACHIEVEMENTS =============
const achievements = [
  { id: 'first_workout', icon: '🥇', name: 'First Step', desc: 'Complete your first workout', threshold: 1, type: 'workouts' },
  { id: 'five_workouts', icon: '🔥', name: 'On Fire', desc: 'Complete 5 workouts', threshold: 5, type: 'workouts' },
  { id: 'ten_workouts', icon: '💪', name: 'Dedicated', desc: 'Complete 10 workouts', threshold: 10, type: 'workouts' },
  { id: 'twentyfive_workouts', icon: '🏆', name: 'Champion', desc: 'Complete 25 workouts', threshold: 25, type: 'workouts' },
  { id: 'fifty_workouts', icon: '👑', name: 'Fitness King', desc: 'Complete 50 workouts', threshold: 50, type: 'workouts' },
  { id: 'hydrated', icon: '💧', name: 'Hydrated', desc: 'Drink 8 glasses of water', threshold: 8, type: 'water' },
  { id: 'streak_3', icon: '⚡', name: '3-Day Streak', desc: 'Maintain a 3-day streak', threshold: 3, type: 'streak' },
  { id: 'streak_7', icon: '🌟', name: 'Week Warrior', desc: '7-day workout streak', threshold: 7, type: 'streak' },
  { id: 'streak_30', icon: '🎖️', name: 'Monthly Master', desc: '30-day workout streak', threshold: 30, type: 'streak' },
  { id: 'cal_1000', icon: '🔥', name: 'Calorie Crusher', desc: 'Burn 1000+ total calories', threshold: 1000, type: 'calories' },
  { id: 'cal_5000', icon: '💥', name: 'Inferno', desc: 'Burn 5000+ total calories', threshold: 5000, type: 'calories' },
  { id: 'weight_log', icon: '📊', name: 'Tracker', desc: 'Log your weight 5 times', threshold: 5, type: 'weightLogs' },
];

// ============= NAVIGATION =============
let currentSection = 'dashboard';
let currentExercise = null;

function navigate(section) {
  currentSection = section;
  // Hide all sections
  document.querySelectorAll('.app-section').forEach(s => {
    s.classList.remove('active');
  });
  // Show target
  const target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-links li a, .bottom-nav-items li a').forEach(a => {
    a.classList.remove('active');
    if (a.dataset.section === section) a.classList.add('active');
  });

  // Close mobile nav
  document.getElementById('navLinks').classList.remove('show');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh section data
  refreshSection(section);
}

function toggleMobileNav() {
  document.getElementById('navLinks').classList.toggle('show');
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initWaterGlasses();
  renderExercises('all');
  renderTodayWorkout();
  refreshDashboard();
  renderWeightLog();
  renderAchievements();
  renderCharts();
  renderFoodLog();
  updateCalorieSummary();
  updateProfileStats();
  loadGoals();
  checkStreak();

  // Set default date for weight modal
  document.getElementById('weightDate').valueAsDate = new Date();

  // Animate progress ring on load
  setTimeout(() => updateProgressRing(), 500);
});

function refreshSection(section) {
  switch (section) {
    case 'dashboard':
      refreshDashboard();
      setTimeout(() => updateProgressRing(), 300);
      break;
    case 'progress':
      renderCharts();
      renderWeightLog();
      renderAchievements();
      break;
    case 'profile':
      updateProfileStats();
      break;
    case 'tools':
      updateCalorieSummary();
      break;
  }
}

// ============= GREETING =============
function initGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Morning';
  if (hour >= 12 && hour < 17) greeting = 'Afternoon';
  else if (hour >= 17) greeting = 'Evening';
  document.getElementById('greeting-time').textContent = greeting;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('greeting-date').textContent = new Date().toLocaleDateString('en-US', options);
}

// ============= DASHBOARD =============
function refreshDashboard() {
  const eaten = appData.foodLog.reduce((sum, f) => sum + f.calories, 0);
  document.getElementById('dash-calories').textContent = eaten.toLocaleString();
  document.getElementById('dash-workouts').textContent = appData.totalWorkouts;
  document.getElementById('dash-water').textContent = appData.waterCount;
  document.getElementById('dash-streak').textContent = appData.streak;
}

function renderTodayWorkout() {
  const container = document.getElementById('todayWorkoutList');
  // Pick 4 random exercises as today's plan
  const dayIndex = new Date().getDay();
  const categories = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'cardio'];
  const todayCat = categories[dayIndex % categories.length];
  const todayExercises = exercises.filter(e => e.category === todayCat).slice(0, 4);

  if (todayExercises.length === 0) {
    container.innerHTML = '<p style="padding:20px; color: var(--text-secondary);">Rest day! Take it easy 😴</p>';
    return;
  }

  container.innerHTML = todayExercises.map((ex, i) => {
    const logged = appData.workoutLog.some(w => w.id === ex.id && w.date === new Date().toDateString());
    return `
      <div class="workout-preview-item" onclick="openExerciseModal(${ex.id})" style="cursor:pointer;">
        <div class="exercise-icon-small ${ex.category}">${ex.emoji}</div>
        <div class="exercise-info">
          <h4>${ex.name}</h4>
          <span>${ex.sets} sets × ${ex.reps} reps</span>
        </div>
        <div class="exercise-status">
          <span class="badge ${logged ? 'done' : 'pending'}">${logged ? '✓ Done' : 'Pending'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateProgressRing() {
  const workoutsDone = appData.workoutLog.filter(w => w.date === new Date().toDateString()).length;
  const waterDone = appData.waterCount;
  // Goal: at least 4 exercises + 8 glasses
  const totalGoal = 12;
  const totalDone = Math.min(workoutsDone + waterDone, totalGoal);
  const pct = Math.round((totalDone / totalGoal) * 100);

  const circle = document.getElementById('progressRing');
  const circumference = 2 * Math.PI * 68; // r=68
  const offset = circumference - (pct / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  document.getElementById('goalPercent').textContent = pct + '%';
}

// ============= EXERCISES =============
function renderExercises(category) {
  const grid = document.getElementById('exercisesGrid');
  const filtered = category === 'all' ? exercises : exercises.filter(e => e.category === category);

  grid.innerHTML = filtered.map(ex => `
    <div class="exercise-card" onclick="openExerciseModal(${ex.id})" id="exercise-${ex.id}">
      <span class="exercise-difficulty difficulty-${ex.difficulty}">${ex.difficulty}</span>
      <span class="exercise-emoji">${ex.emoji}</span>
      <h3>${ex.name}</h3>
      <p class="exercise-desc">${ex.desc}</p>
      <div class="exercise-meta">
        <div class="meta-item"><span class="meta-icon">📋</span> ${ex.sets}×${ex.reps}</div>
        <div class="meta-item"><span class="meta-icon">🔥</span> ${ex.cals} cal</div>
        <div class="meta-item"><span class="meta-icon">💪</span> ${ex.muscles.split(',')[0]}</div>
      </div>
    </div>
  `).join('');
}

function filterExercises(category) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  renderExercises(category);
}

// ============= EXERCISE MODAL =============
function openExerciseModal(id) {
  currentExercise = exercises.find(e => e.id === id);
  if (!currentExercise) return;

  document.getElementById('exModalTitle').textContent = currentExercise.name;
  document.getElementById('exModalEmoji').textContent = currentExercise.emoji;
  document.getElementById('exModalDesc').textContent = currentExercise.desc;
  document.getElementById('exModalSets').textContent = currentExercise.sets;
  document.getElementById('exModalReps').textContent = currentExercise.reps;
  document.getElementById('exModalCals').textContent = currentExercise.cals;
  document.getElementById('exModalInstructions').innerHTML =
    '<strong style="color:var(--text-primary);">How to perform:</strong><br>' +
    currentExercise.instructions.split('\n').join('<br>');

  const logged = appData.workoutLog.some(w => w.id === id && w.date === new Date().toDateString());
  const btn = document.getElementById('exModalLogBtn');
  if (logged) {
    btn.textContent = '✅ Already Logged Today';
    btn.style.opacity = '0.5';
  } else {
    btn.textContent = '✅ Log This Workout';
    btn.style.opacity = '1';
  }

  document.getElementById('exerciseModal').classList.add('show');
}

function closeExerciseModal() {
  document.getElementById('exerciseModal').classList.remove('show');
  currentExercise = null;
}

function logWorkoutFromModal() {
  if (!currentExercise) return;
  const already = appData.workoutLog.some(w => w.id === currentExercise.id && w.date === new Date().toDateString());
  if (already) {
    showToast('Already logged this exercise today!', 'info');
    return;
  }

  appData.workoutLog.push({
    id: currentExercise.id,
    name: currentExercise.name,
    category: currentExercise.category,
    cals: currentExercise.cals,
    date: new Date().toDateString(),
    time: new Date().toLocaleTimeString()
  });

  appData.totalWorkouts++;
  appData.totalCalories += currentExercise.cals;
  appData.totalMinutes += 15; // estimate 15 min per exercise

  // Update weekly data
  const dayIdx = new Date().getDay();
  appData.weeklyCalories[dayIdx] = (appData.weeklyCalories[dayIdx] || 0) + currentExercise.cals;
  appData.weeklyWorkoutMins[dayIdx] = (appData.weeklyWorkoutMins[dayIdx] || 0) + 15;

  saveData(appData);
  showToast(`💪 ${currentExercise.name} logged! +${currentExercise.cals} cal`, 'success');
  closeExerciseModal();
  renderTodayWorkout();
  refreshDashboard();
  updateProgressRing();
}

// ============= BMI CALCULATOR =============
function calculateBMI() {
  const weight = parseFloat(document.getElementById('bmiWeight').value);
  const height = parseFloat(document.getElementById('bmiHeight').value);

  if (!weight || !height || weight <= 0 || height <= 0) {
    showToast('Please enter valid weight and height', 'error');
    return;
  }

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  document.getElementById('bmiValue').textContent = bmi;

  let category = '';
  let color = '';
  if (bmi < 18.5) { category = 'Underweight'; color = '#74b9ff'; }
  else if (bmi < 25) { category = 'Normal Weight'; color = '#69f0ae'; }
  else if (bmi < 30) { category = 'Overweight'; color = '#ffd740'; }
  else { category = 'Obese'; color = '#ff5252'; }

  const catEl = document.getElementById('bmiCategory');
  catEl.textContent = category;
  catEl.style.background = color + '20';
  catEl.style.color = color;

  document.getElementById('bmiResult').classList.add('show');
  showToast(`Your BMI is ${bmi} — ${category}`, 'success');
}

// ============= ONE REP MAX =============
function calculateORM() {
  const weight = parseFloat(document.getElementById('ormWeight').value);
  const reps = parseInt(document.getElementById('ormReps').value);

  if (!weight || !reps || weight <= 0 || reps <= 0) {
    showToast('Please enter valid weight and reps', 'error');
    return;
  }

  // Epley formula: 1RM = weight × (1 + reps/30)
  const orm = Math.round(weight * (1 + reps / 30));

  document.getElementById('ormValue').textContent = orm + ' kg';
  document.getElementById('ormResult').classList.add('show');
  showToast(`Your estimated 1RM is ${orm} kg 🏋️`, 'success');
}

// ============= BODY FAT =============
function calculateBodyFat() {
  const gender = document.getElementById('bfGender').value;
  const waist = parseFloat(document.getElementById('bfWaist').value);
  const neck = parseFloat(document.getElementById('bfNeck').value);
  const height = parseFloat(document.getElementById('bfHeight').value);
  const hip = parseFloat(document.getElementById('bfHip').value);

  if (!waist || !neck || !height) {
    showToast('Please fill in all required measurements', 'error');
    return;
  }

  let bf;
  if (gender === 'male') {
    bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    if (!hip) {
      showToast('Hip measurement is required for females', 'error');
      return;
    }
    bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
  }

  bf = Math.max(2, Math.min(60, bf)).toFixed(1);

  document.getElementById('bfValue').textContent = bf + '%';

  let category = '', color = '';
  if (gender === 'male') {
    if (bf < 6) { category = 'Essential Fat'; color = '#74b9ff'; }
    else if (bf < 14) { category = 'Athletic'; color = '#69f0ae'; }
    else if (bf < 18) { category = 'Fitness'; color = '#a29bfe'; }
    else if (bf < 25) { category = 'Average'; color = '#ffd740'; }
    else { category = 'Above Average'; color = '#ff5252'; }
  } else {
    if (bf < 14) { category = 'Essential Fat'; color = '#74b9ff'; }
    else if (bf < 21) { category = 'Athletic'; color = '#69f0ae'; }
    else if (bf < 25) { category = 'Fitness'; color = '#a29bfe'; }
    else if (bf < 32) { category = 'Average'; color = '#ffd740'; }
    else { category = 'Above Average'; color = '#ff5252'; }
  }

  const catEl = document.getElementById('bfCategory');
  catEl.textContent = category;
  catEl.style.background = color + '20';
  catEl.style.color = color;

  document.getElementById('bfResult').classList.add('show');
  showToast(`Estimated body fat: ${bf}% — ${category}`, 'success');
}

// ============= CALORIE COUNTER =============
function addFood() {
  const name = document.getElementById('foodName').value.trim();
  const cals = parseInt(document.getElementById('foodCalories').value);

  if (!name || !cals || cals <= 0) {
    showToast('Please enter food name and calories', 'error');
    return;
  }

  appData.foodLog.push({ name, calories: cals, time: new Date().toLocaleTimeString() });
  saveData(appData);

  document.getElementById('foodName').value = '';
  document.getElementById('foodCalories').value = '';

  renderFoodLog();
  updateCalorieSummary();
  refreshDashboard();
  showToast(`🍽️ Added ${name} (${cals} cal)`, 'success');
}

function removeFood(index) {
  appData.foodLog.splice(index, 1);
  saveData(appData);
  renderFoodLog();
  updateCalorieSummary();
  refreshDashboard();
}

function renderFoodLog() {
  const container = document.getElementById('foodLog');
  if (appData.foodLog.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 16px; font-size: 13px;">No food logged yet today. Add your meals above!</p>';
    return;
  }

  container.innerHTML = appData.foodLog.map((f, i) => `
    <div class="food-log-item">
      <span class="food-name">🍽️ ${f.name}</span>
      <span class="food-cals">${f.calories} cal</span>
      <button class="food-remove" onclick="removeFood(${i})" title="Remove">✕</button>
    </div>
  `).join('');
}

function updateCalorieSummary() {
  const goal = appData.calorieGoal;
  const eaten = appData.foodLog.reduce((sum, f) => sum + f.calories, 0);
  const remaining = Math.max(0, goal - eaten);

  document.getElementById('calGoal').textContent = goal.toLocaleString();
  document.getElementById('calEaten').textContent = eaten.toLocaleString();
  document.getElementById('calRemaining').textContent = remaining.toLocaleString();
}

// ============= TIMER / STOPWATCH =============
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let timerLaps = [];

function formatTime(totalSecs) {
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return [hrs, mins, secs].map(v => String(v).padStart(2, '0')).join(':');
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  document.getElementById('timerStartBtn').style.display = 'none';
  document.getElementById('timerPauseBtn').style.display = 'flex';

  timerInterval = setInterval(() => {
    timerSeconds++;
    document.getElementById('timerDisplay').textContent = formatTime(timerSeconds);
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('timerStartBtn').style.display = 'flex';
  document.getElementById('timerPauseBtn').style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  timerLaps = [];
  document.getElementById('timerDisplay').textContent = '00:00:00';
  document.getElementById('timerLaps').innerHTML = '';
}

function lapTimer() {
  if (!timerRunning && timerSeconds === 0) return;
  timerLaps.push(timerSeconds);
  const container = document.getElementById('timerLaps');
  const lapEl = document.createElement('div');
  lapEl.className = 'lap-item';
  lapEl.innerHTML = `
    <span class="lap-num">Lap ${timerLaps.length}</span>
    <span class="lap-time">${formatTime(timerSeconds)}</span>
  `;
  container.prepend(lapEl);
}

// ============= WATER TRACKER =============
function initWaterGlasses() {
  const container = document.getElementById('waterGlasses');
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const glass = document.createElement('div');
    glass.className = 'water-glass' + (i < appData.waterCount ? ' filled' : '');
    glass.onclick = () => setWater(i + 1);
    container.appendChild(glass);
  }
  document.getElementById('waterCount').textContent = appData.waterCount;
}

function setWater(count) {
  appData.waterCount = count;
  saveData(appData);
  initWaterGlasses();
  refreshDashboard();
  updateProgressRing();
  if (count >= 8) {
    showToast('💧 Amazing! You hit your water goal! Stay hydrated!', 'success');
  }
}

function addWater() {
  if (appData.waterCount >= 8) {
    showToast('You\'ve already hit your daily water goal! 🎉', 'info');
    return;
  }
  setWater(appData.waterCount + 1);
  showToast(`💧 Glass ${appData.waterCount} of 8 logged!`, 'success');
}

function resetWater() {
  appData.waterCount = 0;
  saveData(appData);
  initWaterGlasses();
  refreshDashboard();
  updateProgressRing();
  showToast('Water tracker reset', 'info');
}

// ============= WEIGHT LOG =============
function openWeightModal() {
  document.getElementById('weightDate').valueAsDate = new Date();
  document.getElementById('weightModal').classList.add('show');
}

function closeWeightModal() {
  document.getElementById('weightModal').classList.remove('show');
}

function saveWeight() {
  const date = document.getElementById('weightDate').value;
  const weight = parseFloat(document.getElementById('weightValue').value);

  if (!date || !weight || weight <= 0) {
    showToast('Please enter a valid date and weight', 'error');
    return;
  }

  appData.weightLog.push({ date, weight });
  appData.weightLog.sort((a, b) => new Date(b.date) - new Date(a.date));
  saveData(appData);
  closeWeightModal();
  renderWeightLog();
  showToast(`📊 Weight logged: ${weight} kg`, 'success');
}

function renderWeightLog() {
  const container = document.getElementById('weightEntries');
  if (appData.weightLog.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 20px; font-size: 13px;">No weight entries yet. Click "Log Weight" to start tracking!</p>';
    return;
  }

  container.innerHTML = appData.weightLog.slice(0, 10).map((entry, i, arr) => {
    const change = i < arr.length - 1 ? (entry.weight - arr[i + 1].weight).toFixed(1) : 0;
    const changeClass = change > 0 ? 'color: var(--danger)' : change < 0 ? 'color: var(--success)' : 'color: var(--text-muted)';
    const changeText = change > 0 ? `+${change} kg` : change < 0 ? `${change} kg` : '—';
    const formattedDate = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <div class="weight-entry">
        <span class="we-date">${formattedDate}</span>
        <span class="we-value">${entry.weight} kg</span>
        <span class="we-change" style="${changeClass}">${changeText}</span>
      </div>
    `;
  }).join('');
}

// ============= CHARTS =============
function renderCharts() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calories chart
  const calContainer = document.getElementById('caloriesChart');
  const maxCal = Math.max(...appData.weeklyCalories, 100);
  calContainer.innerHTML = appData.weeklyCalories.map((val, i) => {
    const pct = (val / maxCal) * 100;
    return `
      <div class="bar-wrapper">
        <div class="bar calories-bar" style="height: ${Math.max(pct, 2)}%;"></div>
        <div class="bar-label">${days[i]}</div>
      </div>
    `;
  }).join('');

  // Workouts chart
  const workContainer = document.getElementById('workoutsChart');
  const maxWork = Math.max(...appData.weeklyWorkoutMins, 10);
  workContainer.innerHTML = appData.weeklyWorkoutMins.map((val, i) => {
    const pct = (val / maxWork) * 100;
    return `
      <div class="bar-wrapper">
        <div class="bar workout-bar" style="height: ${Math.max(pct, 2)}%;"></div>
        <div class="bar-label">${days[i]}</div>
      </div>
    `;
  }).join('');
}

// ============= ACHIEVEMENTS =============
function renderAchievements() {
  const grid = document.getElementById('achievementsGrid');
  grid.innerHTML = achievements.map(ach => {
    let value = 0;
    switch (ach.type) {
      case 'workouts': value = appData.totalWorkouts; break;
      case 'water': value = appData.waterCount; break;
      case 'streak': value = appData.bestStreak; break;
      case 'calories': value = appData.totalCalories; break;
      case 'weightLogs': value = appData.weightLog.length; break;
    }
    const unlocked = value >= ach.threshold;
    return `
      <div class="achievement-card ${unlocked ? '' : 'locked'}">
        <span class="ach-icon">${ach.icon}</span>
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${unlocked ? ach.desc : '🔒 ' + ach.desc}</div>
      </div>
    `;
  }).join('');
}

// ============= PROFILE =============
function updateProfileStats() {
  document.getElementById('totalWorkouts').textContent = appData.totalWorkouts;
  document.getElementById('totalCalories').textContent = appData.totalCalories.toLocaleString();
  document.getElementById('bestStreak').textContent = appData.bestStreak;
  document.getElementById('totalMinutes').textContent = appData.totalMinutes;
}

function loadGoals() {
  document.getElementById('goalCalories').value = appData.calorieGoal;
  document.getElementById('goalWorkouts').value = appData.weeklyWorkouts;
  document.getElementById('goalWeight').value = appData.targetWeight;
}

function saveGoals() {
  appData.calorieGoal = parseInt(document.getElementById('goalCalories').value) || 2200;
  appData.weeklyWorkouts = parseInt(document.getElementById('goalWorkouts').value) || 5;
  appData.targetWeight = parseInt(document.getElementById('goalWeight').value) || 75;
  saveData(appData);
  updateCalorieSummary();
  showToast('🎯 Goals saved successfully!', 'success');
}

function toggleSetting(el) {
  el.classList.toggle('active');
  const isActive = el.classList.contains('active');
  showToast(isActive ? '✅ Setting enabled' : '❌ Setting disabled', 'info');
}

// ============= STREAK =============
function checkStreak() {
  const today = new Date().toDateString();
  if (appData.lastActiveDate !== today) {
    const lastDate = new Date(appData.lastActiveDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      appData.streak++;
    } else if (diffDays > 1) {
      appData.streak = 1;
    }

    appData.lastActiveDate = today;
    if (appData.streak > appData.bestStreak) {
      appData.bestStreak = appData.streak;
    }
    saveData(appData);
  }
}

// ============= TOAST NOTIFICATIONS =============
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  else if (type === 'error') icon = '❌';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============= KEYBOARD SHORTCUTS =============
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  switch (e.key) {
    case '1': navigate('dashboard'); break;
    case '2': navigate('workouts'); break;
    case '3': navigate('tools'); break;
    case '4': navigate('progress'); break;
    case '5': navigate('profile'); break;
    case 'Escape':
      closeExerciseModal();
      closeWeightModal();
      break;
  }
});

// Close modals on outside click
document.getElementById('exerciseModal').addEventListener('click', (e) => {
  if (e.target.id === 'exerciseModal') closeExerciseModal();
});

document.getElementById('weightModal').addEventListener('click', (e) => {
  if (e.target.id === 'weightModal') closeWeightModal();
});

// ============= SERVICE WORKER (PWA-ready) =============
if ('serviceWorker' in navigator) {
  // Ready for PWA when service worker file is added
  // navigator.serviceWorker.register('/sw.js');
}
