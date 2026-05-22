import React, { useEffect, useState } from "react";
import { Languages, Moon, Sun } from "lucide-react";
import { statuses } from "../constants.js";
import { languages, useUi } from "../i18n/ui.jsx";
import { localizeStatus } from "../utils/roles.js";

export function Card({ title, icon: Icon, children }) {
  return (
    <section className="glass-card">
      <div className="card-title">
        <span>
          <Icon size={18} />
        </span>
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function EnrollmentStatusAction({ enrollment, mutate, client }) {
  const { t } = useUi();
  const [status, setStatus] = useState(enrollment.status);

  useEffect(() => {
    setStatus(enrollment.status);
  }, [enrollment.status]);

  return (
    <div className="row-actions">
      <select
        className="inline-select"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        aria-label={t("status")}
      >
        {statuses.map((item) => (
          <option value={item} key={item}>
            {localizeStatus(item, t)}
          </option>
        ))}
      </select>
      <button
        className="chip-button"
        onClick={() =>
          mutate(t("enrollmentStatusUpdated"), () =>
            client.put(`/api/v1/enrollments/${enrollment.id}`, {
              studentId: enrollment.studentId,
              coachingProgramId: enrollment.coachingProgramId,
              status
            })
          )
        }
        disabled={status === enrollment.status}
      >
        {t("updateStatus")}
      </button>
    </div>
  );
}

export function PreferenceControls({ language, setLanguage, theme, setTheme, compact = false }) {
  const { t } = useUi();
  return (
    <div className={compact ? "preference-controls compact" : "preference-controls"}>
      <label className="segmented-control">
        <span>
          <Languages size={16} />
          {compact ? "" : t("language")}
        </span>
        <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t("language")}>
          {languages.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title={theme === "dark" ? t("lightMode") : t("darkMode")}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        {compact ? "" : theme === "dark" ? t("lightMode") : t("darkMode")}
      </button>
    </div>
  );
}

export function MetricCard({ value, label }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function Stat({ icon: Icon, label, value }) {
  return (
    <article className="stat-card">
      <Icon size={20} />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export function List({ items, render, empty }) {
  if (!items?.length) return <p className="empty-state">{empty}</p>;
  return <div className="list-stack">{items.map(render)}</div>;
}

export function ListRow({ title, meta, action }) {
  return (
    <article className="list-row">
      <div>
        <strong>{title}</strong>
        {meta && <span>{meta}</span>}
      </div>
      {action}
    </article>
  );
}

export function RankBars({ progress }) {
  const { t } = useUi();
  if (!progress.length) return <p className="empty-state">{t("noRankProgress")}</p>;
  const max = Math.max(...progress.map((item) => item.rating), 1);
  return (
    <div className="rank-bars">
      {progress.slice(-6).map((item) => (
        <div className="rank-row" key={item.id}>
          <span>{item.game}</span>
          <div>
            <i style={{ width: `${Math.max(8, (item.rating / max) * 100)}%` }} />
          </div>
          <strong>{item.rating}</strong>
        </div>
      ))}
    </div>
  );
}

export function Score({ label, value }) {
  return (
    <div className="score-row">
      <span>{label}</span>
      <div><i style={{ width: `${value}%` }} /></div>
      <strong>{value}</strong>
    </div>
  );
}

export function InputField({ label, value, onChange, type = "text", required = false }) {
  return (
    <label>
      {label}
      <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

export function TextareaField({ label, value, onChange, required = false }) {
  return (
    <label>
      {label}
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

export function SelectField({ label, value, onChange, children }) {
  const { t } = useUi();
  return (
    <label>
      {label}
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
        <option value="" disabled>
          {t("selectPlaceholder")}
        </option>
        {children}
      </select>
    </label>
  );
}

export function LangFields({ value, onChange, label }) {
  return (
    <div className="lang-grid">
      <InputField label={`${label} EN`} value={value.en} onChange={(en) => onChange({ ...value, en })} required />
      <InputField label={`${label} ET`} value={value.et} onChange={(et) => onChange({ ...value, et })} />
      <InputField label={`${label} RU`} value={value.ru} onChange={(ru) => onChange({ ...value, ru })} />
    </div>
  );
}
