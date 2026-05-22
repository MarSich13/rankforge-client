import React from "react";
import { Activity, BadgeCheck, BarChart3, BookOpen, Gamepad2, MessageSquareText, PlayCircle, Radio, Target, Trophy, Video } from "lucide-react";
import { useUi } from "../../i18n/ui.jsx";
import { isAdminRole } from "../../utils/roles.js";
import { Card, List, ListRow, RankBars, Stat } from "../../components/shared.jsx";

export default function Dashboard({ data, user, setActiveView }) {
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
