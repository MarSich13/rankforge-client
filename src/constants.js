export const storageKeys = {
  apiUrl: "rankforge.react.apiUrl",
  accessToken: "rankforge.react.accessToken",
  refreshToken: "rankforge.react.refreshToken",
  user: "rankforge.react.user",
  language: "rankforge.react.language",
  theme: "rankforge.react.theme"
};

export const defaultApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5099";
export const emptyLang = { en: "", et: "", ru: "" };
export const statuses = ["Pending", "Active", "Completed", "Cancelled"];
export const levels = ["Beginner", "Intermediate", "Advanced"];
