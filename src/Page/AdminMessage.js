import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const AdminMessages = () => {
  const { user, token, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.is_admin) {
        navigate("/unauthorized");
      } else {
        fetchTickets();
      }
    }
  }, [user, loading]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/contact-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.data ?? res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/contact-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTicket(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyMessage.trim()) return alert("الرجاء كتابة رد.");
    try {
      setLoadingReply(true);
      await axios.post(
        `http://localhost:8000/api/admin/contact-messages/${selectedTicket.id}/reply`,
        { message: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyMessage("");
      await fetchTicketDetails(selectedTicket.id);
      await fetchTickets();
      alert("✅ تم إرسال الرد للمستخدم مع إشعار تنبيهي");
    } catch (e) {
      console.error(e);
      alert("❌ حدث خطأ أثناء إرسال الرد");
    } finally {
      setLoadingReply(false);
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف التذكرة؟")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/contact-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (selectedTicket && selectedTicket.id === id) setSelectedTicket(null);
      await fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReply = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الرد؟")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/contact-replies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (selectedTicket) await fetchTicketDetails(selectedTicket.id);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className={`container mt-5 text-center ${theme === "dark" ? "text-light" : "text-dark"}`}>
        <div className="spinner-border" role="status" aria-hidden="true"></div>
        <p className="mt-2">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className={`container mt-5 ${theme === "dark" ? "text-light" : "text-dark"}`}>
      <h2 className="mb-4">إدارة رسائل التواصل</h2>
      <div className="row gap-3">
        {/* قائمة التذاكر */}
        <div
          className={`col-md-5 p-3 rounded shadow-sm ${
            theme === "dark" ? "bg-secondary bg-opacity-25" : "bg-light"
          }`}
          style={{ maxHeight: "75vh", overflowY: "auto" }}
        >
          <h4 className="mb-3">التذاكر</h4>
          <ul className="list-group">
            {tickets.length === 0 && (
              <li className={`list-group-item text-center ${theme === "dark" ? "bg-dark text-light" : ""}`}>
                لا توجد تذاكر
              </li>
            )}
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className={`list-group-item d-flex justify-content-between align-items-center rounded ${
                  selectedTicket?.id === ticket.id
                    ? theme === "dark"
                      ? "bg-primary bg-opacity-75 text-white"
                      : "active"
                    : theme === "dark"
                    ? "bg-dark text-light"
                    : ""
                }`}
                style={{ cursor: "pointer", fontSize: "0.95rem", padding: "0.6rem 1rem", marginBottom: "0.25rem" }}
                onClick={() => fetchTicketDetails(ticket.id)}
              >
                <span className="text-truncate" style={{ maxWidth: "80%" }}>
                  {ticket.subject}
                </span>
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTicket(ticket.id);
                  }}
                  title="حذف التذكرة"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* تفاصيل التذكرة */}
        <div
          className={`col-md-6 p-4 rounded shadow-sm ${
            theme === "dark" ? "bg-secondary bg-opacity-25" : "bg-white"
          }`}
          style={{ maxHeight: "75vh", overflowY: "auto" }}
        >
          {selectedTicket ? (
            <>
              <h4 className="mb-3" style={{ fontWeight: "600" }}>
                تفاصيل التذكرة
              </h4>
              <div className="mb-3" style={{ fontSize: "0.9rem" }}>
                <p>
                  <strong>الاسم:</strong> {selectedTicket.name}
                </p>
                <p>
                  <strong>البريد:</strong> {selectedTicket.email}
                </p>
                <p>
                  <strong>الموضوع:</strong> {selectedTicket.subject}
                </p>
                <p style={{ whiteSpace: "pre-wrap" }}>
                  <strong>الرسالة:</strong> {selectedTicket.message}
                </p>
              </div>
              <hr />
              <h5 className="mb-3" style={{ fontWeight: "600" }}>
                الردود
              </h5>
              <ul
                className={`list-group rounded shadow-sm ${
                  theme === "dark" ? "bg-dark" : "bg-light"
                }`}
                style={{ maxHeight: "250px", overflowY: "auto", fontSize: "0.9rem" }}
              >
                {selectedTicket.replies.length === 0 && (
                  <li className={`list-group-item text-center ${theme === "dark" ? "bg-dark text-light" : ""}`}>
                    لا توجد ردود
                  </li>
                )}
                {selectedTicket.replies.map((reply) => (
                  <li
                    key={reply.id}
                    className={`list-group-item d-flex justify-content-between align-items-center rounded ${
                      theme === "dark" ? "bg-primary bg-opacity-75 text-white" : ""
                    }`}
                    style={{ padding: "0.5rem 1rem", marginBottom: "0.25rem" }}
                  >
                    <div>
                      <b>{reply.user ? reply.user.name : "الإدارة"}</b>: {reply.message}
                      <br />
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {new Date(reply.created_at).toLocaleString()}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      onClick={() => deleteReply(reply.id)}
                      title="حذف الرد"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <textarea
                  rows={3}
                  className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
                  placeholder="اكتب ردك هنا..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={{ fontSize: "0.9rem", resize: "vertical" }}
                />
                <button
                  className="btn btn-primary mt-3 px-4"
                  onClick={handleReplySubmit}
                  disabled={loadingReply}
                  style={{ fontSize: "0.9rem", minWidth: "120px" }}
                >
                  {loadingReply ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال الرد"
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center mt-5 fs-6 fst-italic">
              اختر تذكرة لعرض التفاصيل
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
