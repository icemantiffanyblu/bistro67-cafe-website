(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);

const { CAFE, MENU } = window.BISTRO67;
const tbc = () => '<span class="tbc">To be confirmed</span>';
$$('.cityTag').forEach(t => t.textContent = CAFE.city ? ' / ' + CAFE.city : '');
$('#cAddress').innerHTML = CAFE.address ? CAFE.address.replace(/</g, '&lt;') : tbc('Address');
$('#cMaps').innerHTML = CAFE.mapsUrl ? `<a href="${CAFE.mapsUrl}" target="_blank" rel="noopener" style="font-weight:700">Directions</a>` : '';
$('#cPhone').innerHTML = CAFE.phone ? `<a href="tel:${CAFE.phone.replace(/\s/g, '')}">${CAFE.phone}</a>` : tbc('Phone');
$('#cInsta').innerHTML = CAFE.instagram ? `<a href="https://www.instagram.com/${CAFE.instagram}/" target="_blank" rel="noopener">@${CAFE.instagram}</a>` : tbc('Instagram');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const row = ([n, p, d]) => `<li><span class="row"><span>${esc(n)}</span><span class="dots" aria-hidden="true"></span><span class="p">₹${p}</span></span>${d ? `<span class="d">${esc(d)}</span>` : ''}</li>`;
$$('[data-cat]').forEach(ul => ul.innerHTML = MENU[ul.dataset.cat][1].map(row).join(''));
const rest = ['iced', 'coolers', 'bites', 'pizza', 'desserts'];
$('#full').innerHTML = rest.map((k, i) => `<div class="col"><h3><span class="n">${String(i + 3).padStart(2, '0')}</span>${MENU[k][0]}</h3><ul class="items">${MENU[k][1].map(row).join('')}</ul></div>`).join('')
  + `<figure class="photo"><img src="assets/photo/fries-800.webp" alt="Fries in wire baskets beside an iced coffee on a wooden tray" width="800" height="800" loading="lazy" decoding="async"></figure>`;
const total = Object.values(MENU).reduce((s, c) => s + c[1].length, 0);
const moreBtn = $('#moreBtn'), full = $('#full');
const setMore = () => moreBtn.textContent = full.hidden ? `Full menu · ${total} items` : 'Close full menu';
setMore();
moreBtn.addEventListener('click', () => {
  full.hidden = !full.hidden; moreBtn.setAttribute('aria-expanded', String(!full.hidden)); setMore();
  if (!full.hidden && hasGsap && !reduce) gsap.from($$('.col', full), { y: 24, opacity: 0, duration: .7, ease: 'power3.out', stagger: .06 });
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});

/* ===== order list (preview) ===== */
const qty = {};
const sheet = $('#order'), scrim = $('#scrim'), body = $('#orderBody');
const keyOf = (c, i) => c + ':' + i;
body.innerHTML = Object.entries(MENU).map(([c, [label, items]]) => `<h3>${label}</h3>` + items.map(([n, p], i) =>
  `<div class="oi"><span>${esc(n)}<span class="p">₹${p}</span></span><span class="step"><button type="button" data-k="${keyOf(c, i)}" data-d="-1" aria-label="One fewer ${esc(n)}" disabled>−</button><output data-q="${keyOf(c, i)}">0</output><button type="button" data-k="${keyOf(c, i)}" data-d="1" aria-label="One more ${esc(n)}">+</button></span></div>`).join('')).join('');
function itemFor(k) { const [c, i] = k.split(':'); return MENU[c][1][+i]; }
function renderOrder() {
  let sum = 0, n = 0; const lines = [];
  Object.entries(qty).forEach(([k, q]) => { if (!q) return; const [name, p] = itemFor(k); sum += q * p; n += q; lines.push(`${q} × ${name} — ₹${q * p}`); });
  $$('output[data-q]', body).forEach(o => { const q = qty[o.dataset.q] || 0; o.textContent = q; o.previousElementSibling.disabled = q === 0; });
  $('#orderTotal').textContent = '₹' + sum.toLocaleString('en-IN');
  $$('.bar .count').forEach(c => c.textContent = n ? n : '');
  $('#orderText').textContent = lines.length ? `Bistro 67 order list\n${lines.join('\n')}\nTotal ₹${sum}` : '';
}
body.addEventListener('click', e => {
  const b = e.target.closest('button[data-k]'); if (!b) return;
  qty[b.dataset.k] = Math.max(0, (qty[b.dataset.k] || 0) + +b.dataset.d); renderOrder();
});
let lastFocus = null;
function openOrder(open) {
  sheet.classList.toggle('open', open); scrim.classList.toggle('open', open);
  sheet.setAttribute('aria-hidden', String(!open)); $$('[data-open-order]').forEach(b => b.setAttribute('aria-expanded', String(open)));
  if (open) { lastFocus = document.activeElement; $('#closeOrder').focus(); lenis && lenis.stop(); }
  else { lenis && lenis.start(); lastFocus && lastFocus.focus(); }
}
$$('[data-open-order]').forEach(b => b.addEventListener('click', () => openOrder(true)));
$('#closeOrder').addEventListener('click', () => openOrder(false));
scrim.addEventListener('click', () => openOrder(false));
document.addEventListener('keydown', e => {
  if (!sheet.classList.contains('open')) return;
  if (e.key === 'Escape') openOrder(false);
  if (e.key === 'Tab') { const f = $$('button:not([disabled])', sheet); const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
});
$('#clearOrder').addEventListener('click', () => { Object.keys(qty).forEach(k => delete qty[k]); renderOrder(); $('#orderStatus').textContent = 'Cleared.'; });
$('#copyOrder').addEventListener('click', () => {
  const t = $('#orderText').textContent, st = $('#orderStatus');
  if (!t) { st.textContent = 'Add something first.'; return; }
  const fallback = () => { const pre = $('#orderText'); pre.classList.remove('sr'); const r = document.createRange(); r.selectNodeContents(pre); getSelection().removeAllRanges(); getSelection().addRange(r); st.textContent = 'Selected. Press Ctrl/⌘ + C to copy.'; };
  try { navigator.clipboard.writeText(t).then(() => st.textContent = 'Copied to clipboard.', fallback); } catch (_) { fallback(); }
});
renderOrder();

/* ===== hero frame sequence on canvas ===== */
const SEQ = { count: 96, path: i => `assets/hero/seq/cup_${String(i + 1).padStart(4, '0')}.webp`,
  frameW: 1320, frameH: 1080, cupW: 365, cupH: 607, cupBottom: 1044, cupX: 660, focus: [660, 470] };
const stage = $('#poster'), canvas = $('#seq'), ctx = canvas.getContext('2d');
const seq = { imgs: new Array(SEQ.count), ok: new Array(SEQ.count).fill(false), p: 0, zoom: 1, drawn: '' };
function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr);
  seq.drawn = ''; render();
}
function nearest(i) { for (let d = 0; d < SEQ.count; d++) { if (seq.ok[i - d]) return i - d; if (seq.ok[i + d]) return i + d; } return -1; }
function render() {
  const i = nearest(Math.round(seq.p * (SEQ.count - 1)));
  if (i < 0) return;
  const key = i + '|' + seq.zoom.toFixed(3) + '|' + canvas.width;
  if (key === seq.drawn) return; seq.drawn = key;
  const cw = canvas.width, ch = canvas.height, mobile = cw / ch < .9;
  // scale so the cup reads at a set share of the screen, whatever the viewport
  let s = mobile ? Math.min((ch * .4) / SEQ.cupH, (cw * .52) / SEQ.cupW) : (ch * .64) / SEQ.cupH;
  const cx = cw * (mobile ? .46 : .5), by = ch * (mobile ? .74 : .95);
  let x = cx - SEQ.cupX * s, y = by - SEQ.cupBottom * s;
  if (seq.zoom !== 1) { const fx = x + SEQ.focus[0] * s, fy = y + SEQ.focus[1] * s; s *= seq.zoom; x = fx - SEQ.focus[0] * s; y = fy - SEQ.focus[1] * s; }
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(seq.imgs[i], x, y, SEQ.frameW * s, SEQ.frameH * s);
}
(function load() {
  const order = [], seen = new Set();
  [32, 16, 8, 4, 2, 1].forEach(step => { for (let i = 0; i < SEQ.count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); } });
  let next = 0;
  const pump = () => {
    if (next >= order.length) return;
    const i = order[next++], img = new Image(); img.decoding = 'async';
    img.onload = () => { seq.imgs[i] = img; seq.ok[i] = true; if (i === 0) sizeCanvas(); else { seq.drawn = ''; render(); } pump(); };
    img.onerror = pump; img.src = SEQ.path(i);
  };
  for (let k = 0; k < 6; k++) pump();
})();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(sizeCanvas, 120); });

/* ===== anchors ===== */
let lenis = null;
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = $(a.getAttribute('href')); if (!t) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(t, { duration: 1.6 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
});

/* film: play only on screen, never under reduced motion */
const film = $('#film');
const filmOn = on => { if (reduce) return; if (on) { film.preload = 'auto'; film.play().catch(() => {}); } else film.pause(); };
if (!hasGsap) {
  new IntersectionObserver(es => es.forEach(e => filmOn(e.isIntersecting))).observe($('.made'));
  return;
}
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('canvas-bg');
if (!reduce && window.Lenis) {
  lenis = new Lenis({ lerp: .085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* one canvas colour for the whole page */
const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const COLORS = { cream: tok('--cream') || '#F2E9DC', espresso: tok('--esp') || '#25120C' };  // read from css/styles.css
const bar = $('#top');
const paint = name => { gsap.to(document.body, { backgroundColor: COLORS[name], duration: reduce ? 0 : .9, ease: 'power2.out', overwrite: true }); bar.classList.toggle('dark', name === 'espresso'); };

if (reduce) { $$('[data-bg]').forEach(s => { if (s === stage) return;
  ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onEnter: () => paint(s.dataset.bg), onEnterBack: () => paint(s.dataset.bg) }); });
  ScrollTrigger.create({ trigger: stage, start: 'top top', end: 'bottom 55%', onEnterBack: () => paint('cream') });
  ScrollTrigger.create({ trigger: '.made', start: 'top bottom', end: 'bottom top', onToggle: s => filmOn(s.isActive) });
  return; }

/* ===== 01 → 02: the cup owns the moment ===== */
gsap.timeline({ scrollTrigger: {
    trigger: stage, start: 'top top', end: () => '+=' + innerHeight * (innerWidth <= 720 ? 3 : 3.4),
    pin: true, scrub: 1.1, invalidateOnRefresh: true,
    onUpdate: self => bar.classList.toggle('dark', self.progress >= .92),
    onEnterBack: () => paint('cream'), onLeaveBack: () => paint('cream')
  }, defaults: { ease: 'none' } })
  .to('.h-not', { yPercent: -40, opacity: 0, duration: .16, ease: 'power2.in' }, .06)
  .to('.h-usual', { yPercent: 40, opacity: 0, duration: .16, ease: 'power2.in' }, .08)
  .to(['.h-anno', '.h-note', '.h-cue'], { opacity: 0, duration: .08 }, .05)
  .to('.bean.near', { y: () => innerHeight * .25, opacity: 0, duration: .2, ease: 'power1.in' }, .05)
  .to('.bean.far', { opacity: 0, duration: .1 }, .1)
  .to(seq, { p: 1, duration: .66, onUpdate: render }, .12)
  .to(seq, { zoom: 5.5, duration: .2, ease: 'power2.in', onUpdate: render }, .78)
  .to('.flood', { opacity: 1, duration: .08, ease: 'power1.in' }, .9)
  .to({}, { duration: .02 }, .98);

/* section colours and film playback, measured after the hero pin exists */
ScrollTrigger.create({ trigger: '.made', start: 'top bottom', end: 'bottom top', onToggle: s => filmOn(s.isActive) });
$$('[data-bg]').forEach(s => { if (s === stage) return;
  ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onEnter: () => paint(s.dataset.bg), onEnterBack: () => paint(s.dataset.bg) }); });

/* ===== 03: the drink surfaces out of the dark ===== */
gsap.fromTo('.sig-photo img', { scale: 1.12, filter: 'brightness(.3)' }, { scale: 1, filter: 'brightness(1)', ease: 'power2.out',
  scrollTrigger: { trigger: '.sig', start: 'top 85%', end: 'center 55%', scrub: 1 } });
gsap.fromTo('.sig-word.l', { xPercent: -8 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.sig', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.fromTo('.sig-word.r', { xPercent: 8 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.sig', start: 'top bottom', end: 'bottom top', scrub: true } });

/* ===== 04: menu lines set like type on a press ===== */
$$('.spread .items').forEach(ul => gsap.from(ul.children, { y: 14, opacity: 0, duration: .6, ease: 'power3.out', stagger: .035,
  scrollTrigger: { trigger: ul, start: 'top 85%', once: true } }));

/* ===== 05: two words, one cut ===== */
gsap.timeline({ scrollTrigger: { trigger: '.made', start: 'top top', end: 'bottom bottom', scrub: .6 } })
  .to('.made-line.one', { opacity: 0, duration: .06 }, .48)
  .to('.made-line.two', { opacity: 1, duration: .06 }, .52);

/* ===== photographs settle slowly inside their crops ===== */
$$('.day .photo img, .corner .photo img, .menu .photo.main img, .visit .photo img').forEach(m => {
  gsap.fromTo(m, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: m.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
});

addEventListener('load', () => ScrollTrigger.refresh());
if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
