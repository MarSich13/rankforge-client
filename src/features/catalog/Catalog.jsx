import React from "react";
import { BookOpen, Gamepad2 } from "lucide-react";
import { useUi } from "../../i18n/ui.jsx";
import { localizeLevel } from "../../utils/roles.js";
import { Card, List, ListRow, SectionIntro } from "../../components/shared.jsx";

export default function Catalog({ data, user, mutate, client }) {
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
