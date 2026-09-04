/* ==========================================================
   EduBridge — layout.js
   Renders the sidebar + topbar into #eb-sidebar / #eb-topbar
   based on role, and highlights the active nav item.
   ========================================================== */

const EB_ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  users2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M13 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.1v-2a4 4 0 0 1 4-4h14"/><path d="M7 21.9l-4-4 4-4"/><path d="M21 11.9v2a4 4 0 0 1-4 4H3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  records: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-4 4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
};

const EB_NAV = {
  admin: [
    { label: "Dashboard", href: "dashboard.html", icon: "grid" },
    { label: "Manage Students", href: "students.html", icon: "users" },
    { label: "Manage Teachers", href: "teachers.html", icon: "users2" },
    { label: "CV & Profile Review", href: "cv-review.html", icon: "file" },
    { label: "Assign Teacher", href: "assign-teacher.html", icon: "swap" },
    { label: "Assignments Monitor", href: "assignments.html", icon: "check" },
    { label: "Results & Records", href: "results.html", icon: "records" },
  ],
  teacher: [
    { label: "Dashboard", href: "dashboard.html", icon: "grid" },
    { label: "My Profile & CV", href: "profile.html", icon: "user" },
    { label: "My Students", href: "students.html", icon: "users" },
    { label: "Create Assignment", href: "create-assignment.html", icon: "plus" },
    { label: "Student Submissions", href: "submissions.html", icon: "check" },
    { label: "Student Performance", href: "performance.html", icon: "chart" },
  ],
  student: [
    { label: "Dashboard", href: "dashboard.html", icon: "grid" },
    { label: "My Profile", href: "profile.html", icon: "user" },
    { label: "My Assignments", href: "assignments.html", icon: "check" },
    { label: "Submit Assignment", href: "submit.html", icon: "plus" },
    { label: "Marks & Results", href: "results.html", icon: "records" },
  ],
};

const EB_DEFAULT_INFO = {
  admin: { who: "Amara Khalid", roleLabel: "System Administrator", initials: "AK" },
  teacher: { who: "Zara Aslam", roleLabel: "Mathematics Teacher", initials: "ZA" },
  student: { who: "Noor us Sabah", roleLabel: "Grade 9 — Section B", initials: "NS" },
};

function ebBrandBlock() {
  return `
    <div class="brand">
      <div class="brand-glyph">
        <svg viewBox="0 0 24 24" fill="none" stroke="#f4f2e9" stroke-width="1.8"><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10.5v4.2c0 1.3 2.2 3.3 5 3.3s5-2 5-3.3v-4.2"/></svg>
      </div>
      <div>
        <div class="brand-mark">EduBridge</div>
        <div class="brand-sub">Academic Management Platform</div>
      </div>
    </div>`;
}

function ebRenderLayout(role, activeHref) {
  const session = typeof ebGetSession === "function" ? ebGetSession() : null;
  const info = session
    ? {
        who: session.name,
        roleLabel: session.roleLabel || EB_DEFAULT_INFO[role].roleLabel,
        initials: session.initials || ebInitials(session.name || "U"),
      }
    : EB_DEFAULT_INFO[role];

  const nav = EB_NAV[role] || [];
  const sidebar = document.getElementById("eb-sidebar");
  if (sidebar) {
    sidebar.innerHTML = `
      ${ebBrandBlock()}
      <div class="nav-label">${role.charAt(0).toUpperCase() + role.slice(1)} — Menu</div>
      <nav class="nav-list">
        ${nav
          .map(
            (item) => `
          <a class="nav-item ${item.href === activeHref ? "active" : ""}" href="${item.href}">
            ${EB_ICONS[item.icon] || ""}${item.label}
          </a>`
          )
          .join("")}
      </nav>
      <div class="sidebar-foot">
        <div class="avatar">${info.initials}</div>
        <div>
          <div class="who">${info.who}</div>
          <div class="role">${info.roleLabel}</div>
        </div>
      </div>
      <div class="logout-row">
        <a href="#" class="nav-item" id="eb-logout-link">${EB_ICONS.logout}Log out</a>
      </div>
    `;
    const logoutLink = document.getElementById("eb-logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        ebLogout("../login.html");
      });
    }
  }

  const topbar = document.getElementById("eb-topbar");
  if (topbar) {
    topbar.innerHTML = `
      <div class="search">${EB_ICONS.search}<span>Search…</span></div>
      <div class="topbar-right">
        <div class="icon-btn">${EB_ICONS.bell}<span class="dot"></span></div>
      </div>
    `;
  }
}
