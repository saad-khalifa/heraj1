import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MyContactMessage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTicket = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/admin/contact-messages/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTicket(res.data);
    } catch (error) {
      console.error("فشل جلب التذكرة:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) {
      alert("يرجى كتابة الرد");
      return;
    }
    try {
      setSending(true);
      await axios.post(
        `http://localhost:8000/api/admin/contact-messages/${id}/reply`,
        { message: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply("");
      await fetchTicket();
    } catch (error) {
      console.error("فشل في إرسال الرد:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
  if (!window.confirm("هل تريد حذف هذا الرد؟")) return;
  try {
    await axios.delete(`http://localhost:8000/api/contact-replies/${replyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    await fetchTicket();
  } catch (error) {
    console.error("فشل حذف الرد:", error);
  }
};



  return (
    <div className="container mt-5">
      <h3>تفاصيل الرسالة</h3>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : ticket ? (
        <>
          <p>
            <strong>الموضوع:</strong> {ticket.subject}
          </p>
          <p>
            <strong>الرسالة:</strong> {ticket.message}
          </p>
          <p>
            <strong>تاريخ الإرسال:</strong>{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </p>

          <hr />
          <h5>الردود</h5>
          <ul className="list-group">
            {ticket.replies.length === 0 && (
              <li className="list-group-item">لا توجد ردود</li>
            )}
            {ticket.replies.map((r) => (
              <li
                key={r.id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <strong>
                    {r.user_id === null
                      ? "الإدارة"
                      : r.user?.name
                      ? r.user.name
                      : "مستخدم"}
                    :
                  </strong>{" "}
                  {r.message}
                  <br />
                  <small>{new Date(r.created_at).toLocaleString()}</small>
                </div>
                {/* زر الحذف يظهر فقط لو الرد من نفس المستخدم صاحب التذكرة */}
                {r.user_id !== null &&
                  r.user?.id === ticket.user?.id && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteReply(r.id)}
                    >
                      حذف
                    </button>
                  )}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <textarea
              className="form-control"
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="اكتب ردك هنا..."
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleReply}
              disabled={sending}
            >
              {sending ? "جاري الإرسال..." : "إرسال الرد"}
            </button>
          </div>
        </>
      ) : (
        <p>لا يمكن عرض الرسالة.</p>
      )}
    </div>
  );
};

export default MyContactMessage;
