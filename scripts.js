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
