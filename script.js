// 1) Intro GIF 5초 후 숨기고 본문 fade-in
window.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(()=>{
    document.getElementById('intro').style.display = 'none';
    document.getElementById('mainContent').style.opacity = 1;
    initScrollEffects();
  }, 5000);
});

// 2) 스크롤 트리거 & 오디오 재생
function initScrollEffects(){
  const sections = document.querySelectorAll('.section');
  const sfx = document.getElementById('sfx');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('main-active');
        const src = entry.target.dataset.audio;
        if(src){ sfx.src = src; sfx.play(); }
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s=>obs.observe(s));
}
