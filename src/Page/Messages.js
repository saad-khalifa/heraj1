import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ThemeContext } from "../contexts/ThemeContext"; // لاستيراد الـ context الخاص بالثيم

const BASE_URL = "http://localhost:8000";

function Messages() {
  const { token, user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);  // جلب حالة الثيم
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const {
    data: messages = [],
    refetch: refetchMessages,
    isFetching: loadingMessages,
  } = useQuery({
    queryKey: ["messages", selectedUser],
    queryFn: async () => {
      if (!selectedUser) return [];
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/chat/${selectedUser}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // تحديث الرسائل كمقروءة
        await axios.post(
          `${BASE_URL}/api/messages/mark-as-read/${selectedUser}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        refetchConversations();
        return res.data;
      } catch (error) {
        console.error("خطأ أثناء جلب الرسائل", error);
        return [];
      }
    },
    enabled: !!selectedUser && !!token,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return await axios.post(
        `${BASE_URL}/api/messages`,
        {
          ad_id: null,
          message: newMessage,
          receiver_id: selectedUser,
          parent_id: replyTo ? replyTo.id : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      setNewMessage("");
      setReplyTo(null);
      refetchMessages();
      refetchConversations();
    },
    onError: () => {
      alert("حدث خطأ أثناء إرسال الرسالة");
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (msgId) => {
      await axios.delete(`${BASE_URL}/api/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      refetchMessages();
      refetchConversations();
    },
    onError: () => {
      alert("حدث خطأ أثناء حذف الرسالة");
    },
  });

  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#000";
  const chatBackgroundColor = theme === "dark" ? "#444" : "#f4f4f4";
  const messageBackgroundColor = theme === "dark" ? "#555" : "#dcf8c6";

  return (
    <div className="container mt-4" style={{ display: "flex", gap: "1rem" }}>
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ccc",
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <h3>المحادثات</h3>
        {conversations.length === 0 ? (
          <p>لا توجد محادثات حالياً</p>
        ) : (
          <ul className="list-group">
            {conversations.map((msg) => {
              const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
              const otherUserName =
                msg.sender_id === user.id ? msg.receiver.name : msg.sender.name;
              const unreadCount = msg.unread_count || 0;

              return (
                <li
                  key={msg.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    selectedUser === otherUserId ? "active" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedUser === otherUserId ? chatBackgroundColor : backgroundColor,
                  }}
                  onClick={() => setSelectedUser(otherUserId)}
                >
                  <div>
                    <strong>المستخدم: {otherUserName || otherUserId}</strong>
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {msg.message}
                    </p>
                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                  </div>
                  {unreadCount > 0 && (
                    <span className="badge bg-danger rounded-pill">{unreadCount}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <h3>المحادثة</h3>
        {!selectedUser ? (
          <p>اختر محادثة للبدء بالقراءة والرد</p>
        ) : loadingMessages ? (
          <p>جارٍ تحميل الرسائل...</p>
        ) : (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "5px",
              maxHeight: "400px",
              backgroundColor: chatBackgroundColor,
              color: textColor,
            }}
          >
            {messages.length === 0 ? (
              <p>لا توجد رسائل بعد.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "1rem",
                    textAlign: msg.sender_id === user.id ? "right" : "left",
                    backgroundColor: msg.sender_id === user.id ? messageBackgroundColor : "#fff",
                    padding: "0.5rem 1rem",
                    borderRadius: "10px",
                    position: "relative",
                    backgroundColor: theme === "dark" ? "#555" : "#fff", // الخلفية لكل رسالة
                    color: textColor, // النص بالوضع الليلي
                  }}
                >
                  <div>
                    <strong>{msg.sender_id === user.id ? "أنت" : msg.sender.name}</strong>
                    {msg.parent_id && (
                      <div
                        style={{
                          fontSize: "0.8em",
                          fontStyle: "italic",
                          color: "#555",
                          marginTop: "0.3rem",
                        }}
                      >
                        رد على: {messages.find((m) => m.id === msg.parent_id)?.message || "رسالة غير متوفرة"}
                      </div>
                    )}
                  </div>
                  <div>{msg.message}</div>
                  <small
  style={{
    fontSize: "0.7em",
    color: theme === "dark" ? "#bbb" : "#666", // تعديل اللون حسب الثيم
  }}
>
  {new Date(msg.created_at).toLocaleString()}
</small>


                  <div style={{ marginTop: "0.3rem" }}>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setReplyTo(msg)}
                    >
                      رد
                    </button>
                    {(msg.sender_id === user.id || msg.receiver_id === user.id) && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteMessageMutation.mutate(msg.id)}
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedUser && (
          <div>
  {replyTo && (
    <div
      className="alert alert-info"
      style={{
        backgroundColor: theme === "dark" ? "#555" : "#d1ecf1", // تغيير خلفية التنبيه
        color: theme === "dark" ? "#fff" : "#0c5460", // تعديل لون النص في الوضع الليلي
        borderColor: theme === "dark" ? "#444" : "#bee5eb", // تغيير حدود التنبيه
      }}
    >
      رد على: <em>{replyTo.message}</em>{" "}
      <button
        className="btn btn-sm btn-link"
        onClick={() => setReplyTo(null)}
        style={{
          color: theme === "dark" ? "#fff" : "#0c5460", // تعديل لون الزر
        }}
      >
        إلغاء الرد
      </button>
    </div>
  )}

  <textarea
    className="form-control mb-2"
    rows={3}
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="اكتب رسالتك هنا..."
    style={{
      backgroundColor: theme === "dark" ? "#444" : "#fff", // خلفية النص
      color: theme === "dark" ? "#fff" : "#000", // لون النص
      borderColor: theme === "dark" ? "#666" : "#ccc", // حدود الحقل
    }}
  />

  <button
    className="btn btn-primary"
    onClick={() => sendMessageMutation.mutate()}
    style={{
      backgroundColor: theme === "dark" ? "#0062cc" : "#007bff", // تغيير خلفية الزر
      borderColor: theme === "dark" ? "#0056b3" : "#007bff", // حدود الزر
    }}
  >
    {sendMessageMutation.isPending ? "جاري الإرسال..." : "إرسال"}
  </button>
</div>

        )}
      </div>
    </div>
  );
}

export default Messages;
