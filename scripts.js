/* ═══════════════════════════════════════════════════
   Ryan Stephens — shared scripts (all pages)
   Three small jobs: marquee loop, scroll reveals,
   and the local-time clock in the hero corner.
   ═══════════════════════════════════════════════════ */

// 1) seamless marquee: duplicate the content so it loops forever
const mq = document.getElementById('mq');
if (mq) mq.innerHTML += mq.innerHTML;

// 2) scroll reveals: add .in when an .rv element scrolls into view
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }
}, { threshold: 0.15 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// 3) local time (America/New_York — the coast's timezone, not the visitor's)
const lt = document.getElementById('localtime');
if (lt) {
  const tick = () => {
    lt.textContent = 'LOCAL — ' + new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit'
    });
  };
  tick();
  setInterval(tick, 15000);
}

// 4) project sort & filter (on projects.html and other.html)
(function() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;

  const list = document.querySelector('.project-list');
  if (!list) return;

  const articles = Array.from(list.querySelectorAll('article.project'));
  articles.forEach((el, i) => { el.dataset.origIndex = i; });

  const btns = bar.querySelectorAll('button');

  function setActive(btn) {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function apply() {
    const active = bar.querySelector('button.active');
    if (!active) return;

    const filter = active.dataset.filter;
    const sort = active.dataset.sort;

    let visible = [...articles];

    if (filter && filter !== 'all') {
      visible = visible.filter(a => a.dataset.category === filter);
    }

    if (sort === 'newest') {
      visible.sort((a, b) => {
        var da = a.dataset.date, db = b.dataset.date;
        if (da === 'ongoing' && db === 'ongoing') return 0;
        if (da === 'ongoing') return 1;
        if (db === 'ongoing') return -1;
        return db.localeCompare(da);
      });
    } else if (sort === 'oldest') {
      visible.sort((a, b) => {
        var da = a.dataset.date, db = b.dataset.date;
        if (da === 'ongoing' && db === 'ongoing') return 0;
        if (da === 'ongoing') return 1;
        if (db === 'ongoing') return -1;
        return da.localeCompare(db);
      });
    } else if (!filter || filter === 'all') {
      visible.sort((a, b) => parseInt(a.dataset.origIndex) - parseInt(b.dataset.origIndex));
    }

    articles.forEach(a => { a.style.opacity = '0'; a.style.transition = 'opacity .2s'; });
    setTimeout(function() {
      articles.forEach(a => a.remove());
      visible.forEach(a => list.appendChild(a));
      visible.forEach(function(a, i) {
        var no = a.querySelector('.no');
        if (no) no.textContent = String(i + 1).padStart(2, '0');
      });
      visible.forEach(a => { a.classList.remove('in'); });
      requestAnimationFrame(function() {
        visible.forEach(a => { a.classList.add('in'); a.style.opacity = '1'; });
      });
    }, 220);
  }

  btns.forEach(function(b) {
    b.addEventListener('click', function() {
      setActive(b);
      apply();
    });
  });
})();
