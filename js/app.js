(() => {
  'use strict';

  // ===== DEV TOGGLES =====
  const ENABLE_AUDIO = false;   // 지금은 소리 끔
  const ENABLE_8BIT  = false;   // 8bit hover 효과 끔

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

  const SPOTIFY_URL = 'https://spotify.com';
  const YOUTUBE_URL = 'https://youtube.com';

  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded, JS ready!');

    // DOM 참조
    const intro    = document.getElementById('intro');
    const enterBtn = document.getElementById('enterBtn');
    const main     = document.getElementById('main');
    const stage    = document.getElementById('stage');
    const dosn     = document.getElementById('dosn');

    // 외부 링크 부착
    const spBtn = document.getElementById('spBtn');
    const ytBtn = document.getElementById('ytBtn');
    if (spBtn) spBtn.href = SPOTIFY_URL;
    if (ytBtn) ytBtn.href = YOUTUBE_URL;

    // Intro → Main
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        console.log('✅ ENTER 눌림, intro → main');
        if (intro) intro.style.display = 'none';
        if (main)  main.style.display  = 'block';
      });
    }

    // 랜덤 포털
    function spawnPortals(){
      if (!stage) return;
      stage.innerHTML = '';
      const vw = window.innerWidth, vh = window.innerHeight;

      PORTALS.forEach(p => {
        const el = document.createElement('a');
        el.href = `character.html?id=${p.id}`;
        el.className = 'portal';
        el.dataset.id = p.id;

        const probe = new Image();
        probe.onload  = () => el.style.backgroundImage = `url(${p.img})`;
        probe.onerror = () => el.classList.add('placeholder');
        probe.src = p.img;

        const padX = Math.min(120, vw*0.1), padY = Math.min(100, vh*0.12);
        const x = Math.random()*(vw - padX*2) + padX;
        const y = Math.random()*(vh - padY*2) + padY;
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;

        const lb = document.createElement('div');
        lb.className = 'label';
        lb.textContent = p.label;
        el.appendChild(lb);

        if (ENABLE_8BIT){
          const s8 = new Audio(p.s8); s8.preload='auto'; s8.volume=0.9;
          el.addEventListener('mouseenter', ()=>{ s8.currentTime=0; s8.play().catch(()=>{}); });
          el.addEventListener('mouseleave', ()=> s8.pause());
        }

        stage.appendChild(el);
      });
    }

    // DOSN 위치 랜덤
    function placeDOSN(){
      if (!dosn) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const x = Math.random()*(vw-120)+20;
      const y = Math.random()*(vh-40)+10;
      dosn.style.left = `${x}px`;
      dosn.style.top  = `${y}px`;
      setTimeout(()=> dosn.classList.add('show'), 1500 + Math.random()*1200);
    }

    window.addEventListener('resize', spawnPortals);
    spawnPortals();
    placeDOSN();
  });

})();
