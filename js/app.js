// ===== DEV TOGGLES =====
const ENABLE_AUDIO  = false;  // MP3 넣기 전 false
const ENABLE_8BIT   = false;  // 8bit 넣기 전 false
const ENABLE_TEASER = false;  // teaser.mp4 없으면 false

// ----- Config ----- //
const PORTALS = [
  { id:'dealer',     label:'DEALER',     img:'assets/images/dealer.jpg',     s8:'assets/audio/8bit/dealer_8bit.mp3',     emo:'🎲' },
  { id:'skull',      label:'SKULL',      img:'assets/images/skull.jpg',      s8:'assets/audio/8bit/skull_8bit.mp3',      emo:'💀' },
  { id:'rockstar',   label:'ROCKSTAR',   img:'assets/images/rockstar.jpg',   s8:'assets/audio/8bit/rockstar_8bit.mp3',   emo:'🎸' },
  { id:'drag',       label:'DRAG',       img:'assets/images/drag.jpg',       s8:'assets/audio/8bit/drag_8bit.mp3',       emo:'👑' },
  { id:'military',   label:'MILITARY',   img:'assets/images/military.jpg',   s8:'assets/audio/8bit/military_8bit.mp3',   emo:'🪖' },
  { id:'motorcycle', label:'MOTORCYCLE', img:'assets/images/motorcycle.jpg', s8:'assets/audio/8bit/motorcycle_8bit.mp3', emo:'🏍️' },
  { id:'boxer',      label:'BOXER',      img:'assets/images/boxer.jpg',      s8:'assets/audio/8bit/boxer_8bit.mp3',      emo:'🥊' },
];

const OST_TRACKS = [
  { title:'Motto',            url:'assets/audio/ost/motto.mp3',            who:'all' },
  { title:'Skull Anthem',     url:'assets/audio/ost/skull_anthem.mp3',     who:'skull' },
  { title:'Dealer Code',      url:'assets/audio/ost/dealer_code.mp3',      who:'dealer' },
  { title:'Rockstar Riot',    url:'assets/audio/ost/rockstar_riot.mp3',    who:'rockstar' },
  { title:'Drag Oracle',      url:'assets/audio/ost/drag_oracle.mp3',      who:'drag' },
  { title:'Military Will',    url:'assets/audio/ost/military_will.mp3',    who:'military' },
  { title:'Motorcycle Rush',  url:'assets/audio/ost/motorcycle_rush.mp3',  who:'motorcycle' },
];

// External links
const SPOTIFY_URL    = '#';
const YOUTUBE_URL    = '#';
const SOUNDCLOUD_URL = '#';

// DOM
const intro     = document.getElementById('intro');
const enterBtn  = document.getElementById('enterBtn');
const stage     = document.getElementById('stage');
const dosn      = document.getElementById('dosn');
const nowUI     = document.getElementById('nowPlaying');
const audioUI   = document.getElementById('audio-ui');
const vol       = document.getElementById('vol');
const muteBtn   = document.getElementById('muteBtn');

// 링크 부착
document.getElementById('spBtn').href = SPOTIFY_URL;
document.getElementById('ytBtn').href = YOUTUBE_URL;

// Intro 액션
enterBtn?.addEventListener('click', async () => {
  intro.classList.add('fade');
  if(ENABLE_AUDIO) await startOST();
  setTimeout(()=> intro.remove(), 180);
});

// ----- OST (enable일 때만) -----
let A, B, active, idle, queue=[], currentIndex=-1;
function setVolume(v){ [A,B].forEach(a=> a && (a.volume = v)); }

async function startOST(){
  audioUI.hidden = false; nowUI.hidden = false;
  A = new Audio(); B = new Audio(); active = A; idle = B;
  [A,B].forEach(a=>{ a.preload='auto'; a.loop=false; a.crossOrigin='anonymous'; a.volume=parseFloat(vol.value) });

  const first = !localStorage.getItem('motto_first_visited');
  localStorage.setItem('motto_first_visited','1');

  queue = OST_TRACKS.slice();
  for(let i=queue.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [queue[i],queue[j]]=[queue[j],queue[i]]; }
  if(first){
    const idx = queue.findIndex(t=>t.title.toLowerCase()==='motto');
    if(idx>0){ [queue[0], queue[idx]] = [queue[idx], queue[0]]; }
  }
  currentIndex = -1;
  playNext();
}

function playNext(){
  currentIndex = (currentIndex+1) % queue.length;
  const meta = queue[currentIndex];

  if(!idle){ idle = new Audio(); idle.preload='auto'; idle.crossOrigin='anonymous'; }
  idle.src = meta.url; idle.currentTime=0; idle.volume=0;
  idle.play().catch(()=>{});

  const fadeDur = 3000, steps=30, stepMs=fadeDur/steps;
  let c = 0;
  const targetVol = parseFloat(vol.value);
  const timer = setInterval(()=>{
    c++;
    const t = c/steps;
    active && (active.volume = targetVol*(1-t));
    idle.volume = targetVol*t;
    if(c>=steps){
      clearInterval(timer);
      active && active.pause();
      [active, idle] = [idle, active];
      updateNow(meta);
    }
  }, stepMs);

  idle.onended = () => playNext();
}

function updateNow(meta){
  const p = PORTALS.find(pp => pp.id === (meta.who||''));
  const icon = p?.emo || '♪';
  nowUI.textContent = `Now Playing: [${icon} ${meta.title}]`;
  document.querySelectorAll('.portal').forEach(el=>{
    if(el.dataset.id === p?.id){ el.classList.add('glow'); setTimeout(()=>el.classList.remove('glow'), 1500); }
  });
}

vol?.addEventListener('input', e => setVolume(parseFloat(e.target.value)));
muteBtn?.addEventListener('click', ()=>{
  const m = !(A?.muted); [A,B].forEach(a=> a && (a.muted = m));
  muteBtn.textContent = m ? '🔇' : '🔊';
});

// ----- Random portals -----
function spawnPortals(){
  stage.innerHTML = '';
  const vw = window.innerWidth, vh = window.innerHeight;
  PORTALS.forEach(p=>{
    const el = document.createElement('a');
    el.href = `character.html?id=${p.id}`;
    el.className = 'portal'; el.dataset.id = p.id;

    const probe = new Image();
    probe.onload = ()=> el.style.backgroundImage = `url(${p.img})`;
    probe.onerror = ()=> el.classList.add('placeholder');
    probe.src = p.img;

    const padX = Math.min(120, vw*0.1), padY = Math.min(100, vh*0.12);
    const x = Math.random()*(vw - padX*2) + padX;
    const y = Math.random()*(vh - padY*2) + padY;
    el.style.left = `${x}px`; el.style.top = `${y}px`;

    const lb = document.createElement('div');
    lb.className='label'; lb.textContent=p.label; el.appendChild(lb);

    if(ENABLE_8BIT){
      const s8 = new Audio(p.s8); s8.preload='auto'; s8.volume=0.9;
      el.addEventListener('mouseenter', ()=>{ s8.currentTime=0; s8.play().catch(()=>{}); });
      el.addEventListener('mouseleave', ()=> s8.pause());
    }
    stage.appendChild(el);
  });
}
window.addEventListener('resize', spawnPortals);

// DOSN egg
function placeDOSN(){
  const vw = window.innerWidth, vh = window.innerHeight;
  const x = Math.random()*(vw-120)+20;
  const y = Math.random()*(vh-40)+10;
  const dosn = document.getElementById('dosn');
  dosn.style.left = `${x}px`; dosn.style.bottom = `auto`; dosn.style.top = `${y}px`;
  setTimeout(()=> dosn.classList.add('show'), 1500 + Math.random()*1200);
}

// Teaser 옵션
const teaserModal = document.getElementById('teaserModal');
function closeTeaser(){ if(!teaserModal) return; teaserModal.hidden=true; const v=document.getElementById('teaserVideo'); v&&v.pause(); }
teaserModal?.addEventListener('click', (e)=>{ if(e.target.dataset.close!==undefined) closeTeaser(); });
if(!ENABLE_TEASER && teaserModal){ teaserModal.remove(); }

// Boot
spawnPortals(); placeDOSN();
document.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && document.getElementById('intro')) enterBtn.click(); });
if(ENABLE_AUDIO){ document.getElementById('audio-ui').hidden=false; document.getElementById('nowPlaying').hidden=false; }

// Intro → Main 전환 (에러 방지 버전)
document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enterBtn");
  const intro = document.getElementById("intro");
  const main = document.getElementById("main");

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      console.log("ENTER clicked ✅"); // 확인용
      if (intro) intro.style.display = "none";   // intro 숨김
      if (main) main.style.display = "block";    // main 표시
    });
  } else {
    console.warn("ENTER button not found");
  }
});
