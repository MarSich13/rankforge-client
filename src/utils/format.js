import { languages, translate } from "../i18n/ui.jsx";

export function formatDateTime(value, language = "en") {
  if (!value) return translate(language, "notScheduled");
  return new Intl.DateTimeFormat(languages.find((item) => item.code === language)?.culture || "en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function currency(value, language = "en") {
  return new Intl.NumberFormat(languages.find((item) => item.code === language)?.culture || "en-US", {
    style: "currency",
    currency: "EUR"
  }).format(Number(value || 0));
}
