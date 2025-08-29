/* MOTTO app.js — minimal, failsafe */

const ENABLE_AUDIO = false;
const ENABLE_8BIT  = false;

const PORTALS = [
  { id:'dealer',     label:'DEALER',     img:'assets/images/dealer.jpg',     s8:'assets/audio/8bit/dealer_8bit.mp3',     emo:'🎲' },
  { id:'skull',      label:'SKULL',      img:'assets/images/skull.jpg',      s8:'assets/audio/8bit/skull_8bit.mp3',      emo:'💀' },
  { id:'rockstar',   label:'ROCKSTAR',   img:'assets/images/rockstar.jpg',   s8:'assets/audio/8bit/rockstar_8bit.mp3',   emo:'🎸' },
  { id:'drag',       label:'DRAG',       img:'assets/images/drag.jpg',       s8:'assets/audio/8bit/drag_8bit.mp3',       emo:'👑' },
  { id:'military',   label:'MILITARY',   img:'assets/images/military.jpg',   s8:'assets/audio/8bit/military_8bit.mp3',   emo:'🪖' },
  { id:'motorcycle', label:'MOTORCYCLE', img:'assets/images/motorcycle.jpg', s8:'assets/audio/8bit/motorcycle_8bit.mp3', emo:'🏍️' },
  { id:'boxer',      label:'BOXER',      img:'assets/images/boxer.jpg',      s8:'assets/audio/8bit/boxer_8bit.mp3',      emo:'🥊' },
];

// (선택) OST 메타는 나중에 ENABLE_AUDIO 켤 때 사용
const OST_TRACKS = [
  { title:'Motto', url:'assets/audio/ost/motto.mp3', who:'all' },
];

function spawnPortals(){
  const stage = document.getElementById('stage');
  if(!stage) return;
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
    lb.className='label'; lb.textContent=p.label;
    el.appendChild(lb);

    if(ENABLE_8BIT){
      const s8 = new Audio(p.s8); s8.preload='auto'; s8.volume=0.9;
      el.addEventListener('mouseenter', ()=>{ s8.currentTime=0; s8.play().catch(()=>{}); });
      el.addEventListener('mouseleave', ()=> s8.pause());
    }
    stage.appendChild(el);
  });
}

function placeDOSN(){
  const dosn = document.getElementById('dosn');
  if(!dosn) return;
  const vw = window.innerWidth, vh = window.innerHeight;
  const x = Math.random()*(vw-120)+20;
  const y = Math.random()*(vh-40)+10;
  dosn.style.left = `${x}px`;
  dosn.style.top  = `${y}px`;
  setTimeout(()=> dosn.classList.add('show'), 1500 + Math.random()*1200);
}

/* ==== 가장 중요한 부분: 입장 함수 전역 노출 + 다중 바인딩 ==== */
function enterSite(){
  const intro = document.getElementById('intro');
  const main  = document.getElementById('main');
  if(intro) intro.style.display = 'none';
  if(main)  main.style.display  = 'block';
  console.log('ENTER → main shown');
}
window.__m_enter = enterSite; // 버튼 onClick 백업용

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded, JS ready!');

  // 플랫폼 링크
  const sp = document.getElementById('spBtn'); if(sp) sp.href = 'https://spotify.com';
  const yt = document.getElementById('ytBtn'); if(yt) yt.href = 'https://youtube.com';

  // 클릭/키보드 모두 바인딩
  const btn = document.getElementById('enterBtn');
  if(btn) btn.addEventListener('click', enterSite);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') enterSite(); });

  spawnPortals();
  placeDOSN();
  window.addEventListener('resize', spawnPortals);
});
