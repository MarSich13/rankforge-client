import React, { useEffect, useState } from "react";
import { MessageSquareText, Users } from "lucide-react";
import { useUi } from "../../i18n/ui.jsx";
import { Card, List, ListRow } from "../../components/shared.jsx";

export default function Messages({ data, mutate, client, user }) {
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
