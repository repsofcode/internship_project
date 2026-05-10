
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const hambIcon  = document.getElementById('hambIcon');

hamburger.addEventListener('click', function () {
  navLinks.classList.toggle('open');
  hambIcon.className = navLinks.classList.contains('open')
    ? 'fa fa-times'
    : 'fa fa-bars';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    if (window.innerWidth <= 600) {
      // Don't close if it's the Services dropdown trigger
      if (this.closest('.has-drop') && !this.closest('.dropdown')) return;
      navLinks.classList.remove('open');
      hambIcon.className = 'fa fa-bars';
    }
  });
});


const servicesDrop = document.getElementById('servicesDrop');

servicesDrop.addEventListener('click', function (e) {
  if (window.innerWidth <= 600) {
    // Only intercept click on the parent <a>, not the inner dropdown links
    if (!e.target.closest('.dropdown')) {
      e.preventDefault();
      this.classList.toggle('open-drop');
    }
  }
});


function animateCounter(el) {
  // Prevent double-animating
  if (el.dataset.animated === 'true') return;
  el.dataset.animated = 'true';

  var target   = parseInt(el.getAttribute('data-target'), 10);
  var duration = 1800; // ms
  var steps    = 60;
  var increment = target / steps;
  var current  = 0;
  var count    = 0;

  var suffix = el.getAttribute('data-target') === '80' ? '%' : '+';

  var timer = setInterval(function () {
    count++;
    current += increment;
    if (count >= steps || current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, duration / steps);
}


var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // Fade-in
      entry.target.classList.add('visible');

      // Animate any counters inside this element
      entry.target.querySelectorAll('.counter').forEach(function (counter) {
        animateCounter(counter);
      });

      // Stop observing after reveal
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Observe all .fade-in elements
document.querySelectorAll('.fade-in').forEach(function (el) {
  observer.observe(el);
});

// Hero counters — animate immediately (already in view)
document.querySelectorAll('.hero .counter').forEach(function (counter) {
  animateCounter(counter);
});

/* ─────────────────────────────────────
   5. TESTIMONIAL SLIDER
───────────────────────────────────── */
var currentSlide = 0;
var autoSlideTimer;

var track        = document.getElementById('testimonialTrack');
var dotsContainer = document.getElementById('sliderDots');
var prevBtn      = document.getElementById('prevBtn');
var nextBtn      = document.getElementById('nextBtn');
var cards        = track.querySelectorAll('.testimonial-card');

function getVisibleCount() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 960) return 2;
  return 3;
}

function getTotalSlides() {
  return Math.ceil(cards.length / getVisibleCount());
}

function buildDots() {
  dotsContainer.innerHTML = '';
  var total = getTotalSlides();
  for (var i = 0; i < total; i++) {
    var dot = document.createElement('button');
    dot.className = 'dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(n) {
  var total = getTotalSlides();
  // Clamp
  if (n < 0)     n = 0;
  if (n >= total) n = total - 1;
  currentSlide = n;

  // Calculate offset: each "page" is the full slider width + gap
  var sliderWidth = track.parentElement.offsetWidth;
  var gap = 24;
  var offset = currentSlide * (sliderWidth + gap);
  track.style.transform = 'translateX(-' + offset + 'px)';

  buildDots();
}

function slideLeft() {
  goToSlide(currentSlide - 1);
  resetAutoSlide();
}

function slideRight() {
  var next = currentSlide + 1 >= getTotalSlides() ? 0 : currentSlide + 1;
  goToSlide(next);
  resetAutoSlide();
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(function () {
    var next = currentSlide + 1 >= getTotalSlides() ? 0 : currentSlide + 1;
    goToSlide(next);
  }, 4500);
}

// Dot click delegation
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dot')) {
    goToSlide(parseInt(e.target.dataset.index, 10));
    resetAutoSlide();
  }
});

prevBtn.addEventListener('click', slideLeft);
nextBtn.addEventListener('click', slideRight);

// Handle resize — reset to slide 0
window.addEventListener('resize', function () {
  goToSlide(0);
});

// Initialize
buildDots();
goToSlide(0);
resetAutoSlide();

/* ─────────────────────────────────────
   6. ACTIVE NAV HIGHLIGHT ON SCROLL
───────────────────────────────────── */
var sections   = document.querySelectorAll('section[id]');
var navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function () {
  var scrollPos = window.scrollY + 100;
  var currentId = '';

  sections.forEach(function (section) {
    if (scrollPos >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navAnchors.forEach(function (a) {
    a.classList.remove('active');
    var href = a.getAttribute('href');
    if (href === '#' + currentId) {
      a.classList.add('active');
    }
  });
});

/* ─────────────────────────────────────
   7. SMOOTH CLOSE OF MOBILE MENU
      when clicking outside the nav
───────────────────────────────────── */
document.addEventListener('click', function (e) {
  if (
    window.innerWidth <= 600 &&
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    hambIcon.className = 'fa fa-bars';
  }
});


var mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    mainNav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
  } else {
    mainNav.style.boxShadow = '0 2px 24px rgba(0,0,0,0.4)';
  }
});
