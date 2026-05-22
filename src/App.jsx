import React, { useEffect, useMemo, useState } from "react";
import { createApiClient } from "./api/client.js";
import { defaultApiUrl, storageKeys } from "./constants.js";
import { UiContext, translate } from "./i18n/ui.jsx";
import { currency, formatDateTime } from "./utils/format.js";
import { isAdminRole } from "./utils/roles.js";
import { Sidebar, Topbar } from "./components/layout.jsx";
import AuthScreen from "./features/auth/AuthScreen.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import Catalog from "./features/catalog/Catalog.jsx";
import Training from "./features/training/Training.jsx";
import Reviews from "./features/reviews/Reviews.jsx";
import Messages from "./features/messages/Messages.jsx";
import Organiser from "./features/organiser/Organiser.jsx";

export default function App() {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem(storageKeys.apiUrl) || defaultApiUrl);
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem(storageKeys.accessToken),
    refreshToken: localStorage.getItem(storageKeys.refreshToken)
  });
  const [user, setUser] = useState(readStoredUser);
  const [mode, setMode] = useState("login");
  const [activeView, setActiveView] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const [language, setLanguage] = useState(localStorage.getItem(storageKeys.language) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(storageKeys.theme) || "dark");
  const ui = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      t: (key, values) => translate(language, key, values),
      formatDateTime: (value) => formatDateTime(value, language),
      currency: (value) => currency(value, language)
    }),
    [language, theme]
  );

  const client = useMemo(
    () => createApiClient(apiUrl, tokens, updateSession, logout, language),
    [apiUrl, tokens.accessToken, tokens.refreshToken, language]
  );

  const role = user?.role || "Guest";
  const isAdmin = isAdminRole(role);
  const isCoach = role === "Coach";
  const canOrganise = isAdmin || isCoach;

  useEffect(() => {
    localStorage.setItem(storageKeys.apiUrl, apiUrl);
  }, [apiUrl]);

  useEffect(() => {
    localStorage.setItem(storageKeys.language, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem(storageKeys.theme, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    loadPublicData();
    if (tokens.accessToken) {
      loadProtectedData();
    }
  }, [client, tokens.accessToken]);

  function updateSession(payload) {
    setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    setUser(payload.user);
    localStorage.setItem(storageKeys.accessToken, payload.accessToken);
    localStorage.setItem(storageKeys.refreshToken, payload.refreshToken);
    localStorage.setItem(storageKeys.user, JSON.stringify(payload.user));
  }

  function logout() {
    setTokens({ accessToken: null, refreshToken: null });
    setUser(null);
    setData(initialData());
    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.refreshToken);
    localStorage.removeItem(storageKeys.user);
    setMessage(ui.t("signedOut"));
    setActiveView("dashboard");
  }

  async function loadPublicData() {
    setLoading(true);
    try {
      const [games, programs, lessons] = await Promise.all([
        client.publicGet("/api/v1/games"),
        client.publicGet("/api/v1/coachingprograms"),
        client.publicGet("/api/v1/lessons")
      ]);
      setData((current) => ({ ...current, games, programs, lessons }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadProtectedData() {
    setLoading(true);
    try {
      const calls = [
        client.get("/api/v1/enrollments").catch(() => []),
        client.get("/api/v1/trainingtasks").catch(() => []),
        client.get("/api/v1/gameplaysubmissions").catch(() => []),
        client.get("/api/v1/gameplayreviews").catch(() => []),
        isAdmin ? Promise.resolve([]) : client.get("/api/v1/rankprogress").catch(() => []),
        client.get("/api/v1/conversations").catch(() => [])
      ];

      if (isAdmin) {
        calls.push(client.get("/api/v1/users").catch(() => []));
        calls.push(client.get("/api/v1/users?role=Coach").catch(() => []));
        calls.push(client.get("/api/v1/users?role=Student").catch(() => []));
      }

      const [
        enrollments,
        tasks,
        submissions,
        reviews,
        progress,
        conversations,
        users = [],
        coaches = [],
        students = []
      ] = await Promise.all(calls);

      setData((current) => ({
        ...current,
        enrollments,
        tasks,
        submissions,
        reviews,
        progress,
        conversations,
        users,
        coaches,
        students
      }));
      setMessage(ui.t("dataSynced"));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function mutate(label, action) {
    setLoading(true);
    try {
      await action();
      setMessage(label);
      await loadPublicData();
      if (tokens.accessToken) await loadProtectedData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <UiContext.Provider value={ui}>
        <AuthScreen
          apiUrl={apiUrl}
          setApiUrl={setApiUrl}
          client={client}
          mode={mode}
          setMode={setMode}
          updateSession={updateSession}
          message={message}
          setMessage={setMessage}
          loading={loading}
          setLoading={setLoading}
        />
      </UiContext.Provider>
    );
  }

  return (
    <UiContext.Provider value={ui}>
      <div className="app-shell">
        <Sidebar
          user={user}
          activeView={activeView}
          setActiveView={setActiveView}
          canOrganise={canOrganise}
          logout={logout}
        />
        <main className="main-panel">
          <Topbar
            user={user}
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            loading={loading}
            reload={() => {
              loadPublicData();
              loadProtectedData();
            }}
            message={message}
          />

          {activeView === "dashboard" && (
            <Dashboard data={data} user={user} setActiveView={setActiveView} />
          )}
          {activeView === "catalog" && (
            <Catalog data={data} user={user} mutate={mutate} client={client} />
          )}
          {activeView === "training" && (
            <Training data={data} mutate={mutate} client={client} />
          )}
          {activeView === "reviews" && (
            <Reviews data={data} mutate={mutate} client={client} user={user} />
          )}
          {activeView === "messages" && (
            <Messages data={data} mutate={mutate} client={client} user={user} />
          )}
          {activeView === "organiser" && (
            <Organiser
              data={data}
              mutate={mutate}
              client={client}
              user={user}
              isAdmin={isAdmin}
              isCoach={isCoach}
            />
          )}
        </main>
      </div>
    </UiContext.Provider>
  );
}

export function initialData() {
  return {
    games: [],
    programs: [],
    lessons: [],
    enrollments: [],
    tasks: [],
    submissions: [],
    reviews: [],
    progress: [],
    conversations: [],
    users: [],
    coaches: [],
    students: []
  };
}

export function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.user));
  } catch {
    return null;
  }
}
