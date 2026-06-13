/* ============================================================
   EduCMS - Faculty Management CRUD
   Add, Edit, Delete faculty members with search and pagination
   Used on admin/faculty.html
   ============================================================ */

'use strict';

$(document).ready(function () {

  /* ---------- State ---------- */
  const PAGE_SIZE = 5;
  let currentPage = 1;
  let searchQuery = '';
  let editingFacultyId = null;
  let deletingFacultyId = null;

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
    $('#facultyTableSearch').on('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        searchQuery = $('#facultyTableSearch').val().trim();
        currentPage = 1;
        renderTable();
      }, 300);
    });

    // Add Faculty button
    $('#addFacultyBtn').on('click', function () {
      resetForm();
      $('#facultyModalTitle').html('<i class="fas fa-user-plus mr-2"></i> Add New Faculty');
      $('#saveFacultyBtn').html('<i class="fas fa-save mr-1"></i> Save Faculty');
      editingFacultyId = null;
    });

    // Save faculty
    $('#saveFacultyBtn').on('click', saveFaculty);

    // Edit
    $(document).on('click', '.edit-faculty-btn', function () {
      editFaculty(parseInt($(this).data('id')));
    });

    // Delete - show confirmation
    $(document).on('click', '.delete-faculty-btn', function () {
      deletingFacultyId = parseInt($(this).data('id'));
      $('#deleteFacultyModal').modal('show');
    });

    // Confirm delete
    $('#confirmDeleteFacultyBtn').on('click', function () {
      if (deletingFacultyId) {
        deleteItem(STORAGE_KEYS.FACULTY, deletingFacultyId);
        deletingFacultyId = null;
        $('#deleteFacultyModal').modal('hide');
        showToast('Faculty member removed successfully.', 'success');
        renderTable();
      }
    });

    // Pagination
    $(document).on('click', '#facultyTablePagination .page-btn', function () {
      const page = parseInt($(this).data('page'));
      if (page && !$(this).hasClass('disabled') && !$(this).hasClass('active')) {
        currentPage = page;
        renderTable();
      }
    });

    // Reset form when modal closes
    $('#facultyModal').on('hidden.bs.modal', resetForm);
  }

  /* ============================================================
     RENDER TABLE
     ============================================================ */
  function renderTable() {
    const $tbody = $('#facultyTableBody');
    $tbody.empty();

    let faculty = searchQuery
      ? searchItems(STORAGE_KEYS.FACULTY, searchQuery, ['name', 'designation', 'department', 'email'])
      : getAll(STORAGE_KEYS.FACULTY);

    $('#facultyCountBadge').text(faculty.length);

    if (faculty.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i class="fas fa-chalkboard-teacher"></i>
              <h5>No Faculty Found</h5>
              <p>${searchQuery ? 'Try a different search query.' : 'Click "Add Faculty" to add a member.'}</p>
            </div>
          </td>
        </tr>
      `);
      $('#facultyTableInfo').text('Showing 0 members');
      $('#facultyTablePagination').empty();
      return;
    }

    // Pagination
    const totalPages = Math.ceil(faculty.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageFaculty = faculty.slice(startIdx, endIdx);

    $.each(pageFaculty, function (i, member) {
      const statusClass = member.status === 'active' ? 'active' : 'inactive';

      const row = `
        <tr>
          <td><strong>${member.id}</strong></td>
          <td>
            <div class="table-item-info">
              <img src="${member.image || 'https://via.placeholder.com/45'}" alt="${member.name}" style="border-radius:50%;">
              <div>
                <h6>${member.name}</h6>
                <span>${member.designation}</span>
              </div>
            </div>
          </td>
          <td>${member.department}</td>
          <td><a href="mailto:${member.email}">${member.email}</a></td>
          <td><span class="status-badge ${statusClass}">${member.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit edit-faculty-btn" data-id="${member.id}" title="Edit">
                <i class="fas fa-pen"></i>
              </button>
              <button class="action-btn delete delete-faculty-btn" data-id="${member.id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    $('#facultyTableInfo').text(
      'Showing ' + (startIdx + 1) + '-' + Math.min(endIdx, faculty.length) + ' of ' + faculty.length + ' members'
    );

    renderPagination(totalPages);
  }

  /* ============================================================
     RENDER PAGINATION
     ============================================================ */
  function renderPagination(totalPages) {
    const $pag = $('#facultyTablePagination');
    $pag.empty();

    if (totalPages <= 1) return;

    $pag.append(`<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`);

    for (let i = 1; i <= totalPages; i++) {
      $pag.append(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }

    $pag.append(`<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`);
  }

  /* ============================================================
     SAVE FACULTY (Add / Update)
     ============================================================ */
  function saveFaculty() {
    const $form = $('#facultyForm');
    let valid = true;

    $form.find('.form-control').removeClass('is-invalid');

    const name = $('#facultyName').val().trim();
    const email = $('#facultyEmail').val().trim();
    const designation = $('#facultyDesignation').val().trim();

    if (!name) { $('#facultyName').addClass('is-invalid'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#facultyEmail').addClass('is-invalid'); valid = false; }
    if (!designation) { $('#facultyDesignation').addClass('is-invalid'); valid = false; }

    if (!valid) return;

    const facultyData = {
      name: name,
      email: email,
      designation: designation,
      department: $('#facultyDepartment').val(),
      bio: $('#facultyBio').val().trim(),
      status: $('#facultyStatus').val(),
      image: $('#facultyImage').val().trim() || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      social: { twitter: '#', linkedin: '#' }
    };

    if (editingFacultyId) {
      updateItem(STORAGE_KEYS.FACULTY, editingFacultyId, facultyData);
      showToast('Faculty member updated successfully!', 'success');
    } else {
      addItem(STORAGE_KEYS.FACULTY, facultyData);
      showToast('Faculty member added successfully!', 'success');
    }

    $('#facultyModal').modal('hide');
    resetForm();
    renderTable();
  }

  /* ============================================================
     EDIT FACULTY - Populate Modal
     ============================================================ */
  function editFaculty(id) {
    const member = getById(STORAGE_KEYS.FACULTY, id);
    if (!member) return;

    editingFacultyId = id;
    $('#facultyId').val(id);
    $('#facultyName').val(member.name);
    $('#facultyEmail').val(member.email);
    $('#facultyDesignation').val(member.designation);
    $('#facultyDepartment').val(member.department);
    $('#facultyBio').val(member.bio);
    $('#facultyStatus').val(member.status);
    $('#facultyImage').val(member.image);

    $('#facultyModalTitle').html('<i class="fas fa-pen mr-2"></i> Edit Faculty');
    $('#saveFacultyBtn').html('<i class="fas fa-save mr-1"></i> Update');
    $('#facultyModal').modal('show');
  }

  /* ============================================================
     RESET FORM
     ============================================================ */
  function resetForm() {
    $('#facultyForm')[0].reset();
    $('#facultyForm').find('.form-control').removeClass('is-invalid');
    $('#facultyId').val('');
    editingFacultyId = null;
  }

  /* ---------- Start ---------- */
  init();
});
