import React, { useState, useEffect, useRef, useContext } from "react";
import axiosInstance from "../api/axiosConfig"; // ملف axios المُعد مسبقاً
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Chat = () => {
  const { userId } = useParams();
  const { token } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (error) {
      console.error("فشل في جلب الرسائل:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axiosInstance.post("/messages/send", {
        to_user_id: userId,
        message: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("فشل في إرسال الرسالة:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h3>المحادثة مع المستخدم {userId}</h3>
      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.from_user_id === parseInt(userId) ? "left" : "right",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: msg.from_user_id === parseInt(userId) ? "#eee" : "#007bff",
                color: msg.from_user_id === parseInt(userId) ? "#000" : "#fff",
                borderRadius: "10px",
                padding: "8px 12px",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flexGrow: 1, marginRight: "10px" }}
          placeholder="اكتب رسالتك هنا..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button onClick={handleSendMessage} className="btn btn-primary">
          إرسال
        </button>
      </div>
    </div>
  );
};

export default Chat;
