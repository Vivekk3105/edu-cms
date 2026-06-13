/* ============================================================
   EduCMS - Announcements Management CRUD
   Add, Edit, Delete announcements with search and pagination
   Used on admin/announcements.html
   ============================================================ */

'use strict';

$(document).ready(function () {

  /* ---------- State ---------- */
  const PAGE_SIZE = 5;
  let currentPage = 1;
  let searchQuery = '';
  let editingId = null;
  let deletingId = null;

  /* ============================================================
     INITIALIZE
     ============================================================ */
  function init() {
    // Set default date to today
    $('#announcementDate').val(new Date().toISOString().split('T')[0]);
    renderTable();
    bindEvents();
  }

  /* ============================================================
     EVENT BINDINGS
     ============================================================ */
  function bindEvents() {
    // Search
    let timer;
    $('#announcementTableSearch').on('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        searchQuery = $('#announcementTableSearch').val().trim();
        currentPage = 1;
        renderTable();
      }, 300);
    });

    // Add button
    $('#addAnnouncementBtn').on('click', function () {
      resetForm();
      $('#announcementModalTitle').html('<i class="fas fa-bullhorn mr-2"></i> New Announcement');
      $('#saveAnnouncementBtn').html('<i class="fas fa-save mr-1"></i> Publish');
      editingId = null;
    });

    // Save
    $('#saveAnnouncementBtn').on('click', saveAnnouncement);

    // Edit
    $(document).on('click', '.edit-announcement-btn', function () {
      editAnnouncement(parseInt($(this).data('id')));
    });

    // Delete - show modal
    $(document).on('click', '.delete-announcement-btn', function () {
      deletingId = parseInt($(this).data('id'));
      $('#deleteAnnouncementModal').modal('show');
    });

    // Confirm delete
    $('#confirmDeleteAnnouncementBtn').on('click', function () {
      if (deletingId) {
        deleteItem(STORAGE_KEYS.ANNOUNCEMENTS, deletingId);
        deletingId = null;
        $('#deleteAnnouncementModal').modal('hide');
        showToast('Announcement deleted.', 'success');
        renderTable();
      }
    });

    // Pagination
    $(document).on('click', '#announcementTablePagination .page-btn', function () {
      const page = parseInt($(this).data('page'));
      if (page && !$(this).hasClass('disabled') && !$(this).hasClass('active')) {
        currentPage = page;
        renderTable();
      }
    });

    // Reset form
    $('#announcementModal').on('hidden.bs.modal', resetForm);
  }

  /* ============================================================
     RENDER TABLE
     ============================================================ */
  function renderTable() {
    const $tbody = $('#announcementTableBody');
    $tbody.empty();

    let items = searchQuery
      ? searchItems(STORAGE_KEYS.ANNOUNCEMENTS, searchQuery, ['title', 'content', 'category', 'author'])
      : getAll(STORAGE_KEYS.ANNOUNCEMENTS);

    // Sort by date descending
    items.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    $('#announcementCountBadge').text(items.length);

    if (items.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i class="fas fa-bullhorn"></i>
              <h5>No Announcements</h5>
              <p>${searchQuery ? 'No results found.' : 'Click "New Announcement" to create one.'}</p>
            </div>
          </td>
        </tr>
      `);
      $('#announcementTableInfo').text('Showing 0 announcements');
      $('#announcementTablePagination').empty();
      return;
    }

    // Pagination
    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageItems = items.slice(startIdx, endIdx);

    $.each(pageItems, function (i, item) {
      const statusClass = item.status === 'published' ? 'published' : 'draft';

      // Priority colors
      const priorityColors = {
        high: 'background:rgba(229,57,53,0.1);color:#e53935;',
        medium: 'background:rgba(255,111,0,0.1);color:#ff6f00;',
        low: 'background:rgba(0,200,83,0.1);color:#00c853;'
      };
      const priorityStyle = priorityColors[item.priority] || priorityColors.low;

      const row = `
        <tr>
          <td><strong>${item.id}</strong></td>
          <td>
            <div>
              <h6 style="font-size:0.9rem;font-weight:600;margin-bottom:2px;">${item.title}</h6>
              <span style="font-size:0.8rem;color:var(--text-muted);">By ${item.author || 'Admin'}</span>
            </div>
          </td>
          <td><span class="course-category">${item.category}</span></td>
          <td>
            <span class="status-badge" style="${priorityStyle}">${item.priority}</span>
          </td>
          <td>${formatDate(item.date)}</td>
          <td><span class="status-badge ${statusClass}">${item.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit edit-announcement-btn" data-id="${item.id}" title="Edit">
                <i class="fas fa-pen"></i>
              </button>
              <button class="action-btn delete delete-announcement-btn" data-id="${item.id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    $('#announcementTableInfo').text(
      'Showing ' + (startIdx + 1) + '-' + Math.min(endIdx, items.length) + ' of ' + items.length + ' announcements'
    );

    renderPagination(totalPages);
  }

  /* ============================================================
     RENDER PAGINATION
     ============================================================ */
  function renderPagination(totalPages) {
    const $pag = $('#announcementTablePagination');
    $pag.empty();

    if (totalPages <= 1) return;

    $pag.append(`<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`);

    for (let i = 1; i <= totalPages; i++) {
      $pag.append(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }

    $pag.append(`<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`);
  }

  /* ============================================================
     SAVE ANNOUNCEMENT
     ============================================================ */
  function saveAnnouncement() {
    const $form = $('#announcementForm');
    let valid = true;

    $form.find('.form-control').removeClass('is-invalid');

    const title = $('#announcementTitle').val().trim();
    const content = $('#announcementContent').val().trim();

    if (!title) { $('#announcementTitle').addClass('is-invalid'); valid = false; }
    if (!content) { $('#announcementContent').addClass('is-invalid'); valid = false; }

    if (!valid) return;

    const data = {
      title: title,
      content: content,
      category: $('#announcementCategory').val(),
      priority: $('#announcementPriority').val(),
      status: $('#announcementStatus').val(),
      date: $('#announcementDate').val() || new Date().toISOString().split('T')[0],
      author: $('#announcementAuthor').val().trim() || 'Admin'
    };

    if (editingId) {
      updateItem(STORAGE_KEYS.ANNOUNCEMENTS, editingId, data);
      showToast('Announcement updated successfully!', 'success');
    } else {
      addItem(STORAGE_KEYS.ANNOUNCEMENTS, data);
      showToast('Announcement published successfully!', 'success');
    }

    $('#announcementModal').modal('hide');
    resetForm();
    renderTable();
  }

  /* ============================================================
     EDIT ANNOUNCEMENT
     ============================================================ */
  function editAnnouncement(id) {
    const item = getById(STORAGE_KEYS.ANNOUNCEMENTS, id);
    if (!item) return;

    editingId = id;
    $('#announcementId').val(id);
    $('#announcementTitle').val(item.title);
    $('#announcementContent').val(item.content);
    $('#announcementCategory').val(item.category);
    $('#announcementPriority').val(item.priority);
    $('#announcementStatus').val(item.status);
    $('#announcementDate').val(item.date);
    $('#announcementAuthor').val(item.author);

    $('#announcementModalTitle').html('<i class="fas fa-pen mr-2"></i> Edit Announcement');
    $('#saveAnnouncementBtn').html('<i class="fas fa-save mr-1"></i> Update');
    $('#announcementModal').modal('show');
  }

  /* ============================================================
     RESET FORM
     ============================================================ */
  function resetForm() {
    $('#announcementForm')[0].reset();
    $('#announcementForm').find('.form-control').removeClass('is-invalid');
    $('#announcementId').val('');
    $('#announcementDate').val(new Date().toISOString().split('T')[0]);
    $('#announcementAuthor').val('Admin');
    editingId = null;
  }

  /* ============================================================
     HELPER: Format Date
     ============================================================ */
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  }

  /* ---------- Start ---------- */
  init();
});
