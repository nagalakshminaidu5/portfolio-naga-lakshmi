// ── PARTICLES ──
(function(){
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W, H, pts = [];
  function resize(){ W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for(let i = 0; i < 55; i++)
    pts.push({ x: Math.random()*9999, y: Math.random()*9999, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*1.5+.5, a: Math.random()*.5+.1 });
  function draw(){
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(123,92,255,${p.a})`; ctx.fill();
    });
    pts.forEach((a, i) => pts.slice(i+1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if(d < 120){
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,255,224,${.15*(1-d/120)})`; ctx.lineWidth = .5; ctx.stroke();
      }
    }));
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── TYPING EFFECT ──
(function(){
  const roles = ['Java Full Stack Developer','Spring Boot Developer','Web App Builder','Problem Solver'];
  let ri = 0, ci = 0, typing = true;
  const el = document.getElementById('typed-text');
  function tick(){
    const cur = roles[ri];
    if(typing){
      if(ci < cur.length){ el.textContent = cur.slice(0, ++ci); setTimeout(tick, 80); }
      else { typing = false; setTimeout(tick, 1800); }
    } else {
      if(ci > 0){ el.textContent = cur.slice(0, --ci); setTimeout(tick, 40); }
      else { ri = (ri+1) % roles.length; typing = true; setTimeout(tick, 200); }
    }
  }
  tick();
})();

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.background =
    window.scrollY > 50 ? 'rgba(10,10,15,0.92)' : 'transparent';
});

function toggleMenu(){
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('nav-links').classList.toggle('open');
}

function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('nav-links').classList.remove('open');
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── XP BARS ──
const xpObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.xp-prog').forEach(b => { b.style.width = b.dataset.pct + '%'; });
      xpObs.unobserve(e.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.skill-xp').forEach(el => xpObs.observe(el));

// ── TOAST ──
let toastTimer;
function showToast(title, msg){
  const t = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ── ACHIEVEMENTS ──
const unlocked = new Set();
const achDefs = {
  coder:     { title: '🏆 Code Warrior Unlocked!', msg: 'You explored my projects!' },
  networker: { title: '🏆 Networker Unlocked!',   msg: 'Ready to connect!' },
  learner:   { title: '🏆 Scholar Unlocked!',      msg: 'Knowledge is power!' },
  explorer:  { title: '🏆 Explorer Unlocked!',     msg: "You've seen everything!" },
  champion:  { title: '🏆 Champion Unlocked!',     msg: 'State-level Volleyball Winner!' },
  fullstack: { title: '🏆 Full Stack Unlocked!',   msg: 'You know the full stack!' },
};
const sectionAch = { projects: 'coder', contact: 'networker', education: 'learner', skills: 'fullstack' };
let sectionsVisited = new Set();

function unlockAch(id){
  if(unlocked.has(id)) return;
  unlocked.add(id);
  const badge = document.querySelector(`.ach-badge[data-id="${id}"]`);
  if(badge){ badge.classList.remove('locked'); badge.classList.add('unlocked'); }
  const def = achDefs[id];
  if(def) showToast(def.title, def.msg);
  document.getElementById('ach-count').textContent = unlocked.size;
  updateHUD();
}

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const id = e.target.id;
      if(sectionAch[id]) unlockAch(sectionAch[id]);
      sectionsVisited.add(id);
      if(sectionsVisited.size >= 5) unlockAch('explorer');
    }
  });
}, { threshold: .3 });

['about','skills','education','projects','experience','contact'].forEach(id => {
  const el = document.getElementById(id);
  if(el) secObs.observe(el);
});

// champion unlocks automatically (real achievement)
setTimeout(() => unlockAch('champion'), 2000);

// ── HUD / XP ──
function updateHUD(){
  const xp = unlocked.size * 100 + Math.min(sectionsVisited.size * 50, 300);
  const maxXp = 1000;
  const lvl = Math.floor(xp / 200) + 1;
  document.getElementById('xp-fill').style.width = Math.min(xp / maxXp * 100, 100) + '%';
  document.getElementById('xp-num').textContent = xp + ' / ' + maxXp;
  const levels = ['Initializing...','Junior Dev','Mid Dev','Senior Dev','Tech Lead','Full Stack Hero'];
  document.getElementById('hud-level').textContent = `LVL ${lvl} — ${levels[Math.min(lvl, 5)]}`;
}
updateHUD();
setInterval(() => { if(sectionsVisited.size > 0) updateHUD(); }, 2000);

// ── CONTACT FORM ──
function sendMsg(){
  const n = document.getElementById('cf-name').value;
  const e = document.getElementById('cf-email').value;
  const m = document.getElementById('cf-msg').value;
  if(!n || !e || !m){ showToast('⚠️ Oops!', 'Please fill all fields.'); return; }
  document.getElementById('sent-msg').style.display = 'block';
  document.getElementById('cf-name').value = '';
  document.getElementById('cf-email').value = '';
  document.getElementById('cf-msg').value = '';
  unlockAch('networker');
  showToast('✅ Message Sent!', "I'll get back to you soon!");
  setTimeout(() => document.getElementById('sent-msg').style.display = 'none', 5000);
}

// welcome toast
setTimeout(() => showToast('👾 Welcome!', 'Scroll to unlock achievements!'), 1200);