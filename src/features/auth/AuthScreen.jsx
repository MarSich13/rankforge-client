import React, { useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";
import heroImage from "../../assets/login-hero.png";
import { useUi } from "../../i18n/ui.jsx";
import { MetricCard, PreferenceControls } from "../../components/shared.jsx";

export default function AuthScreen({
  apiUrl,
  setApiUrl,
  client,
  mode,
  setMode,
  updateSession,
  message,
  setMessage,
  loading,
  setLoading
}) {
  const { language, setLanguage, theme, setTheme, t } = useUi();
  const [form, setForm] = useState({
    email: "student@rankforge.local",
    password: "Pass.123",
    displayName: "New Challenger",
    role: "Student"
  });

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload =
        mode === "register"
          ? {
              email: form.email,
              password: form.password,
              displayName: form.displayName,
              role: form.role
            }
          : { email: form.email, password: form.password };
      const result = await client.publicPost(`/api/v1/auth/${mode}`, payload);
      updateSession(result);
      setMessage(t("welcome", { name: result.user.displayName }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="auth-hero-overlay" />
        <div className="auth-copy">
          <div className="brand-lockup">
            <span className="brand-mark">
              <Gamepad2 size={22} />
            </span>
            <span>RankForge</span>
          </div>
          <p className="eyebrow">{t("assignmentClient")}</p>
          <h1>
            {t("heroTitleOne")} <span>{t("heroTitleTwo")}</span>
          </h1>
          <p className="hero-text">{t("heroText")}</p>
          <div className="hero-stats" aria-label="RankForge highlights">
            <MetricCard value="500+" label={t("expertSessions")} />
            <MetricCard value="95%" label={t("progressLoops")} />
            <MetricCard value="24/7" label={t("coachComms")} />
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <form className="glass-card auth-card" onSubmit={submit}>
          <div className="section-heading">
            <p className="eyebrow">{mode === "login" ? t("operatorLogin") : t("createAccount")}</p>
            <h2>{mode === "login" ? t("enterCockpit") : t("joinRankForge")}</h2>
          </div>
          <PreferenceControls
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
          />

          <label>
            {t("apiBaseUrl")}
            <input value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} />
          </label>
          <label>
            {t("email")}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          {mode === "register" && (
            <>
              <label>
                {t("displayName")}
                <input
                  value={form.displayName}
                  onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                  required
                />
              </label>
              <label>
                {t("role")}
                <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option value="Student">{t("student")}</option>
                  <option value="Coach">{t("coach")}</option>
                </select>
              </label>
            </>
          )}
          <label>
            {t("password")}
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          <button className="primary-action" disabled={loading}>
            <Sparkles size={18} />
            {mode === "login" ? t("login") : t("register")}
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? t("needAccount") : t("alreadyRegistered")}
          </button>

          <div className="demo-grid">
            {[
              [t("student"), "student@rankforge.local"],
              [t("coach"), "coach@rankforge.local"],
              [t("admin"), "admin@rankforge.local"]
            ].map(([label, email]) => (
              <button
                type="button"
                className="chip-button"
                key={email}
                onClick={() => setForm({ ...form, email, password: "Pass.123" })}
              >
                {label}
              </button>
            ))}
          </div>
          {message && <p className="status-line">{message}</p>}
        </form>
      </section>
    </main>
  );
}
