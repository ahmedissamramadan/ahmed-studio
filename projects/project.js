/* project.js — shared gallery + lightbox + filter logic */

const items = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex = 0;
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-caption');

function openLightbox(index) {
  const visible = items.filter(i => i.style.display !== 'none');
  if (!visible[index]) return;
  currentIndex = index;
  lbImg.src = visible[index].querySelector('img').src;
  lbCap.textContent = visible[index].dataset.label || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function navigate(dir) {
  const visible = items.filter(i => i.style.display !== 'none');
  currentIndex = (currentIndex + dir + visible.length) % visible.length;
  lbImg.src = visible[currentIndex].querySelector('img').src;
  lbCap.textContent = visible[currentIndex].dataset.label || '';
}

items.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visible = items.filter(it => it.style.display !== 'none');
    const idx = visible.indexOf(item);
    openLightbox(idx >= 0 ? idx : i);
  });
});

document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', () => navigate(-1));
document.getElementById('lbNext')?.addEventListener('click', () => navigate(1));
lb?.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(1);
  if (e.key === 'ArrowRight') navigate(-1);
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    let shown = 0;
    items.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      item.style.display = match ? 'block' : 'none';
      if (match) shown++;
    });
    const countEl = document.getElementById('count');
    if (countEl) countEl.textContent = shown + ' asset';
  });
});
