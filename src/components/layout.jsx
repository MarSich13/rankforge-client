import React from "react";
import { ClipboardCheck, Gamepad2, LayoutDashboard, LogOut, MessageSquareText, RefreshCw, ShieldCheck, Trophy, Video } from "lucide-react";
import { useUi } from "../i18n/ui.jsx";
import { isAdminRole, roleLabel } from "../utils/roles.js";
import { PreferenceControls } from "./shared.jsx";

export function Sidebar({ user, activeView, setActiveView, canOrganise, logout }) {
  const { t } = useUi();
  const items = [
    ["dashboard", t("dashboard"), LayoutDashboard],
    ["catalog", t("programs"), Trophy],
    ["training", t("training"), ClipboardCheck],
    ["reviews", t("vodReview"), Video],
    ["messages", t("messages"), MessageSquareText]
  ];
  if (canOrganise) items.push(["organiser", isAdminRole(user.role) ? t("adminOps") : t("coachOps"), ShieldCheck]);

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">
          <Gamepad2 size={20} />
        </span>
        <span>RankForge</span>
      </div>
      <nav>
        {items.map(([key, label, Icon]) => (
          <button
            key={key}
            className={activeView === key ? "nav-item active" : "nav-item"}
            onClick={() => setActiveView(key)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <div className="profile-card">
        <p>{user.displayName}</p>
        <span>{user.email}</span>
        <strong>{roleLabel(user.role, t)}</strong>
      </div>
      <button className="nav-item logout" onClick={logout}>
        <LogOut size={18} />
        {t("logout")}
      </button>
    </aside>
  );
}

export function Topbar({ user, apiUrl, setApiUrl, loading, reload, message }) {
  const { language, setLanguage, theme, setTheme, t } = useUi();
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{t("liveSession")}</p>
        <h1>{user.role === "Student" ? t("studentCockpit") : t("roleCockpit", { role: roleLabel(user.role, t) })}</h1>
      </div>
      <div className="topbar-actions">
        <PreferenceControls
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          compact
        />
        <input
          className="compact-input"
          value={apiUrl}
          onChange={(event) => setApiUrl(event.target.value)}
          aria-label={t("apiBaseUrl")}
        />
        <button className="icon-button" onClick={reload} title={t("refreshData")} disabled={loading}>
          <RefreshCw size={18} />
        </button>
      </div>
      {message && <p className="topbar-message">{message}</p>}
    </header>
  );
}
