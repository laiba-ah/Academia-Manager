/* ==========================================================
   EduBridge — auth.js
   Client-side simulation of role-based authentication.
   Replace ebSaveSession/ebGetSession with real API calls +
   server-side sessions/JWT when this is wired to a backend
   (e.g. Django auth) — the page-level guard() calls stay the same.
   ========================================================== */

const EB_SESSION_KEY = "eb_session";

const EB_DEMO_ACCOUNTS = {
  admin:   { email: "admin@edubridge.test",   password: "admin123" },
};

function ebInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function ebSaveSession(session) {
  localStorage.setItem(EB_SESSION_KEY, JSON.stringify(session));
}

function ebGetSession() {
  try {
    return JSON.parse(localStorage.getItem(EB_SESSION_KEY));
  } catch (e) {
    return null;
  }
}

function ebLogout(redirectTo) {
  localStorage.removeItem(EB_SESSION_KEY);
  window.location.href = redirectTo || "../login.html";
}

/**
 * Call at the top of every protected page.
 * requiredRole: "admin" | "teacher" | "student"
 * loginPath: relative path back to login.html from that page
 */
function ebGuard(requiredRole, loginPath) {
  const session = ebGetSession();
  if (!session || session.role !== requiredRole) {
    window.location.href = loginPath || "../login.html";
    return null;
  }
  return session;
}

/**
 * Handles the login form. Looks up locally "registered" accounts
 * (created via register.html) plus the built-in admin demo account.
 */
function ebHandleLogin(role, email, password) {
  if (role === "admin") {
    const acc = EB_DEMO_ACCOUNTS.admin;
    if (email.trim().toLowerCase() === acc.email && password === acc.password) {
      ebSaveSession({
        role: "admin",
        name: "Amara Khalid",
        email: acc.email,
        roleLabel: "System Administrator",
        initials: "AK",
      });
      return { ok: true, redirect: "admin/dashboard.html" };
    }
    return { ok: false, message: "Invalid admin email or password." };
  }

  const users = JSON.parse(localStorage.getItem("eb_users") || "[]");
  const match = users.find(
    (u) => u.role === role && u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!match) {
    return {
      ok: false,
      message: "No matching account found. Please register first, or check your role/email/password.",
    };
  }
  ebSaveSession({
    role: match.role,
    name: match.name,
    email: match.email,
    roleLabel: match.role === "teacher" ? match.subject || "Teacher" : match.grade || "Student",
    initials: ebInitials(match.name),
  });
  return { ok: true, redirect: match.role + "/dashboard.html" };
}

/**
 * Handles the registration form for students & teachers.
 */
function ebHandleRegister(payload) {
  const users = JSON.parse(localStorage.getItem("eb_users") || "[]");
  const exists = users.some(
    (u) => u.role === payload.role && u.email.toLowerCase() === payload.email.toLowerCase()
  );
  if (exists) {
    return { ok: false, message: "An account with this email already exists for this role." };
  }
  users.push(payload);
  localStorage.setItem("eb_users", JSON.stringify(users));
  return { ok: true };
}
