import React, { useEffect, useState } from "react";
import { BadgeCheck, BarChart3, BookOpen, CircleDollarSign, ClipboardCheck, Gamepad2, UserPlus, Video } from "lucide-react";
import { emptyLang, levels, statuses } from "../../constants.js";
import { useUi } from "../../i18n/ui.jsx";
import { localizeLevel, localizeStatus, uniqueStudentsFromEnrollments } from "../../utils/roles.js";
import { Card, EnrollmentStatusAction, InputField, LangFields, List, ListRow, SelectField, SectionIntro, TextareaField } from "../../components/shared.jsx";

export default function Organiser({ data, mutate, client, user, isAdmin, isCoach }) {
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
