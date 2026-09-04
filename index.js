// Home page scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
});

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  
  let current = 0;
  const total = slides.length;
  
  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  
  function next() {
    goTo((current + 1) % total);
  }
  
  // Auto slide
  let timer = setInterval(next, 4500);
  
  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.index));
      timer = setInterval(next, 4500);
    });
  });
}
