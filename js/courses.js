/* ============================================================
   EduCMS - Courses Page JavaScript
   Handles search, filtering, sorting, and pagination
   for the dedicated course listing page (courses.html)
   ============================================================ */

'use strict';

$(document).ready(function () {

  /* ---------- Configuration ---------- */
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let filteredCourses = [];

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  function init() {
    // Check for URL parameters (e.g., ?cat=Technology)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      $('#categoryFilter').val(catParam);
    }

    applyFilters();
    bindEvents();
  }

  /* ============================================================
     EVENT BINDINGS
     ============================================================ */
  function bindEvents() {
    // Search input (debounced)
    let searchTimer;
    $('#courseSearchInput').on('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        currentPage = 1;
        applyFilters();
      }, 300);
    });

    // Filter dropdowns
    $('#categoryFilter, #levelFilter, #sortFilter').on('change', function () {
      currentPage = 1;
      applyFilters();
    });

    // Reset filters button
    $('#resetFiltersBtn').on('click', function () {
      $('#courseSearchInput').val('');
      $('#categoryFilter').val('');
      $('#levelFilter').val('');
      $('#sortFilter').val('popular');
      currentPage = 1;
      applyFilters();
    });

    // Pagination clicks
    $(document).on('click', '#coursePagination .page-link', function (e) {
      e.preventDefault();
      const page = $(this).data('page');
      if (page && page !== currentPage) {
        currentPage = page;
        renderCourses();
        $('html, body').animate({ scrollTop: 300 }, 400);
      }
    });
  }

  /* ============================================================
     APPLY FILTERS & SORT
     ============================================================ */
  function applyFilters() {
    let courses = getAll(STORAGE_KEYS.COURSES);

    // Search filter
    const query = $('#courseSearchInput').val().trim().toLowerCase();
    if (query) {
      courses = courses.filter(function (c) {
        return c.title.toLowerCase().includes(query) ||
               c.instructor.toLowerCase().includes(query) ||
               c.description.toLowerCase().includes(query) ||
               c.category.toLowerCase().includes(query);
      });
    }

    // Category filter
    const category = $('#categoryFilter').val();
    if (category) {
      courses = courses.filter(function (c) { return c.category === category; });
    }

    // Level filter
    const level = $('#levelFilter').val();
    if (level) {
      courses = courses.filter(function (c) { return c.level === level; });
    }

    // Sort
    const sort = $('#sortFilter').val();
    switch (sort) {
      case 'rating':
        courses.sort(function (a, b) { return b.rating - a.rating; });
        break;
      case 'newest':
        courses.sort(function (a, b) { return b.id - a.id; });
        break;
      case 'price-low':
        courses.sort(function (a, b) { return a.price - b.price; });
        break;
      case 'price-high':
        courses.sort(function (a, b) { return b.price - a.price; });
        break;
      default: // popular
        courses.sort(function (a, b) { return b.students - a.students; });
    }

    filteredCourses = courses;
    renderCourses();
  }

  /* ============================================================
     RENDER COURSES
     ============================================================ */
  function renderCourses() {
    const $grid = $('#courseListGrid');
    const $empty = $('#emptyState');
    const $pagination = $('#paginationWrapper');

    $grid.empty();

    // Update result count
    $('#resultCount').text(filteredCourses.length);

    // Empty state
    if (filteredCourses.length === 0) {
      $empty.removeClass('d-none');
      $pagination.hide();
      return;
    }

    $empty.addClass('d-none');
    $pagination.show();

    // Pagination calculations
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageCourses = filteredCourses.slice(startIndex, endIndex);

    // Render cards
    $.each(pageCourses, function (index, course) {
      const priceText = course.price === 0 ? 'Free' : '$' + course.price;
      const badgeHtml = course.badge
        ? '<span class="course-badge ' + course.badge + '">' + course.badge + '</span>'
        : '';
      const stars = window.renderStars ? window.renderStars(course.rating) : '';

      const card = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="course-card" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
            <div class="course-card-image">
              <img src="${course.image}" alt="${course.title}" loading="lazy">
              ${badgeHtml}
              <span class="course-price">${priceText}</span>
            </div>
            <div class="course-card-body">
              <span class="course-category">${course.category}</span>
              <h5>${course.title}</h5>
              <p>${window.truncate ? window.truncate(course.description, 110) : course.description}</p>
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

    // Render pagination
    renderPagination(totalPages);
  }

  /* ============================================================
     RENDER PAGINATION
     ============================================================ */
  function renderPagination(totalPages) {
    const $pagination = $('#coursePagination');
    $pagination.empty();

    if (totalPages <= 1) return;

    // Previous button
    $pagination.append(`
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a>
      </li>
    `);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      $pagination.append(`
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `);
    }

    // Next button
    $pagination.append(`
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a>
      </li>
    `);
  }

  /* ---------- Start ---------- */
  init();
});
