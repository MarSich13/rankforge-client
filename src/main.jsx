import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CircleDollarSign,
  ClipboardCheck,
  Gamepad2,
  Languages,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Moon,
  PlayCircle,
  Plus,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Trophy,
  UserPlus,
  Users,
  Video
} from "lucide-react";
import heroImage from "./assets/login-hero.png";
import "./styles.css";

const storageKeys = {
  apiUrl: "rankforge.react.apiUrl",
  accessToken: "rankforge.react.accessToken",
  refreshToken: "rankforge.react.refreshToken",
  user: "rankforge.react.user",
  language: "rankforge.react.language",
  theme: "rankforge.react.theme"
};

const defaultApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5099";
const emptyLang = { en: "", et: "", ru: "" };
const statuses = ["Pending", "Active", "Completed", "Cancelled"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const languages = [
  { code: "en", label: "EN", culture: "en-US" },
  { code: "et", label: "ET", culture: "et-EE" },
  { code: "ru", label: "RU", culture: "ru-RU" }
];
const UiContext = createContext(null);

const translations = {
  en: {
    assignmentClient: "C# Web assignment client",
    heroTitleOne: "Level Up Your Game.",
    heroTitleTwo: "Dominate the Ranks.",
    heroText: "Coaching programs, VOD reviews, training tasks, rank history, and organiser controls in one separate React client.",
    expertSessions: "expert sessions",
    progressLoops: "fast progress loops",
    coachComms: "coach comms",
    operatorLogin: "Operator login",
    createAccount: "Create account",
    enterCockpit: "Enter cockpit",
    joinRankForge: "Join RankForge",
    apiBaseUrl: "API base URL",
    email: "Email",
    displayName: "Display name",
    role: "Role",
    password: "Password",
    login: "Login",
    register: "Register",
    needAccount: "Need an account?",
    alreadyRegistered: "Already registered?",
    student: "Student",
    coach: "Coach",
    admin: "Admin",
    administrator: "Administrator",
    dashboard: "Dashboard",
    programs: "Programs",
    training: "Training",
    vodReview: "VOD Review",
    messages: "Messages",
    adminOps: "Admin Ops",
    coachOps: "Coach Ops",
    logout: "Logout",
    liveSession: "Live client session",
    studentCockpit: "Student cockpit",
    roleCockpit: "{role} cockpit",
    refreshData: "Refresh data",
    signedOut: "Signed out.",
    welcome: "Welcome, {name}.",
    dataSynced: "Data synced with RankForge API.",
    todaysQueue: "Today's queue",
    welcomeBack: "Welcome back, {name}",
    studentHeroText: "Track your coaching plan, submit replay work, and keep rank momentum visible.",
    organiserHeroText: "Review submissions, assign tasks, and keep the training pipeline moving.",
    continue: "Continue",
    activePrograms: "Active programs",
    openTasks: "Open tasks",
    latestRating: "Latest rating",
    reviewLoops: "Review loops",
    rankProgression: "Rank progression",
    coachingSessions: "Coaching sessions",
    noScheduledLessons: "No scheduled lessons yet.",
    quickActions: "Quick actions",
    browsePrograms: "Browse programs",
    openReviewRoom: "Open review room",
    messageThread: "Message thread",
    taskTracking: "Task tracking",
    noTasks: "No tasks assigned.",
    due: "due",
    programMarketplace: "Program marketplace",
    choosePath: "Choose a coaching path",
    marketplaceText: "Public API data is visible before login; signed-in users can connect with coaches through conversations.",
    requestCoaching: "Request coaching",
    games: "Games",
    noGames: "No games yet.",
    lessonLibrary: "Lesson library",
    noLessons: "No lessons yet.",
    studentFlow: "Student flow",
    trainingTitle: "Tasks, submissions, and active enrollments",
    trainingText: "Students can submit assigned work and gameplay replay links. Coaches and admins see their scoped queues.",
    myEnrollments: "My enrollments",
    noEnrollmentsAssigned: "No enrollments assigned yet.",
    submitGameplay: "Submit gameplay",
    enrollment: "Enrollment",
    replayUrl: "Replay URL",
    notes: "Notes",
    submitReplay: "Submit replay",
    assignedTasks: "Assigned tasks",
    select: "Select",
    taskSubmission: "Task submission",
    task: "Task",
    submissionNotes: "Submission notes",
    sendWork: "Send work",
    timelineFeedback: "Timeline feedback",
    selectGameplayVideo: "Select a gameplay submission with a video URL.",
    reviewPanel: "Review panel",
    mechanics: "Mechanics",
    gameSense: "Game sense",
    positioning: "Positioning",
    communication: "Communication",
    submissions: "Submissions",
    noGameplaySubmissions: "No gameplay submissions yet.",
    review: "Review",
    coachFeedback: "Coach feedback",
    submission: "Submission",
    feedback: "Feedback",
    reviewVideoUrl: "Review video URL",
    publishReview: "Publish review",
    conversations: "Conversations",
    noConversations: "No conversations yet.",
    open: "Open",
    discussion: "Discussion",
    noThreadMessages: "No messages in this thread.",
    writeReply: "Write a reply...",
    send: "Send",
    adminOrganiserFlow: "Admin organiser flow",
    coachOrganiserFlow: "Coach organiser flow",
    organiserTitle: "Create content, assign work, publish results",
    organiserText: "Admin owns catalog/enrollment setup. Coaches and admins manage training tasks, replay reviews, and rank progress.",
    createGame: "Create game",
    slug: "Slug",
    gameName: "Game name",
    createProgram: "Create program",
    game: "Game",
    programTitle: "Program title",
    description: "Description",
    level: "Level",
    price: "Price",
    createLesson: "Create lesson",
    program: "Program",
    lessonTitle: "Lesson title",
    content: "Content",
    scheduled: "Scheduled",
    assignStudent: "Assign student",
    status: "Status",
    createEnrollment: "Create enrollment",
    assignTrainingTask: "Assign training task",
    taskTitle: "Task title",
    instructions: "Instructions",
    assignTask: "Assign task",
    recordRankResult: "Record rank result",
    rank: "Rank",
    rating: "Rating",
    recordedOn: "Recorded on",
    saveResult: "Save result",
    enrollments: "Enrollments",
    noEnrollments: "No enrollments.",
    noSubmissions: "No submissions.",
    results: "Results",
    noRankResults: "No rank results.",
    replay: "Replay",
    selectPlaceholder: "Select...",
    notScheduled: "not scheduled",
    noRankProgress: "No rank progress yet.",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language",
    theme: "Theme",
    conversationRequest: "Conversation request created when participants are available.",
    gameplaySubmitted: "Gameplay replay submitted.",
    taskSubmitted: "Task submission sent.",
    reviewPublished: "Gameplay review published.",
    messageSent: "Message sent.",
    gameCreated: "Game created.",
    gameDeleted: "Game deleted.",
    deleteGame: "Delete game",
    manageGames: "Manage games",
    programCreated: "Program created.",
    lessonCreated: "Lesson created.",
    enrollmentCreated: "Enrollment created.",
    enrollmentStatusUpdated: "Enrollment status updated.",
    updateStatus: "Update status",
    taskAssigned: "Training task assigned.",
    rankRecorded: "Rank progress recorded.",
    sessionExpired: "Session expired. Login again.",
    apiRequestFailed: "API request failed with {status}.",
    pending: "Pending",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  },
  et: {
    assignmentClient: "C# Web kursuse klient",
    heroTitleOne: "Tõsta oma mängutaset.",
    heroTitleTwo: "Valitse edetabeleid.",
    heroText: "Treeningprogrammid, VOD analüüsid, ülesanded, rank'i ajalugu ja korraldaja tööriistad eraldi React kliendis.",
    expertSessions: "ekspertsessiooni",
    progressLoops: "kiiret arenguringi",
    coachComms: "treeneri suhtlus",
    operatorLogin: "Operaatori sisselogimine",
    createAccount: "Loo konto",
    enterCockpit: "Ava juhtpaneel",
    joinRankForge: "Liitu RankForge'iga",
    apiBaseUrl: "API baasaadress",
    email: "E-post",
    displayName: "Kuvatav nimi",
    role: "Roll",
    password: "Parool",
    login: "Logi sisse",
    register: "Registreeru",
    needAccount: "Vajad kontot?",
    alreadyRegistered: "Konto on juba olemas?",
    student: "Õpilane",
    coach: "Treener",
    admin: "Admin",
    administrator: "Administraator",
    dashboard: "Töölaud",
    programs: "Programmid",
    training: "Treening",
    vodReview: "VOD analüüs",
    messages: "Sõnumid",
    adminOps: "Admin töövoog",
    coachOps: "Treeneri töövoog",
    logout: "Logi välja",
    liveSession: "Aktiivne kliendisessioon",
    studentCockpit: "Õpilase juhtpaneel",
    roleCockpit: "{role} juhtpaneel",
    refreshData: "Värskenda andmeid",
    signedOut: "Välja logitud.",
    welcome: "Tere tulemast, {name}.",
    dataSynced: "Andmed sünkroonitud RankForge API-ga.",
    todaysQueue: "Tänane järjekord",
    welcomeBack: "Tere tagasi, {name}",
    studentHeroText: "Jälgi treeningplaani, saada replay töid ja hoia rank'i areng nähtaval.",
    organiserHeroText: "Analüüsi esitusi, määra ülesandeid ja hoia treeningvoog liikumises.",
    continue: "Jätka",
    activePrograms: "Aktiivsed programmid",
    openTasks: "Avatud ülesanded",
    latestRating: "Viimane reiting",
    reviewLoops: "Analüüsiringid",
    rankProgression: "Rank'i areng",
    coachingSessions: "Treeningtunnid",
    noScheduledLessons: "Planeeritud tunde veel pole.",
    quickActions: "Kiirtegevused",
    browsePrograms: "Sirvi programme",
    openReviewRoom: "Ava analüüsiruum",
    messageThread: "Sõnumilõim",
    taskTracking: "Ülesannete jälgimine",
    noTasks: "Ülesandeid pole määratud.",
    due: "tähtaeg",
    programMarketplace: "Programmide turg",
    choosePath: "Vali treeningrada",
    marketplaceText: "Avalik API info on nähtav enne sisselogimist; sisseloginud kasutajad saavad treeneritega ühendust võtta.",
    requestCoaching: "Küsi treeningut",
    games: "Mängud",
    noGames: "Mänge veel pole.",
    lessonLibrary: "Tundide kogu",
    noLessons: "Tunde veel pole.",
    studentFlow: "Õpilase töövoog",
    trainingTitle: "Ülesanded, esitused ja aktiivsed registreeringud",
    trainingText: "Õpilased saavad esitada määratud töid ja gameplay replay linke. Treenerid ja adminid näevad oma järjekordi.",
    myEnrollments: "Minu registreeringud",
    noEnrollmentsAssigned: "Registreeringuid pole veel määratud.",
    submitGameplay: "Esita gameplay",
    enrollment: "Registreering",
    replayUrl: "Replay URL",
    notes: "Märkmed",
    submitReplay: "Saada replay",
    assignedTasks: "Määratud ülesanded",
    select: "Vali",
    taskSubmission: "Ülesande esitus",
    task: "Ülesanne",
    submissionNotes: "Esituse märkmed",
    sendWork: "Saada töö",
    timelineFeedback: "Ajajoone tagasiside",
    selectGameplayVideo: "Vali gameplay esitus, millel on video URL.",
    reviewPanel: "Analüüsi paneel",
    mechanics: "Mehaanika",
    gameSense: "Mängutaju",
    positioning: "Positsioneerimine",
    communication: "Suhtlus",
    submissions: "Esitused",
    noGameplaySubmissions: "Gameplay esitusi veel pole.",
    review: "Analüüsi",
    coachFeedback: "Treeneri tagasiside",
    submission: "Esitus",
    feedback: "Tagasiside",
    reviewVideoUrl: "Analüüsi video URL",
    publishReview: "Avalda analüüs",
    conversations: "Vestlused",
    noConversations: "Vestlusi veel pole.",
    open: "Ava",
    discussion: "Arutelu",
    noThreadMessages: "Selles lõimes pole sõnumeid.",
    writeReply: "Kirjuta vastus...",
    send: "Saada",
    adminOrganiserFlow: "Admini korraldaja töövoog",
    coachOrganiserFlow: "Treeneri korraldaja töövoog",
    organiserTitle: "Loo sisu, määra tööd, avalda tulemused",
    organiserText: "Admin haldab kataloogi ja registreeringuid. Treenerid ja adminid haldavad ülesandeid, replay analüüse ja rank'i arengut.",
    createGame: "Loo mäng",
    slug: "Slug",
    gameName: "Mängu nimi",
    createProgram: "Loo programm",
    game: "Mäng",
    programTitle: "Programmi pealkiri",
    description: "Kirjeldus",
    level: "Tase",
    price: "Hind",
    createLesson: "Loo tund",
    program: "Programm",
    lessonTitle: "Tunni pealkiri",
    content: "Sisu",
    scheduled: "Planeeritud",
    assignStudent: "Määra õpilane",
    status: "Staatus",
    createEnrollment: "Loo registreering",
    assignTrainingTask: "Määra treeningülesanne",
    taskTitle: "Ülesande pealkiri",
    instructions: "Juhised",
    assignTask: "Määra ülesanne",
    recordRankResult: "Salvesta rank'i tulemus",
    rank: "Rank",
    rating: "Reiting",
    recordedOn: "Salvestatud",
    saveResult: "Salvesta tulemus",
    enrollments: "Registreeringud",
    noEnrollments: "Registreeringuid pole.",
    noSubmissions: "Esitusi pole.",
    results: "Tulemused",
    noRankResults: "Rank'i tulemusi pole.",
    replay: "Replay",
    selectPlaceholder: "Vali...",
    notScheduled: "pole planeeritud",
    noRankProgress: "Rank'i arengut veel pole.",
    lightMode: "Hele režiim",
    darkMode: "Tume režiim",
    language: "Keel",
    theme: "Teema",
    conversationRequest: "Vestluse päring loodud, kui osalejad on saadaval.",
    gameplaySubmitted: "Gameplay replay esitatud.",
    taskSubmitted: "Ülesande esitus saadetud.",
    reviewPublished: "Gameplay analüüs avaldatud.",
    messageSent: "Sõnum saadetud.",
    gameCreated: "Mäng loodud.",
    gameDeleted: "Mäng kustutatud.",
    deleteGame: "Kustuta mäng",
    manageGames: "Halda mänge",
    programCreated: "Programm loodud.",
    lessonCreated: "Tund loodud.",
    enrollmentCreated: "Registreering loodud.",
    enrollmentStatusUpdated: "Registreeringu staatus uuendatud.",
    updateStatus: "Uuenda staatust",
    taskAssigned: "Treeningülesanne määratud.",
    rankRecorded: "Rank'i areng salvestatud.",
    sessionExpired: "Sessioon aegus. Logi uuesti sisse.",
    apiRequestFailed: "API päring ebaõnnestus staatusega {status}.",
    pending: "Ootel",
    active: "Aktiivne",
    completed: "Lõpetatud",
    cancelled: "Tühistatud",
    beginner: "Algaja",
    intermediate: "Kesktase",
    advanced: "Edasijõudnu"
  },
  ru: {
    assignmentClient: "Клиент для C# Web",
    heroTitleOne: "Прокачай свою игру.",
    heroTitleTwo: "Доминируй в рейтинге.",
    heroText: "Коучинговые программы, VOD-разборы, задания, история ранга и инструменты организатора в отдельном React-клиенте.",
    expertSessions: "экспертных сессий",
    progressLoops: "быстрых циклов прогресса",
    coachComms: "связь с тренером",
    operatorLogin: "Вход оператора",
    createAccount: "Создать аккаунт",
    enterCockpit: "Войти в панель",
    joinRankForge: "Присоединиться к RankForge",
    apiBaseUrl: "Базовый URL API",
    email: "Email",
    displayName: "Отображаемое имя",
    role: "Роль",
    password: "Пароль",
    login: "Войти",
    register: "Регистрация",
    needAccount: "Нужен аккаунт?",
    alreadyRegistered: "Уже зарегистрированы?",
    student: "Студент",
    coach: "Тренер",
    admin: "Админ",
    administrator: "Администратор",
    dashboard: "Панель",
    programs: "Программы",
    training: "Тренировка",
    vodReview: "VOD-разбор",
    messages: "Сообщения",
    adminOps: "Админка",
    coachOps: "Тренерская",
    logout: "Выйти",
    liveSession: "Активная сессия",
    studentCockpit: "Панель студента",
    roleCockpit: "Панель: {role}",
    refreshData: "Обновить данные",
    signedOut: "Вы вышли.",
    welcome: "Добро пожаловать, {name}.",
    dataSynced: "Данные синхронизированы с RankForge API.",
    todaysQueue: "Очередь на сегодня",
    welcomeBack: "С возвращением, {name}",
    studentHeroText: "Следи за планом, отправляй replay-работы и держи прогресс ранга на виду.",
    organiserHeroText: "Разбирай отправки, назначай задания и двигай тренировочный процесс.",
    continue: "Продолжить",
    activePrograms: "Активные программы",
    openTasks: "Открытые задания",
    latestRating: "Последний рейтинг",
    reviewLoops: "Циклы разбора",
    rankProgression: "Прогресс ранга",
    coachingSessions: "Коучинговые сессии",
    noScheduledLessons: "Запланированных уроков пока нет.",
    quickActions: "Быстрые действия",
    browsePrograms: "Смотреть программы",
    openReviewRoom: "Открыть разбор",
    messageThread: "Переписка",
    taskTracking: "Трекинг заданий",
    noTasks: "Задания не назначены.",
    due: "срок",
    programMarketplace: "Каталог программ",
    choosePath: "Выбери путь прокачки",
    marketplaceText: "Публичные данные API видны до входа; авторизованные пользователи могут связаться с тренерами.",
    requestCoaching: "Запросить коучинг",
    games: "Игры",
    noGames: "Игр пока нет.",
    lessonLibrary: "Библиотека уроков",
    noLessons: "Уроков пока нет.",
    studentFlow: "Поток студента",
    trainingTitle: "Задания, отправки и активные записи",
    trainingText: "Студенты отправляют назначенные работы и ссылки на gameplay replay. Тренеры и админы видят свои очереди.",
    myEnrollments: "Мои записи",
    noEnrollmentsAssigned: "Записи пока не назначены.",
    submitGameplay: "Отправить gameplay",
    enrollment: "Запись",
    replayUrl: "Replay URL",
    notes: "Заметки",
    submitReplay: "Отправить replay",
    assignedTasks: "Назначенные задания",
    select: "Выбрать",
    taskSubmission: "Отправка задания",
    task: "Задание",
    submissionNotes: "Заметки к отправке",
    sendWork: "Отправить работу",
    timelineFeedback: "Фидбек на таймлайне",
    selectGameplayVideo: "Выбери gameplay-отправку с video URL.",
    reviewPanel: "Панель разбора",
    mechanics: "Механика",
    gameSense: "Понимание игры",
    positioning: "Позиционирование",
    communication: "Коммуникация",
    submissions: "Отправки",
    noGameplaySubmissions: "Gameplay-отправок пока нет.",
    review: "Разобрать",
    coachFeedback: "Фидбек тренера",
    submission: "Отправка",
    feedback: "Фидбек",
    reviewVideoUrl: "URL видео-разбора",
    publishReview: "Опубликовать разбор",
    conversations: "Диалоги",
    noConversations: "Диалогов пока нет.",
    open: "Открыть",
    discussion: "Обсуждение",
    noThreadMessages: "В этом диалоге нет сообщений.",
    writeReply: "Написать ответ...",
    send: "Отправить",
    adminOrganiserFlow: "Поток администратора",
    coachOrganiserFlow: "Поток тренера",
    organiserTitle: "Создавай контент, назначай работу, публикуй результаты",
    organiserText: "Админ управляет каталогом и записями. Тренеры и админы ведут задания, replay-разборы и прогресс ранга.",
    createGame: "Создать игру",
    slug: "Slug",
    gameName: "Название игры",
    createProgram: "Создать программу",
    game: "Игра",
    programTitle: "Название программы",
    description: "Описание",
    level: "Уровень",
    price: "Цена",
    createLesson: "Создать урок",
    program: "Программа",
    lessonTitle: "Название урока",
    content: "Контент",
    scheduled: "Запланировано",
    assignStudent: "Назначить студента",
    status: "Статус",
    createEnrollment: "Создать запись",
    assignTrainingTask: "Назначить тренировочное задание",
    taskTitle: "Название задания",
    instructions: "Инструкции",
    assignTask: "Назначить задание",
    recordRankResult: "Записать результат ранга",
    rank: "Ранг",
    rating: "Рейтинг",
    recordedOn: "Дата записи",
    saveResult: "Сохранить результат",
    enrollments: "Записи",
    noEnrollments: "Записей нет.",
    noSubmissions: "Отправок нет.",
    results: "Результаты",
    noRankResults: "Результатов ранга нет.",
    replay: "Replay",
    selectPlaceholder: "Выбрать...",
    notScheduled: "не запланировано",
    noRankProgress: "Прогресса ранга пока нет.",
    lightMode: "Светлая тема",
    darkMode: "Темная тема",
    language: "Язык",
    theme: "Тема",
    conversationRequest: "Запрос диалога создан, если участники доступны.",
    gameplaySubmitted: "Gameplay replay отправлен.",
    taskSubmitted: "Отправка задания выполнена.",
    reviewPublished: "Gameplay-разбор опубликован.",
    messageSent: "Сообщение отправлено.",
    gameCreated: "Игра создана.",
    gameDeleted: "Игра удалена.",
    deleteGame: "Удалить игру",
    manageGames: "Управление играми",
    programCreated: "Программа создана.",
    lessonCreated: "Урок создан.",
    enrollmentCreated: "Запись создана.",
    enrollmentStatusUpdated: "Статус записи обновлен.",
    updateStatus: "Обновить статус",
    taskAssigned: "Тренировочное задание назначено.",
    rankRecorded: "Прогресс ранга записан.",
    sessionExpired: "Сессия истекла. Войдите снова.",
    apiRequestFailed: "API-запрос завершился ошибкой {status}.",
    pending: "Ожидает",
    active: "Активна",
    completed: "Завершена",
    cancelled: "Отменена",
    beginner: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый"
  }
};

function App() {
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

function AuthScreen({
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

function Sidebar({ user, activeView, setActiveView, canOrganise, logout }) {
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

function Topbar({ user, apiUrl, setApiUrl, loading, reload, message }) {
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

function Dashboard({ data, user, setActiveView }) {
  const { t, formatDateTime } = useUi();
  const activeEnrollments = data.enrollments.filter((x) => x.status === "Active");
  const openTasks = data.tasks.filter((x) => x.submissionCount === 0);
  const latestProgress = [...data.progress].sort((a, b) => b.recordedOn.localeCompare(a.recordedOn))[0];
  const reviewed = data.submissions.filter((x) => x.status !== "Submitted").length + data.reviews.length;
  const isAdmin = isAdminRole(user.role);

  return (
    <div className="dashboard-layout">
      <section className="content-stack">
        <div className="hero-strip">
          <div>
            <p className="eyebrow">{t("todaysQueue")}</p>
            <h2>{t("welcomeBack", { name: user.displayName })}</h2>
            <p>
              {user.role === "Student"
                ? t("studentHeroText")
                : t("organiserHeroText")}
            </p>
          </div>
          <button className="primary-action small" onClick={() => setActiveView(user.role === "Student" ? "training" : "organiser")}>
            <PlayCircle size={18} />
            {t("continue")}
          </button>
        </div>

        <div className="stat-grid">
          <Stat icon={BadgeCheck} label={t("activePrograms")} value={activeEnrollments.length} />
          <Stat icon={Target} label={t("openTasks")} value={openTasks.length} />
          <Stat
            icon={isAdmin ? Gamepad2 : BarChart3}
            label={isAdmin ? t("games") : t("latestRating")}
            value={isAdmin ? data.games.length : latestProgress?.rating ?? "N/A"}
          />
          <Stat icon={Activity} label={t("reviewLoops")} value={reviewed} />
        </div>

        <section className="panel-grid two">
          {!isAdmin && (
            <Card title={t("rankProgression")} icon={BarChart3}>
              <RankBars progress={data.progress} />
            </Card>
          )}
          {isAdmin && (
            <Card title={t("manageGames")} icon={Gamepad2}>
              <List
                empty={t("noGames")}
                items={data.games.slice(0, 6)}
                render={(game) => <ListRow key={game.id} title={game.name} meta={game.slug} />}
              />
            </Card>
          )}
          <Card title={t("coachingSessions")} icon={BookOpen}>
            <List
              empty={t("noScheduledLessons")}
              items={data.lessons.slice(0, 5)}
              render={(lesson) => (
                <ListRow
                  key={lesson.id}
                  title={lesson.title}
                  meta={`${lesson.program} / ${formatDateTime(lesson.scheduledAtUtc)}`}
                />
              )}
            />
          </Card>
        </section>
      </section>

      <aside className="right-rail">
        <Card title={t("quickActions")} icon={Radio}>
          <button className="rail-action" onClick={() => setActiveView("catalog")}>
            <Trophy size={18} />
            {t("browsePrograms")}
          </button>
          <button className="rail-action" onClick={() => setActiveView("reviews")}>
            <Video size={18} />
            {t("openReviewRoom")}
          </button>
          <button className="rail-action" onClick={() => setActiveView("messages")}>
            <MessageSquareText size={18} />
            {t("messageThread")}
          </button>
        </Card>
        <Card title={t("taskTracking")} icon={ClipboardCheck}>
          <List
            empty={t("noTasks")}
            items={data.tasks.slice(0, 4)}
            render={(task) => (
              <ListRow
                key={task.id}
                title={task.title}
                meta={`${task.submissionCount} ${t("submissions").toLowerCase()} / ${t("due")} ${formatDateTime(task.dueAtUtc)}`}
              />
            )}
          />
        </Card>
      </aside>
    </div>
  );
}

function Catalog({ data, user, mutate, client }) {
  const { t, formatDateTime, currency } = useUi();
  return (
    <div className="content-stack">
      <SectionIntro
        eyebrow={t("programMarketplace")}
        title={t("choosePath")}
        text={t("marketplaceText")}
      />
      <div className="program-grid">
        {data.programs.map((program) => (
          <article className="program-card" key={program.id}>
            <div className="program-icon">
              <Gamepad2 size={24} />
            </div>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
            <div className="program-meta">
              <span>{program.game}</span>
              <span>{localizeLevel(program.level, t)}</span>
              <span>{currency(program.price)}</span>
            </div>
            <div className="program-footer">
              <span>{t("coach")} {program.coach}</span>
              <button
                className="ghost-action"
                onClick={() =>
                  mutate(t("conversationRequest"), async () => {
                    if (!user) return;
                    await client.get("/api/v1/conversations").catch(() => []);
                  })
                }
              >
                {t("requestCoaching")}
              </button>
            </div>
          </article>
        ))}
      </div>
      <section className="panel-grid two">
        <Card title={t("games")} icon={Gamepad2}>
          <List
            empty={t("noGames")}
            items={data.games}
            render={(game) => <ListRow key={game.id} title={game.name} meta={game.slug} />}
          />
        </Card>
        <Card title={t("lessonLibrary")} icon={BookOpen}>
          <List
            empty={t("noLessons")}
            items={data.lessons}
            render={(lesson) => (
              <ListRow key={lesson.id} title={lesson.title} meta={`${lesson.program} / ${formatDateTime(lesson.scheduledAtUtc)}`} />
            )}
          />
        </Card>
      </section>
    </div>
  );
}

function Training({ data, mutate, client }) {
  const { t } = useUi();
  const [taskId, setTaskId] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [gameplay, setGameplay] = useState({ enrollmentId: "", videoUrl: "", notes: "" });

  useEffect(() => {
    if (!taskId && data.tasks[0]) setTaskId(data.tasks[0].id);
    if (!gameplay.enrollmentId && data.enrollments[0]) {
      setGameplay((current) => ({ ...current, enrollmentId: data.enrollments[0].id }));
    }
  }, [data.tasks, data.enrollments]);

  return (
    <div className="content-stack">
      <SectionIntro
        eyebrow={t("studentFlow")}
        title={t("trainingTitle")}
        text={t("trainingText")}
      />
      <section className="panel-grid two">
        <Card title={t("myEnrollments")} icon={BadgeCheck}>
          <List
            empty={t("noEnrollmentsAssigned")}
            items={data.enrollments}
            render={(item) => <ListRow key={item.id} title={item.program} meta={`${item.student} / ${localizeStatus(item.status, t)}`} />}
          />
        </Card>
        <Card title={t("submitGameplay")} icon={Video}>
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault();
              mutate(t("gameplaySubmitted"), () => client.post("/api/v1/gameplaysubmissions", gameplay));
              setGameplay({ enrollmentId: gameplay.enrollmentId, videoUrl: "", notes: "" });
            }}
          >
            <SelectField label={t("enrollment")} value={gameplay.enrollmentId} onChange={(value) => setGameplay({ ...gameplay, enrollmentId: value })}>
              {data.enrollments.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.program}
                </option>
              ))}
            </SelectField>
            <InputField label={t("replayUrl")} value={gameplay.videoUrl} onChange={(value) => setGameplay({ ...gameplay, videoUrl: value })} required />
            <TextareaField label={t("notes")} value={gameplay.notes} onChange={(value) => setGameplay({ ...gameplay, notes: value })} />
            <button className="primary-action small">{t("submitReplay")}</button>
          </form>
        </Card>
      </section>
      <section className="panel-grid two">
        <Card title={t("assignedTasks")} icon={ClipboardCheck}>
          <List
            empty={t("noTasks")}
            items={data.tasks}
            render={(task) => (
              <ListRow
                key={task.id}
                title={task.title}
                meta={`${task.instructions} / ${task.submissionCount} submissions`}
                action={<button className="chip-button" onClick={() => setTaskId(task.id)}>{t("select")}</button>}
              />
            )}
          />
        </Card>
        <Card title={t("taskSubmission")} icon={Target}>
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault();
              mutate(t("taskSubmitted"), () => client.post(`/api/v1/trainingtasks/${taskId}/submissions`, { notes: taskNotes }));
              setTaskNotes("");
            }}
          >
            <SelectField label={t("task")} value={taskId} onChange={setTaskId}>
              {data.tasks.map((task) => (
                <option value={task.id} key={task.id}>
                  {task.title}
                </option>
              ))}
            </SelectField>
            <TextareaField label={t("submissionNotes")} value={taskNotes} onChange={setTaskNotes} required />
            <button className="primary-action small" disabled={!taskId}>
              {t("sendWork")}
            </button>
          </form>
        </Card>
      </section>
    </div>
  );
}

function Reviews({ data, mutate, client, user }) {
  const { t } = useUi();
  const selected = data.submissions[0];
  const [review, setReview] = useState({ gameplaySubmissionId: "", feedback: "", reviewVideoUrl: "" });

  useEffect(() => {
    if (!review.gameplaySubmissionId && selected) {
      setReview((current) => ({ ...current, gameplaySubmissionId: selected.id }));
    }
  }, [selected]);

  const canReview = isAdminRole(user.role) || user.role === "Coach";

  return (
    <div className="review-layout">
      <section className="video-stage">
        <div className="video-frame">
          {selected?.videoUrl ? (
            <iframe title="Gameplay replay" src={toEmbeddableUrl(selected.videoUrl)} allowFullScreen />
          ) : (
            <div className="empty-video">
              <Video size={52} />
              <p>{t("selectGameplayVideo")}</p>
            </div>
          )}
        </div>
        <Card title={t("timelineFeedback")} icon={Activity}>
          <div className="timeline">
            {[
              ["00:45", "positive", "Opening rotation creates map control."],
              ["03:12", "warning", "Missed timing window; review positioning."],
              ["08:20", "positive", "Clean execution after drill adjustment."]
            ].map(([time, tone, text]) => (
              <div className={`timeline-item ${tone}`} key={time}>
                <span>{time}</span>
                <p>{text}</p>
                <button className="chip-button">Jump</button>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <aside className="review-panel">
        <Card title={t("reviewPanel")} icon={ShieldCheck}>
          <Score label={t("mechanics")} value={82} />
          <Score label={t("gameSense")} value={76} />
          <Score label={t("positioning")} value={69} />
          <Score label={t("communication")} value={88} />
        </Card>
        <Card title={t("submissions")} icon={Video}>
          <List
            empty={t("noGameplaySubmissions")}
            items={data.submissions}
            render={(submission) => (
              <ListRow
                key={submission.id}
                title={submission.notes || "Gameplay replay"}
                meta={`${localizeStatus(submission.status, t)} / ${submission.videoUrl}`}
                action={<button className="chip-button" onClick={() => setReview({ ...review, gameplaySubmissionId: submission.id })}>{t("review")}</button>}
              />
            )}
          />
        </Card>
        {canReview && (
          <Card title={t("coachFeedback")} icon={Plus}>
            <form
              className="form-stack"
              onSubmit={(event) => {
                event.preventDefault();
                mutate(t("reviewPublished"), () => client.post("/api/v1/gameplayreviews", review));
                setReview({ gameplaySubmissionId: review.gameplaySubmissionId, feedback: "", reviewVideoUrl: "" });
              }}
            >
              <SelectField label={t("submission")} value={review.gameplaySubmissionId} onChange={(value) => setReview({ ...review, gameplaySubmissionId: value })}>
                {data.submissions.map((submission) => (
                  <option value={submission.id} key={submission.id}>
                    {submission.notes || submission.id}
                  </option>
                ))}
              </SelectField>
              <TextareaField label={t("feedback")} value={review.feedback} onChange={(value) => setReview({ ...review, feedback: value })} required />
              <InputField label={t("reviewVideoUrl")} value={review.reviewVideoUrl} onChange={(value) => setReview({ ...review, reviewVideoUrl: value })} />
              <button className="primary-action small">{t("publishReview")}</button>
            </form>
          </Card>
        )}
      </aside>
    </div>
  );
}

function Messages({ data, mutate, client, user }) {
  const { t } = useUi();
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!selectedId && data.conversations[0]) setSelectedId(data.conversations[0].id);
  }, [data.conversations]);

  useEffect(() => {
    if (!selectedId) return;
    client.get(`/api/v1/conversations/${selectedId}/messages`).then(setMessages).catch(() => setMessages([]));
  }, [client, selectedId]);

  return (
    <div className="messages-layout">
      <Card title={t("conversations")} icon={MessageSquareText}>
        <List
          empty={t("noConversations")}
          items={data.conversations}
          render={(conversation) => (
            <ListRow
              key={conversation.id}
              title={user.role === "Student" ? conversation.coach : conversation.student}
              meta={`${conversation.messageCount} ${t("messages").toLowerCase()}`}
              action={<button className="chip-button" onClick={() => setSelectedId(conversation.id)}>{t("open")}</button>}
            />
          )}
        />
      </Card>
      <Card title={t("discussion")} icon={Users}>
        <div className="chat-log">
          {messages.length === 0 && <p className="empty-state">{t("noThreadMessages")}</p>}
          {messages.map((item) => (
            <div className={item.senderId === user.id ? "chat-bubble mine" : "chat-bubble"} key={item.id}>
              <span>{item.sender}</span>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <form
          className="message-form"
          onSubmit={(event) => {
            event.preventDefault();
            mutate(t("messageSent"), () => client.post(`/api/v1/conversations/${selectedId}/messages`, { body }));
            setBody("");
          }}
        >
          <input value={body} onChange={(event) => setBody(event.target.value)} placeholder={t("writeReply")} required />
          <button className="primary-action small" disabled={!selectedId}>
            {t("send")}
          </button>
        </form>
      </Card>
    </div>
  );
}

function Organiser({ data, mutate, client, user, isAdmin, isCoach }) {
  const { t } = useUi();
  const [game, setGame] = useState({ slug: "", name: emptyLang });
  const [program, setProgram] = useState({ gameId: "", coachId: "", title: emptyLang, description: "", level: "Beginner", price: 0 });
  const [lesson, setLesson] = useState({ coachingProgramId: "", title: emptyLang, content: "", scheduledAtUtc: "" });
  const [enrollment, setEnrollment] = useState({ studentId: "", coachingProgramId: "", status: "Active" });
  const [task, setTask] = useState({ enrollmentId: "", title: emptyLang, instructions: "", dueAtUtc: "" });
  const [rank, setRank] = useState({ studentId: "", gameId: "", rankName: "", rating: 1000, recordedOn: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    setProgram((current) => ({
      ...current,
      gameId: current.gameId || data.games[0]?.id || "",
      coachId: current.coachId || data.coaches[0]?.id || user.id
    }));
    setLesson((current) => ({ ...current, coachingProgramId: current.coachingProgramId || data.programs[0]?.id || "" }));
    setEnrollment((current) => ({
      ...current,
      studentId: current.studentId || data.students[0]?.id || "",
      coachingProgramId: current.coachingProgramId || data.programs[0]?.id || ""
    }));
    setTask((current) => ({ ...current, enrollmentId: current.enrollmentId || data.enrollments[0]?.id || "" }));
    setRank((current) => ({
      ...current,
      studentId: current.studentId || data.students[0]?.id || data.enrollments[0]?.studentId || "",
      gameId: current.gameId || data.games[0]?.id || ""
    }));
  }, [data.games, data.programs, data.coaches, data.students, data.enrollments, user.id]);

  return (
    <div className="content-stack">
      <SectionIntro
        eyebrow={isAdmin ? t("adminOrganiserFlow") : t("coachOrganiserFlow")}
        title={t("organiserTitle")}
        text={t("organiserText")}
      />
      <section className="panel-grid two">
        {isAdmin && (
          <>
            <Card title={t("createGame")} icon={Gamepad2}>
              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  mutate(t("gameCreated"), () => client.post("/api/v1/games", game));
                  setGame({ slug: "", name: emptyLang });
                }}
              >
                <InputField label={t("slug")} value={game.slug} onChange={(value) => setGame({ ...game, slug: value })} required />
                <LangFields value={game.name} onChange={(name) => setGame({ ...game, name })} label={t("gameName")} />
                <button className="primary-action small">{t("createGame")}</button>
              </form>
            </Card>
            <Card title={t("manageGames")} icon={Gamepad2}>
              <List
                empty={t("noGames")}
                items={data.games}
                render={(item) => (
                  <ListRow
                    key={item.id}
                    title={item.name}
                    meta={item.slug}
                    action={
                      <button
                        className="chip-button danger"
                        onClick={() => mutate(t("gameDeleted"), () => client.delete(`/api/v1/games/${item.id}`))}
                      >
                        {t("deleteGame")}
                      </button>
                    }
                  />
                )}
              />
            </Card>
            <Card title={t("createProgram")} icon={CircleDollarSign}>
              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  mutate(t("programCreated"), () => client.post("/api/v1/coachingprograms", { ...program, price: Number(program.price) }));
                  setProgram({ ...program, title: emptyLang, description: "", price: 0 });
                }}
              >
                <SelectField label={t("game")} value={program.gameId} onChange={(value) => setProgram({ ...program, gameId: value })}>
                  {data.games.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                </SelectField>
                <SelectField label={t("coach")} value={program.coachId} onChange={(value) => setProgram({ ...program, coachId: value })}>
                  {data.coaches.map((item) => <option value={item.id} key={item.id}>{item.displayName}</option>)}
                </SelectField>
                <LangFields value={program.title} onChange={(title) => setProgram({ ...program, title })} label={t("programTitle")} />
                <TextareaField label={t("description")} value={program.description} onChange={(value) => setProgram({ ...program, description: value })} />
                <SelectField label={t("level")} value={program.level} onChange={(value) => setProgram({ ...program, level: value })}>
                  {levels.map((item) => <option key={item} value={item}>{localizeLevel(item, t)}</option>)}
                </SelectField>
                <InputField label={t("price")} type="number" value={program.price} onChange={(value) => setProgram({ ...program, price: value })} />
                <button className="primary-action small">{t("createProgram")}</button>
              </form>
            </Card>
            <Card title={t("createLesson")} icon={BookOpen}>
              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  mutate(t("lessonCreated"), () =>
                    client.post("/api/v1/lessons", {
                      ...lesson,
                      scheduledAtUtc: lesson.scheduledAtUtc ? new Date(lesson.scheduledAtUtc).toISOString() : null
                    })
                  );
                  setLesson({ ...lesson, title: emptyLang, content: "", scheduledAtUtc: "" });
                }}
              >
                <SelectField label={t("program")} value={lesson.coachingProgramId} onChange={(value) => setLesson({ ...lesson, coachingProgramId: value })}>
                  {data.programs.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
                </SelectField>
                <LangFields value={lesson.title} onChange={(title) => setLesson({ ...lesson, title })} label={t("lessonTitle")} />
                <TextareaField label={t("content")} value={lesson.content} onChange={(value) => setLesson({ ...lesson, content: value })} />
                <InputField label={t("scheduled")} type="datetime-local" value={lesson.scheduledAtUtc} onChange={(value) => setLesson({ ...lesson, scheduledAtUtc: value })} />
                <button className="primary-action small">{t("createLesson")}</button>
              </form>
            </Card>
            <Card title={t("assignStudent")} icon={UserPlus}>
              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  mutate(t("enrollmentCreated"), () => client.post("/api/v1/enrollments", enrollment));
                }}
              >
                <SelectField label={t("student")} value={enrollment.studentId} onChange={(value) => setEnrollment({ ...enrollment, studentId: value })}>
                  {data.students.map((item) => <option value={item.id} key={item.id}>{item.displayName}</option>)}
                </SelectField>
                <SelectField label={t("program")} value={enrollment.coachingProgramId} onChange={(value) => setEnrollment({ ...enrollment, coachingProgramId: value })}>
                  {data.programs.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
                </SelectField>
                <SelectField label={t("status")} value={enrollment.status} onChange={(value) => setEnrollment({ ...enrollment, status: value })}>
                  {statuses.map((item) => <option key={item} value={item}>{localizeStatus(item, t)}</option>)}
                </SelectField>
                <button className="primary-action small">{t("createEnrollment")}</button>
              </form>
            </Card>
          </>
        )}

        {(isAdmin || isCoach) && (
            <Card title={t("assignTrainingTask")} icon={ClipboardCheck}>
              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  mutate(t("taskAssigned"), () =>
                    client.post("/api/v1/trainingtasks", {
                      ...task,
                      dueAtUtc: task.dueAtUtc ? new Date(task.dueAtUtc).toISOString() : null
                    })
                  );
                  setTask({ ...task, title: emptyLang, instructions: "", dueAtUtc: "" });
                }}
              >
                <SelectField label={t("enrollment")} value={task.enrollmentId} onChange={(value) => setTask({ ...task, enrollmentId: value })}>
                  {data.enrollments.map((item) => <option value={item.id} key={item.id}>{item.student} - {item.program}</option>)}
                </SelectField>
                <LangFields value={task.title} onChange={(title) => setTask({ ...task, title })} label={t("taskTitle")} />
                <TextareaField label={t("instructions")} value={task.instructions} onChange={(value) => setTask({ ...task, instructions: value })} />
                <InputField label={t("due")} type="datetime-local" value={task.dueAtUtc} onChange={(value) => setTask({ ...task, dueAtUtc: value })} />
                <button className="primary-action small">{t("assignTask")}</button>
              </form>
            </Card>
        )}
        {isCoach && (
            <Card title={t("recordRankResult")} icon={BarChart3}>
              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  mutate(t("rankRecorded"), () =>
                    client.post("/api/v1/rankprogress", { ...rank, rating: Number(rank.rating) })
                  );
                }}
              >
                <SelectField label={t("student")} value={rank.studentId} onChange={(value) => setRank({ ...rank, studentId: value })}>
                  {(isAdmin ? data.students : uniqueStudentsFromEnrollments(data.enrollments)).map((item) => (
                    <option value={item.id} key={item.id}>{item.displayName}</option>
                  ))}
                </SelectField>
                <SelectField label={t("game")} value={rank.gameId} onChange={(value) => setRank({ ...rank, gameId: value })}>
                  {data.games.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                </SelectField>
                <InputField label={t("rank")} value={rank.rankName} onChange={(value) => setRank({ ...rank, rankName: value })} required />
                <InputField label={t("rating")} type="number" value={rank.rating} onChange={(value) => setRank({ ...rank, rating: value })} />
                <InputField label={t("recordedOn")} type="date" value={rank.recordedOn} onChange={(value) => setRank({ ...rank, recordedOn: value })} />
                <button className="primary-action small">{t("saveResult")}</button>
              </form>
            </Card>
        )}
      </section>
      <section className="panel-grid three">
        <Card title={t("enrollments")} icon={BadgeCheck}>
          <List
            empty={t("noEnrollments")}
            items={data.enrollments}
            render={(item) => (
              <ListRow
                key={item.id}
                title={item.program}
                meta={`${item.student} / ${localizeStatus(item.status, t)}`}
                action={
                  isAdmin ? (
                    <EnrollmentStatusAction enrollment={item} mutate={mutate} client={client} />
                  ) : null
                }
              />
            )}
          />
        </Card>
        <Card title={t("submissions")} icon={Video}>
          <List empty={t("noSubmissions")} items={data.submissions} render={(item) => <ListRow key={item.id} title={item.notes || t("replay")} meta={localizeStatus(item.status, t)} />} />
        </Card>
        {!isAdmin && (
          <Card title={t("results")} icon={BarChart3}>
            <List empty={t("noRankResults")} items={data.progress} render={(item) => <ListRow key={item.id} title={`${item.rankName} / ${item.rating}`} meta={`${item.game} / ${item.recordedOn}`} />} />
          </Card>
        )}
      </section>
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
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

function EnrollmentStatusAction({ enrollment, mutate, client }) {
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

function PreferenceControls({ language, setLanguage, theme, setTheme, compact = false }) {
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

function MetricCard({ value, label }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <article className="stat-card">
      <Icon size={20} />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function List({ items, render, empty }) {
  if (!items?.length) return <p className="empty-state">{empty}</p>;
  return <div className="list-stack">{items.map(render)}</div>;
}

function ListRow({ title, meta, action }) {
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

function RankBars({ progress }) {
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

function Score({ label, value }) {
  return (
    <div className="score-row">
      <span>{label}</span>
      <div><i style={{ width: `${value}%` }} /></div>
      <strong>{value}</strong>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", required = false }) {
  return (
    <label>
      {label}
      <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function TextareaField({ label, value, onChange, required = false }) {
  return (
    <label>
      {label}
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function SelectField({ label, value, onChange, children }) {
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

function LangFields({ value, onChange, label }) {
  return (
    <div className="lang-grid">
      <InputField label={`${label} EN`} value={value.en} onChange={(en) => onChange({ ...value, en })} required />
      <InputField label={`${label} ET`} value={value.et} onChange={(et) => onChange({ ...value, et })} />
      <InputField label={`${label} RU`} value={value.ru} onChange={(ru) => onChange({ ...value, ru })} />
    </div>
  );
}

function createApiClient(apiUrl, tokens, updateSession, onLogout, language) {
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

function initialData() {
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

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.user));
  } catch {
    return null;
  }
}

function useUi() {
  return useContext(UiContext);
}

function translate(language, key, values = {}) {
  const template = translations[language]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function withCulture(path, culture) {
  if (!path.startsWith("/api/")) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}culture=${encodeURIComponent(culture)}&ui-culture=${encodeURIComponent(culture)}`;
}

function formatDateTime(value, language = "en") {
  if (!value) return translate(language, "notScheduled");
  return new Intl.DateTimeFormat(languages.find((item) => item.code === language)?.culture || "en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function currency(value, language = "en") {
  return new Intl.NumberFormat(languages.find((item) => item.code === language)?.culture || "en-US", {
    style: "currency",
    currency: "EUR"
  }).format(Number(value || 0));
}

function toEmbeddableUrl(url) {
  if (!url) return "";
  if (url.includes("youtube.com/watch")) return url.replace("watch?v=", "embed/");
  return url;
}

function uniqueStudentsFromEnrollments(enrollments) {
  const rows = new Map();
  enrollments.forEach((item) => rows.set(item.studentId, { id: item.studentId, displayName: item.student }));
  return [...rows.values()];
}

function isAdminRole(role) {
  return role === "Admin" || role === "Administrator";
}

function roleLabel(role, t) {
  if (role === "Student") return t("student");
  if (role === "Coach") return t("coach");
  if (role === "Admin") return t("admin");
  if (role === "Administrator") return t("administrator");
  return role;
}

function localizeStatus(status, t) {
  const key = String(status || "").toLowerCase();
  return translations.en[key] ? t(key) : status;
}

function localizeLevel(level, t) {
  const key = String(level || "").toLowerCase();
  return translations.en[key] ? t(key) : level;
}

createRoot(document.getElementById("root")).render(<App />);
