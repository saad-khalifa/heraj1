import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // عدل المسار حسب مشروعك
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

const Conversations = () => {
  const { token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConversations(res.data);
      } catch (error) {
        console.error("فشل تحميل المحادثات", error);
      }
    };

    fetchConversations();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>المحادثات</h2>
      {conversations.length === 0 && <p>لا توجد محادثات حالياً</p>}
      <ul className="list-group">
        {conversations.map((msg) => {
          // تحديد اسم المستخدم المتحدث معه
          const otherUser =
            msg.sender.id === msg.user_id ? msg.receiver : msg.sender;

          return (
            <li
              key={msg.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/messages/${otherUser.id}`)}
            >
              <div>
                <strong>{otherUser.name}</strong>
                <p className="mb-0 text-truncate" style={{ maxWidth: "300px" }}>
                  {msg.content}
                </p>
              </div>
              <small>{new Date(msg.created_at).toLocaleString()}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Conversations;
