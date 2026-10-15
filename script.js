// ========== CAROUSEL LOGIC ==========
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const slides = track.querySelectorAll('.slide');
const totalSlides = slides.length;

let currentSlide = 0;

// Generate dots
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('.dot');

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  // Show/hide nav buttons
  prevBtn.classList.toggle('hidden', currentSlide === 0);
  nextBtn.classList.toggle('hidden', currentSlide === totalSlides - 1);

  // Animate progress bars when content slide is shown
  if (currentSlide === 3) { // Content Marketing slide
    animateProgressBars();
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  updateCarousel();
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateCarousel();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateCarousel();
  }
}

// Button listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
});

// ========== TOUCH / SWIPE ==========
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  isSwiping = true;
}, { passive: true });

track.addEventListener('touchend', (e) => {
  if (!isSwiping) return;
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
  isSwiping = false;
});

// Mouse drag support
let mouseStartX = 0;
let isDragging = false;

track.addEventListener('mousedown', (e) => {
  mouseStartX = e.clientX;
  isDragging = true;
  track.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  const diff = mouseStartX - e.clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
  isDragging = false;
  track.style.cursor = 'grab';
});

track.style.cursor = 'grab';

// ========== PROGRESS BAR ANIMATION ==========
function animateProgressBars() {
  const bars = slides[3].querySelectorAll('.progress-fill');
  bars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// ========== LIKE & SAVE ==========
const likeBtn = document.getElementById('likeBtn');
const saveBtn = document.getElementById('saveBtn');
const likeCount = document.getElementById('likeCount');

let isLiked = false;
let isSaved = false;
let likes = 2847;

likeBtn.addEventListener('click', () => {
  isLiked = !isLiked;
  likeBtn.classList.toggle('liked', isLiked);
  likes += isLiked ? 1 : -1;
  likeCount.textContent = likes.toLocaleString();
});

saveBtn.addEventListener('click', () => {
  isSaved = !isSaved;
  saveBtn.classList.toggle('saved', isSaved);
});

// Double-tap to like
let lastTap = 0;
track.addEventListener('click', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) {
    if (!isLiked) {
      isLiked = true;
      likeBtn.classList.add('liked');
      likes++;
      likeCount.textContent = likes.toLocaleString();
    }
    // Show heart animation
    showHeartAnimation(e);
  }
  lastTap = now;
});

function showHeartAnimation(e) {
  const heart = document.createElement('div');
  heart.innerHTML = '❤️';
  heart.style.cssText = `
    position: absolute;
    font-size: 64px;
    pointer-events: none;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: heart-burst 0.8s ease forwards;
  `;

  // Add animation keyframes if not yet added
  if (!document.getElementById('heart-anim-style')) {
    const style = document.createElement('style');
    style.id = 'heart-anim-style';
    style.textContent = `
      @keyframes heart-burst {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const container = track.closest('.carousel-container');
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 800);
}

// Initial state
updateCarousel();
