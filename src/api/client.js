import { languages, translate } from "../i18n/ui.jsx";

export function createApiClient(apiUrl, tokens, updateSession, onLogout, language) {
  const baseUrl = apiUrl.replace(/\/$/, "");
  const culture = languages.find((item) => item.code === language)?.culture || "en-US";

  async function request(path, options = {}, retry = true) {
    const response = await fetch(`${baseUrl}${withCulture(path, culture)}`, {
      method: options.method || "GET",
      headers: {
        ...(tokens.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    if (response.status === 401 && retry && tokens.refreshToken) {
      const refreshed = await fetch(`${baseUrl}${withCulture("/api/v1/auth/refresh", culture)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken })
      });
      if (!refreshed.ok) {
        onLogout();
        throw new Error(translate(language, "sessionExpired"));
      }
      const payload = await refreshed.json();
      updateSession(payload);
      return request(path, options, false);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || translate(language, "apiRequestFailed", { status: response.status }));
    }
    if (response.status === 204) return null;
    return response.json();
  }

  return {
    publicGet: (path) => request(path, {}, false),
    publicPost: (path, body) => request(path, { method: "POST", body }, false),
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    delete: (path) => request(path, { method: "DELETE" })
  };
}

function withCulture(path, culture) {
  if (!path.startsWith("/api/")) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}culture=${encodeURIComponent(culture)}&ui-culture=${encodeURIComponent(culture)}`;
}
