/* ============================================================
   EduCMS - Main Site JavaScript
   Handles navbar, animations, counters, course rendering,
   faculty rendering, contact form, and back-to-top
   ============================================================ */

'use strict';

$(document).ready(function () {

  /* ============================================================
     PAGE LOADER
     ============================================================ */
  $(window).on('load', function () {
    setTimeout(function () {
      $('#pageLoader').addClass('hidden');
    }, 600);
  });
  // Fallback: hide loader after 3 seconds no matter what
  setTimeout(function () {
    $('#pageLoader').addClass('hidden');
  }, 3000);

  /* ============================================================
     NAVBAR SCROLL EFFECT
     ============================================================ */
  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();

    // Add scrolled class for compact navbar
    if (scrollTop > 50) {
      $('#mainNavbar').addClass('scrolled');
    } else {
      $('#mainNavbar').removeClass('scrolled');
    }

    // Show/hide back-to-top button
    if (scrollTop > 400) {
      $('#backToTop').addClass('visible');
    } else {
      $('#backToTop').removeClass('visible');
    }
  });

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  $('#backToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  /* ============================================================
     SMOOTH SCROLL for anchor links
     ============================================================ */
  $('a[href^="#"]').on('click', function (e) {
    const target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 80
      }, 800);
      // Close mobile nav
      $('.navbar-collapse').collapse('hide');
    }
  });

  /* ============================================================
     SCROLL ANIMATIONS (Animate on Scroll)
     ============================================================ */
  function handleScrollAnimations() {
    $('.animate-on-scroll').each(function () {
      const elementTop = $(this).offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();
      if (elementTop < windowBottom - 50) {
        $(this).addClass('visible');
      }
    });
  }
  $(window).on('scroll', handleScrollAnimations);
  handleScrollAnimations(); // Initial check

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    const statsSection = $('#stats');
    if (!statsSection.length) return;

    const sectionTop = statsSection.offset().top;
    const windowBottom = $(window).scrollTop() + $(window).height();

    if (sectionTop < windowBottom - 100) {
      countersAnimated = true;
      $('.counter').each(function () {
        const $this = $(this);
        const target = parseInt($this.data('target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          $this.text(Math.floor(current).toLocaleString() + '+');
        }, 16);
      });
    }
  }
  $(window).on('scroll', animateCounters);
  animateCounters();

  /* ============================================================
     RENDER HOMEPAGE COURSES
     ============================================================ */
  function renderHomepageCourses(filter) {
    const courses = getAll(STORAGE_KEYS.COURSES);
    const $grid = $('#courseGrid');
    if (!$grid.length) return;

    $grid.empty();

    let filtered = filter && filter !== 'all'
      ? courses.filter(function (c) { return c.category === filter; })
      : courses;

    // Show max 6 on homepage
    filtered = filtered.slice(0, 6);

    if (filtered.length === 0) {
      $grid.html('<div class="col-12 text-center py-5"><p class="text-muted">No courses found in this category.</p></div>');
      return;
    }

    $.each(filtered, function (index, course) {
      const priceText = course.price === 0 ? 'Free' : '$' + course.price;
      const badgeHtml = course.badge
        ? '<span class="course-badge ' + course.badge + '">' + course.badge + '</span>'
        : '';

      const stars = renderStars(course.rating);

      const card = `
        <div class="col-lg-4 col-md-6 mb-4 animate-on-scroll animate-delay-${index % 4}">
          <div class="course-card">
            <div class="course-card-image">
              <img src="${course.image}" alt="${course.title}">
              ${badgeHtml}
              <span class="course-price">${priceText}</span>
            </div>
            <div class="course-card-body">
              <span class="course-category">${course.category}</span>
              <h5>${course.title}</h5>
              <p>${truncate(course.description, 100)}</p>
              <div class="course-meta">
                <span><i class="far fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-users"></i> ${course.students}</span>
                <span class="course-rating">${stars} ${course.rating}</span>
              </div>
            </div>
          </div>
        </div>
      `;
      $grid.append(card);
    });

    // Re-trigger scroll animations for newly added elements
    handleScrollAnimations();
  }

  // Course filter buttons
  $('#courseFilters').on('click', '.filter-btn', function () {
    const filter = $(this).data('filter');
    $(this).addClass('active').siblings().removeClass('active');
    renderHomepageCourses(filter);
  });

  // Initial render
  renderHomepageCourses('all');

  /* ============================================================
     RENDER HOMEPAGE FACULTY
     ============================================================ */
  function renderHomepageFaculty() {
    const faculty = getAll(STORAGE_KEYS.FACULTY);
    const $grid = $('#facultyGrid');
    if (!$grid.length) return;

    $grid.empty();

    const activeFaculty = faculty.filter(function (f) { return f.status === 'active'; });

    $.each(activeFaculty, function (index, member) {
      const card = `
        <div class="col-lg-4 col-md-6 mb-4 animate-on-scroll animate-delay-${index % 4}">
          <div class="faculty-card">
            <div class="faculty-image">
              <img src="${member.image}" alt="${member.name}">
              <div class="faculty-overlay">
                <a href="${member.social && member.social.twitter || '#'}" title="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="${member.social && member.social.linkedin || '#'}" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                ${member.social && member.social.github ? '<a href="' + member.social.github + '" title="GitHub"><i class="fab fa-github"></i></a>' : ''}
              </div>
            </div>
            <div class="faculty-info">
              <h5>${member.name}</h5>
              <p class="designation">${member.designation}</p>
              <p>${truncate(member.bio, 90)}</p>
            </div>
          </div>
        </div>
      `;
      $grid.append(card);
    });

    handleScrollAnimations();
  }

  renderHomepageFaculty();

  /* ============================================================
     CONTACT FORM VALIDATION
     ============================================================ */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Reset
    $(this).find('.form-control').removeClass('is-invalid');

    // Name
    if (!$('#contactName').val().trim()) {
      $('#contactName').addClass('is-invalid');
      valid = false;
    }

    // Email
    const email = $('#contactEmail').val().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $('#contactEmail').addClass('is-invalid');
      valid = false;
    }

    // Subject
    if (!$('#contactSubject').val().trim()) {
      $('#contactSubject').addClass('is-invalid');
      valid = false;
    }

    // Message
    if (!$('#contactMessage').val().trim()) {
      $('#contactMessage').addClass('is-invalid');
      valid = false;
    }

    if (valid) {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      this.reset();
    }
  });

  // Clear validation on input
  $('body').on('input', '.form-control', function () {
    $(this).removeClass('is-invalid');
  });

  /* ============================================================
     REGISTRATION MODAL
     ============================================================ */
  // Populate course dropdown in registration modal
  (function populateRegCourses() {
    const courses = getAll(STORAGE_KEYS.COURSES);
    const $select = $('#regCourse');
    if (!$select.length) return;

    $.each(courses, function (i, course) {
      $select.append('<option value="' + course.id + '">' + course.title + '</option>');
    });
  })();

  // Submit registration
  $('#submitRegistration').on('click', function () {
    const $form = $('#registrationForm');
    let valid = true;

    $form.find('.form-control').removeClass('is-invalid');

    if (!$('#regName').val().trim()) { $('#regName').addClass('is-invalid'); valid = false; }
    const email = $('#regEmail').val().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#regEmail').addClass('is-invalid'); valid = false; }
    if (!$('#regCourse').val()) { $('#regCourse').addClass('is-invalid'); valid = false; }

    if (valid) {
      const registration = {
        name: $('#regName').val().trim(),
        email: email,
        phone: $('#regPhone').val().trim(),
        courseId: parseInt($('#regCourse').val()),
        message: $('#regMessage').val().trim(),
        date: new Date().toISOString()
      };
      addItem(STORAGE_KEYS.REGISTRATIONS, registration);
      showToast('Registration successful! Welcome to EduCMS.', 'success');
      $('#registerModal').modal('hide');
      $form[0].reset();
    }
  });

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    const email = $(this).find('input').val().trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Subscribed successfully! Check your email for confirmation.', 'success');
      this.reset();
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });

  /* ============================================================
     HELPER FUNCTIONS
     ============================================================ */

  /**
   * Truncate text to a maximum length
   */
  function truncate(text, max) {
    if (!text) return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  }

  /**
   * Render star rating HTML
   */
  function renderStars(rating) {
    let html = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) {
      html += '<i class="fas fa-star" style="color:#ffc107;"></i>';
    }
    if (half) {
      html += '<i class="fas fa-star-half-alt" style="color:#ffc107;"></i>';
    }
    return html;
  }

  /* Make renderStars globally available */
  window.renderStars = renderStars;
  window.truncate = truncate;

  /* ============================================================
     TOAST NOTIFICATION
     ============================================================ */
  window.showToast = function (message, type) {
    type = type || 'info';
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    const toast = $(`
      <div class="toast-notification ${type}">
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
      </div>
    `);
    $('body').append(toast);
    setTimeout(function () {
      toast.fadeOut(400, function () { toast.remove(); });
    }, 3500);
  };

});
