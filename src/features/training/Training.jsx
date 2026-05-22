import React, { useEffect, useState } from "react";
import { BadgeCheck, ClipboardCheck, Target, Video } from "lucide-react";
import { useUi } from "../../i18n/ui.jsx";
import { localizeStatus } from "../../utils/roles.js";
import { Card, InputField, List, ListRow, SelectField, SectionIntro, TextareaField } from "../../components/shared.jsx";

export default function Training({ data, mutate, client }) {
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
