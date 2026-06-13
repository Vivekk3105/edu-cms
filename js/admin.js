/* ============================================================
   EduCMS - Admin Dashboard JavaScript
   Shared admin functionality: sidebar toggle, stats loading,
   and dashboard-specific rendering
   ============================================================ */

'use strict';

$(document).ready(function () {

  /* ============================================================
     SIDEBAR TOGGLE (Mobile)
     ============================================================ */
  $('#openSidebar').on('click', function () {
    $('#adminSidebar').addClass('show');
    $('#sidebarOverlay').addClass('show');
  });

  $('#closeSidebar, #sidebarOverlay').on('click', function () {
    $('#adminSidebar').removeClass('show');
    $('#sidebarOverlay').removeClass('show');
  });

  /* ============================================================
     LOAD DASHBOARD STATISTICS
     ============================================================ */
  function loadDashboardStats() {
    const stats = getDashboardStats();

    // Animate stat numbers
    animateValue('#statCourses', stats.totalCourses);
    animateValue('#statStudents', stats.totalStudents);
    animateValue('#statFaculty', stats.totalFaculty);
    animateValue('#statAnnouncements', stats.totalAnnouncements);

    // Sidebar badge
    $('#sidebarCourseCount').text(stats.totalCourses);
  }

  /**
   * Animate a number from 0 to target
   */
  function animateValue(selector, target) {
    const $el = $(selector);
    if (!$el.length) return;

    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      $el.text(Math.floor(current).toLocaleString());
    }, 16);
  }

  /* ============================================================
     LOAD RECENT COURSES TABLE (Dashboard)
     ============================================================ */
  function loadRecentCourses() {
    const $tbody = $('#recentCoursesBody');
    if (!$tbody.length) return;

    const courses = getAll(STORAGE_KEYS.COURSES);
    const recent = courses.slice(0, 5); // Show latest 5

    $('#recentCourseCount').text(courses.length);
    $tbody.empty();

    if (recent.length === 0) {
      $tbody.html('<tr><td colspan="6" class="text-center py-4 text-muted">No courses yet.</td></tr>');
      return;
    }

    $.each(recent, function (i, course) {
      const statusClass = course.status === 'active' ? 'active'
                        : course.status === 'draft' ? 'draft'
                        : 'inactive';

      const row = `
        <tr>
          <td>
            <div class="table-item-info">
              <img src="${course.image}" alt="${course.title}">
              <div>
                <h6>${course.title}</h6>
                <span>${course.instructor}</span>
              </div>
            </div>
          </td>
          <td><span class="course-category">${course.category}</span></td>
          <td><strong>${course.students.toLocaleString()}</strong></td>
          <td><span style="color:#ffc107;"><i class="fas fa-star"></i></span> ${course.rating}</td>
          <td><span class="status-badge ${statusClass}">${course.status}</span></td>
          <td>
            <div class="action-btns">
              <a href="courses.html" class="action-btn view" title="Manage"><i class="fas fa-external-link-alt"></i></a>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  }

  /* ============================================================
     TOAST NOTIFICATION (Admin pages)
     ============================================================ */
  if (!window.showToast) {
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
  }

  /* ============================================================
     INIT
     ============================================================ */
  loadDashboardStats();
  loadRecentCourses();
});
