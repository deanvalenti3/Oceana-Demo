// M/Y Oceana — site script

// ============================================
//  MOBILE NAVIGATION TOGGLE
// ============================================
(function () {
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  function closeNav() {
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    nav.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      dd.classList.remove('dropdown-open');
      dd.querySelector('.nav-dropdown__trigger').setAttribute('aria-expanded', 'false');
    });
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('nav-open'));
  });

  // Mobile accordion for About dropdown
  nav.querySelectorAll('.nav-dropdown__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      if (window.innerWidth > 768) return;
      var parent = this.closest('.nav-dropdown');
      var isOpen = parent.classList.toggle('dropdown-open');
      this.setAttribute('aria-expanded', isOpen);
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeNav();
  });

  var links = nav.querySelectorAll('.site-nav__links a');
  links.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });
}());


// ============================================
//  STICKY CTA BAR
// ============================================
(function () {
  var stickyCta = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero') || document.querySelector('.page-hero');
  var inquiry = document.getElementById('inquiry');
  if (!stickyCta) return;

  var heroVisible = true;
  var inquiryVisible = false;

  function updateSticky() {
    if (!heroVisible && !inquiryVisible) {
      stickyCta.classList.add('sticky-cta--visible');
    } else {
      stickyCta.classList.remove('sticky-cta--visible');
    }
  }

  if (hero) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      updateSticky();
    }, { threshold: 0.05 }).observe(hero);
  }

  if (inquiry) {
    new IntersectionObserver(function (entries) {
      inquiryVisible = entries[0].isIntersecting;
      updateSticky();
    }, { threshold: 0.15 }).observe(inquiry);
  }
}());


// ============================================
//  MULTI-STEP INQUIRY FORM
// ============================================
(function () {
  var form = document.getElementById('inquiry-form');
  if (!form) return;

  var currentStep = 1;
  var totalSteps = 4;
  var progressFill = document.getElementById('form-progress-fill');
  var progressLabel = document.getElementById('form-progress-label');

  function showStep(n) {
    form.querySelectorAll('.form-step').forEach(function (step) {
      step.classList.remove('is-active');
    });
    var target = form.querySelector('[data-step="' + n + '"]');
    if (target) target.classList.add('is-active');
    currentStep = n;
    updateProgress(n);
  }

  function updateProgress(n) {
    if (progressFill) progressFill.style.width = ((n / totalSteps) * 100) + '%';
    if (progressLabel) progressLabel.textContent = 'Step ' + n + ' of ' + totalSteps;
  }

  function validateStep(n) {
    var step = form.querySelector('[data-step="' + n + '"]');
    if (!step) return true;
    var valid = true;

    // Radio group validation for intent step
    var intentOptions = step.querySelector('.intent-options');
    if (intentOptions) {
      if (!step.querySelector('input[name="trip_timeline"]:checked')) {
        intentOptions.classList.add('intent-options--error');
        valid = false;
      } else {
        intentOptions.classList.remove('intent-options--error');
      }
    }

    var required = step.querySelectorAll('[required]');
    required.forEach(function (field) {
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(180,60,60,0.6)';
        if (valid) field.focus();
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    return valid;
  }

  // Next buttons
  form.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        showStep(parseInt(this.getAttribute('data-next'), 10));
        var wrap = document.querySelector('.inquiry__form');
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Back buttons
  form.querySelectorAll('[data-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showStep(parseInt(this.getAttribute('data-prev'), 10));
    });
  });

  // Auto-advance on intent selection (step 1)
  form.querySelectorAll('input[name="trip_timeline"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var intentOptions = form.querySelector('.intent-options');
      if (intentOptions) intentOptions.classList.remove('intent-options--error');
      if (currentStep === 1) {
        setTimeout(function () {
          showStep(2);
          var wrap = document.querySelector('.inquiry__form');
          if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  });

  // Submit → POST to Netlify, then show confirmation
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(function () {
      var formWrap = document.querySelector('.inquiry__form');
      var confirm = document.getElementById('inquiry-confirm');
      var section = document.getElementById('inquiry');

      if (formWrap) {
        var progress = formWrap.querySelector('.form-progress');
        if (progress) progress.style.display = 'none';
        form.style.display = 'none';
        if (confirm) confirm.style.display = 'block';
      }

      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    .catch(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Something went wrong — please try again or email us directly.';
      }
    });
  });
}());


// ============================================
//  GUIDED INTERIOR TOUR
// ============================================
(function () {
  var ROOMS = [
    {
      id:             'salon',
      title:          'Main Salon',
      deck:           'Main Deck',
      description:    'The social center of the main deck. Comfortable seating for the full group, a five-seat bar, and direct access to the aft deck.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180215.png',
      alt:            'Main salon aboard M/Y Oceana with blue upholstered seating and five-seat bar',
      objectPosition: 'center center'
    },
    {
      id:             'forward-dining',
      title:          'Forward Dining',
      deck:           'Main Deck',
      description:    'An intimate dining room for shared meals with panoramic forward views through teak-trimmed windows.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180146.png',
      alt:            'Forward dining room aboard M/Y Oceana with teak table and panoramic windows',
      objectPosition: 'left center'
    },
    {
      id:             'galley',
      title:          'Galley',
      deck:           'Main Deck',
      description:    'A full working galley designed for charter-level service. Everything the chef needs to deliver restaurant-quality meals at sea.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180622.png',
      alt:            'Galley aboard M/Y Oceana with stainless appliances and teak cabinetry',
      objectPosition: 'center center'
    },
    {
      id:             'pilothouse',
      title:          'Pilothouse',
      deck:           'Main Deck',
      description:    "Oceana's navigation center. Built-in guest seating lets you sit with the captain while underway through the Inside Passage.",
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180543.png',
      alt:            'Pilothouse aboard M/Y Oceana showing navigation equipment, helm, and guest seating',
      objectPosition: 'center center'
    },
    {
      id:             'master',
      title:          'Master Stateroom',
      deck:           'Lower Deck',
      description:    'The largest guest stateroom aboard. Oversized queen berth, private head, and full storage. Quiet and properly appointed.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180311.png',
      alt:            'Master stateroom aboard M/Y Oceana with queen berth and teak cabinetry',
      objectPosition: 'center center'
    },
    {
      id:             'vip',
      title:          'VIP Staterooms',
      deck:           'Lower Deck',
      description:    'Two VIP staterooms, each with a queen berth and private head. Well suited for couples or guests who want their own space.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180427.png',
      alt:            'VIP guest stateroom aboard M/Y Oceana with queen berth and teak cabinetry',
      objectPosition: 'center 40%'
    },
    {
      id:             'bunk-room',
      title:          'Bunk Room',
      deck:           'Lower Deck',
      description:    'Two individual bunks below deck. A natural fit for younger guests or those who prefer the traditional aboard sleeping arrangement.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180359.png',
      alt:            'Bunk room aboard M/Y Oceana with two individual berths and teak paneling',
      objectPosition: 'center top'
    },
    {
      id:             'guest-head',
      title:          'Guest Head',
      deck:           'Lower Deck',
      description:    'Each guest stateroom has its own private head with vanity sink, mirror, and a full shower.',
      photo:          'assets/images/oceana_imgs/recrewbios/Screenshot%202024-12-13%20180503.png',
      alt:            'Guest head aboard M/Y Oceana with vanity sink, mirror, and teak cabinetry',
      objectPosition: 'center top'
    }
  ];

  // Element references
  var tourEl    = document.getElementById('yacht-tour');
  var photo     = document.getElementById('tour-photo');
  var photoWrap = document.querySelector('.yacht-tour__photo-wrap');
  var infoEl    = document.querySelector('.yacht-tour__info');
  var titleEl   = document.getElementById('tour-title');
  var descEl    = document.getElementById('tour-desc');
  var deckEl    = document.getElementById('tour-deck');
  var progress  = document.getElementById('tour-progress');
  var prevBtn   = document.getElementById('tour-prev');
  var nextBtn   = document.getElementById('tour-next');

  if (!photo || !prevBtn || !nextBtn || !tourEl) return;

  var markers = document.querySelectorAll('.tour-marker');
  var pills   = document.querySelectorAll('.tour-pill');
  var current = 0;
  var fadeTimer = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preload all images for smooth first-transition
  ROOMS.forEach(function (room) {
    var img = new Image();
    img.src = room.photo;
  });

  // Broken-image fallback: fade out broken icon
  photo.addEventListener('error', function () {
    photo.style.opacity = '0.12';
  });
  photo.addEventListener('load', function () {
    photo.style.opacity = '';
  });

  // --- Sync update: markers, pills, progress, button states (always immediate) ---
  function updateSync(index) {
    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === ROOMS.length - 1);
    progress.textContent = (index + 1) + ' of ' + ROOMS.length;

    markers.forEach(function (m, i) {
      m.classList.toggle('is-active', i === index);
    });

    pills.forEach(function (p, i) {
      var active = i === index;
      p.classList.toggle('is-active', active);
      if (active) {
        p.setAttribute('aria-current', 'true');
      } else {
        p.removeAttribute('aria-current');
      }
    });
  }

  // --- Apply room content to photo and copy ---
  function applyMedia(index) {
    var room = ROOMS[index];
    photo.src                  = room.photo;
    photo.alt                  = room.alt;
    photo.style.objectPosition = room.objectPosition;
    titleEl.textContent        = room.title;
    descEl.textContent         = room.description;
    deckEl.textContent         = room.deck;
  }

  // --- Replay copy enter animation ---
  function enterInfo(direction) {
    infoEl.classList.remove('enter-next', 'enter-prev', 'enter-fade');
    void infoEl.offsetWidth; // reflow — forces animation restart
    infoEl.classList.add(direction ? 'enter-' + direction : 'enter-fade');
  }

  // --- Main render: index is the target, direction is 'next'|'prev'|null ---
  function render(index, direction) {
    current = index;          // update current immediately so rapid clicks resolve to latest
    updateSync(index);        // controls, markers, pills — all switch now

    clearTimeout(fadeTimer);  // cancel any in-progress fade

    if (reducedMotion) {
      applyMedia(index);
      return;
    }

    photo.classList.add('is-fading');
    infoEl.classList.add('is-fading');

    fadeTimer = setTimeout(function () {
      applyMedia(current);                // use current (latest after rapid clicks)
      photo.classList.remove('is-fading');
      infoEl.classList.remove('is-fading');
      enterInfo(direction);
    }, 220);
  }

  // --- Controls ---
  prevBtn.addEventListener('click', function () {
    if (current > 0) render(current - 1, 'prev');
  });

  nextBtn.addEventListener('click', function () {
    if (current < ROOMS.length - 1) render(current + 1, 'next');
  });

  markers.forEach(function (m, i) {
    m.addEventListener('click', function () { render(i, null); });
  });

  pills.forEach(function (p, i) {
    p.addEventListener('click', function () {
      render(i, null);
      p.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    });
  });

  // --- Keyboard: ArrowLeft / ArrowRight when focus is inside the tour ---
  document.addEventListener('keydown', function (e) {
    if (!tourEl.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft' && current > 0) {
      e.preventDefault();
      render(current - 1, 'prev');
    }
    if (e.key === 'ArrowRight' && current < ROOMS.length - 1) {
      e.preventDefault();
      render(current + 1, 'next');
    }
  });

  // --- Touch swipe on the photo area ---
  var swipeStartX = 0;
  var swipeStartY = 0;

  if (photoWrap) {
    photoWrap.addEventListener('touchstart', function (e) {
      swipeStartX = e.changedTouches[0].clientX;
      swipeStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    photoWrap.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeStartX;
      var dy = e.changedTouches[0].clientY - swipeStartY;
      // Require at least 40px horizontal and horizontal-dominant gesture
      if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx) * 0.75) return;
      if (dx < 0 && current < ROOMS.length - 1) render(current + 1, 'next');
      if (dx > 0 && current > 0) render(current - 1, 'prev');
    }, { passive: true });
  }

  // --- Initial load: apply content immediately (no animation) ---
  applyMedia(0);
  updateSync(0);
}());
