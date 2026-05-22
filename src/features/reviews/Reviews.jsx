import React, { useEffect, useState } from "react";
import { Activity, Plus, ShieldCheck, Video } from "lucide-react";
import { useUi } from "../../i18n/ui.jsx";
import { isAdminRole, localizeStatus } from "../../utils/roles.js";
import { Card, InputField, List, ListRow, Score, SelectField, TextareaField } from "../../components/shared.jsx";

function toEmbeddableUrl(url) {
  if (!url) return "";
  if (url.includes("youtube.com/watch")) return url.replace("watch?v=", "embed/");
  return url;
}

export default function Reviews({ data, mutate, client, user }) {
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
