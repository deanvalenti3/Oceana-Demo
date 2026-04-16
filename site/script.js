// M/Y Oceana — site script

// ============================================
//  MOBILE NAVIGATION TOGGLE
// ============================================
(function () {
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('nav-open'));
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  var links = nav.querySelectorAll('.site-nav__links a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav-open');
    });
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
