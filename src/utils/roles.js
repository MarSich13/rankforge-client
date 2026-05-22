import { translations } from "../i18n/ui.jsx";

export function uniqueStudentsFromEnrollments(enrollments) {
  const rows = new Map();
  enrollments.forEach((item) => rows.set(item.studentId, { id: item.studentId, displayName: item.student }));
  return [...rows.values()];
}

export function isAdminRole(role) {
  return role === "Admin" || role === "Administrator";
}

export function roleLabel(role, t) {
  if (role === "Student") return t("student");
  if (role === "Coach") return t("coach");
  if (role === "Admin") return t("admin");
  if (role === "Administrator") return t("administrator");
  return role;
}

export function localizeStatus(status, t) {
  const key = String(status || "").toLowerCase();
  return translations.en[key] ? t(key) : status;
}

export function localizeLevel(level, t) {
  const key = String(level || "").toLowerCase();
  return translations.en[key] ? t(key) : level;
}
