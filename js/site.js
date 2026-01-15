(() => {
  const links = window.MOTTO_LINKS || {};
  const applyLink = (el, url) => {
    if (!el || !url) return;
    el.href = url;
    if (url === '#') {
      el.classList.add('disabled');
      el.setAttribute('aria-disabled', 'true');
    } else {
      el.classList.remove('disabled');
      el.removeAttribute('aria-disabled');
    }
  };

  [
    { id: 'twBtn', key: 'twitter' },
    { id: 'igBtn', key: 'instagram' },
    { id: 'ttBtn', key: 'tt' },
    { id: 'shopBtn', key: 'shop' }
  ].forEach(({ id, key }) => applyLink(document.getElementById(id), links[key]));

  [
    { id: 'musicSpotify', key: 'spotify' },
    { id: 'musicYouTube', key: 'youtube' },
    { id: 'musicApple', key: 'apple' },
    { id: 'musicSoundCloud', key: 'soundcloud' }
  ].forEach(({ id, key }) => applyLink(document.getElementById(id), links[key]));

  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const setNavOpen = (open) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.contains('nav-open');
    setNavOpen(!isOpen);
  });
  navLinks?.addEventListener('click', (e) => {
    if (!e.target.closest('a')) return;
    setNavOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setNavOpen(false);
  });
})();
