document.getElementById('logoVideo').addEventListener('ended', ()=>{
  document.getElementById('intro').style.display='none';
  const main = document.getElementById('mainContent');
  main.style.opacity = 1;
  initScrollEffects();
});
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
  },{threshold:0.4});
  sections.forEach(s=>obs.observe(s));
}
