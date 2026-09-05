// Home page scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();

  // Produk rekomendasi di beranda (dari products.js)
  if (typeof renderProductsTo === 'function') {
    renderProductsTo('recommendedTemplates', { featuredOnly: true, limit: 6 });
  }
});

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  
  let current = 0;
  
  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }
  
  function next() {
    goTo((current + 1) % slides.length);
  }
  
  let timer = setInterval(next, 4500);
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.index));
      timer = setInterval(next, 4500);
    });
  });
}
