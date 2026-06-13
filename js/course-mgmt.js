/* ============================================================
   EduCMS - Course Management CRUD
   Add, Edit, Delete courses with search and pagination
   Used on admin/courses.html
   ============================================================ */

'use strict';

$(document).ready(function () {

  /* ---------- State ---------- */
  const PAGE_SIZE = 5;
  let currentPage = 1;
  let searchQuery = '';
  let editingCourseId = null;
  let deletingCourseId = null;

  /* ============================================================
     INITIALIZE
     ============================================================ */
  function init() {
    renderTable();
    bindEvents();
  }

  /* ============================================================
     EVENT BINDINGS
     ============================================================ */
  function bindEvents() {
    // Search with debounce
    let timer;
    $('#courseTableSearch').on('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        searchQuery = $('#courseTableSearch').val().trim();
        currentPage = 1;
        renderTable();
      }, 300);
    });

    // Add Course button - reset form
    $('#addCourseBtn').on('click', function () {
      resetForm();
      $('#courseModalTitle').html('<i class="fas fa-plus-circle mr-2"></i> Add New Course');
      $('#saveCourseBtn').html('<i class="fas fa-save mr-1"></i> Save Course');
      editingCourseId = null;
    });

    // Save course (add or edit)
    $('#saveCourseBtn').on('click', saveCourse);

    // Edit course (delegated)
    $(document).on('click', '.edit-course-btn', function () {
      const id = parseInt($(this).data('id'));
      editCourse(id);
    });

    // Delete course - show confirmation
    $(document).on('click', '.delete-course-btn', function () {
      deletingCourseId = parseInt($(this).data('id'));
      $('#deleteConfirmModal').modal('show');
    });

    // Confirm delete
    $('#confirmDeleteBtn').on('click', function () {
      if (deletingCourseId) {
        deleteItem(STORAGE_KEYS.COURSES, deletingCourseId);
        deletingCourseId = null;
        $('#deleteConfirmModal').modal('hide');
        showToast('Course deleted successfully.', 'success');
        renderTable();
      }
    });

    // Pagination clicks
    $(document).on('click', '#courseTablePagination .page-btn', function () {
      const page = parseInt($(this).data('page'));
      if (page && !$(this).hasClass('disabled') && !$(this).hasClass('active')) {
        currentPage = page;
        renderTable();
      }
    });

    // Reset modal form when closed
    $('#courseModal').on('hidden.bs.modal', function () {
      resetForm();
    });
  }

  /* ============================================================
     RENDER TABLE
     ============================================================ */
  function renderTable() {
    const $tbody = $('#courseTableBody');
    $tbody.empty();

    // Get and filter courses
    let courses = searchQuery
      ? searchItems(STORAGE_KEYS.COURSES, searchQuery, ['title', 'category', 'instructor', 'description'])
      : getAll(STORAGE_KEYS.COURSES);

    // Update count badge
    $('#courseCountBadge').text(courses.length);

    if (courses.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <i class="fas fa-book"></i>
              <h5>No Courses Found</h5>
              <p>${searchQuery ? 'Try a different search query.' : 'Click "Add Course" to create your first course.'}</p>
            </div>
          </td>
        </tr>
      `);
      $('#courseTableInfo').text('Showing 0 courses');
      $('#courseTablePagination').empty();
      return;
    }

    // Pagination
    const totalPages = Math.ceil(courses.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageCourses = courses.slice(startIdx, endIdx);

    // Render rows
    $.each(pageCourses, function (i, course) {
      const statusClass = course.status === 'active' ? 'active'
                        : course.status === 'draft' ? 'draft'
                        : 'inactive';

      const row = `
        <tr>
          <td><strong>${course.id}</strong></td>
          <td>
            <div class="table-item-info">
              <img src="${course.image || 'https://via.placeholder.com/45'}" alt="${course.title}">
              <div>
                <h6>${course.title}</h6>
                <span>${course.level || 'N/A'}</span>
              </div>
            </div>
          </td>
          <td><span class="course-category">${course.category}</span></td>
          <td>${course.instructor}</td>
          <td><strong>${course.price === 0 ? 'Free' : '$' + course.price}</strong></td>
          <td>${course.students.toLocaleString()}</td>
          <td><span class="status-badge ${statusClass}">${course.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit edit-course-btn" data-id="${course.id}" title="Edit">
                <i class="fas fa-pen"></i>
              </button>
              <button class="action-btn delete delete-course-btn" data-id="${course.id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    // Info text
    $('#courseTableInfo').text(
      'Showing ' + (startIdx + 1) + '-' + Math.min(endIdx, courses.length) + ' of ' + courses.length + ' courses'
    );

    // Pagination buttons
    renderPagination(totalPages);
  }

  /* ============================================================
     RENDER PAGINATION
     ============================================================ */
  function renderPagination(totalPages) {
    const $pag = $('#courseTablePagination');
    $pag.empty();

    if (totalPages <= 1) return;

    // Prev
    $pag.append(`<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`);

    for (let i = 1; i <= totalPages; i++) {
      $pag.append(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }

    // Next
    $pag.append(`<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`);
  }

  /* ============================================================
     SAVE COURSE (Add / Update)
     ============================================================ */
  function saveCourse() {
    // Validate
    const $form = $('#courseForm');
    let valid = true;

    $form.find('.form-control').removeClass('is-invalid');

    const title = $('#courseTitle').val().trim();
    const category = $('#courseCategory').val();
    const description = $('#courseDescription').val().trim();
    const instructor = $('#courseInstructor').val().trim();

    if (!title) { $('#courseTitle').addClass('is-invalid'); valid = false; }
    if (!category) { $('#courseCategory').addClass('is-invalid'); valid = false; }
    if (!description) { $('#courseDescription').addClass('is-invalid'); valid = false; }
    if (!instructor) { $('#courseInstructor').addClass('is-invalid'); valid = false; }

    if (!valid) return;

    // Build course object
    const courseData = {
      title: title,
      category: category,
      description: description,
      instructor: instructor,
      duration: $('#courseDuration').val().trim() || '8 Weeks',
      price: parseInt($('#coursePrice').val()) || 0,
      level: $('#courseLevel').val(),
      status: $('#courseStatus').val(),
      image: $('#courseImage').val().trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      students: 0,
      rating: 4.5,
      badge: ''
    };

    if (editingCourseId) {
      // Update existing course (preserve students, rating, badge)
      const existing = getById(STORAGE_KEYS.COURSES, editingCourseId);
      if (existing) {
        courseData.students = existing.students;
        courseData.rating = existing.rating;
        courseData.badge = existing.badge;
      }
      updateItem(STORAGE_KEYS.COURSES, editingCourseId, courseData);
      showToast('Course updated successfully!', 'success');
    } else {
      addItem(STORAGE_KEYS.COURSES, courseData);
      showToast('Course added successfully!', 'success');
    }

    $('#courseModal').modal('hide');
    resetForm();
    renderTable();
  }

  /* ============================================================
     EDIT COURSE - Populate Modal
     ============================================================ */
  function editCourse(id) {
    const course = getById(STORAGE_KEYS.COURSES, id);
    if (!course) return;

    editingCourseId = id;
    $('#courseId').val(id);
    $('#courseTitle').val(course.title);
    $('#courseCategory').val(course.category);
    $('#courseDescription').val(course.description);
    $('#courseInstructor').val(course.instructor);
    $('#courseDuration').val(course.duration);
    $('#coursePrice').val(course.price);
    $('#courseLevel').val(course.level);
    $('#courseStatus').val(course.status);
    $('#courseImage').val(course.image);

    $('#courseModalTitle').html('<i class="fas fa-pen mr-2"></i> Edit Course');
    $('#saveCourseBtn').html('<i class="fas fa-save mr-1"></i> Update Course');
    $('#courseModal').modal('show');
  }

  /* ============================================================
     RESET FORM
     ============================================================ */
  function resetForm() {
    $('#courseForm')[0].reset();
    $('#courseForm').find('.form-control').removeClass('is-invalid');
    $('#courseId').val('');
    editingCourseId = null;
  }

  /* ---------- Start ---------- */
  init();
});
