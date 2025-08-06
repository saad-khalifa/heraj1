import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Spinner,
  Row,
  Col,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"; // إضافة CSS الخاص بـ react-image-gallery

const BASE_URL = "http://localhost:8000";

function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const { favoriteAds } = useFavorites();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messageText, setMessageText] = useState("");
  const [messageStatus, setMessageStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/ads/${id}`)
      .then((response) => {
        setAd(response.data);
      })
      .catch((error) => {
        console.error("فشل تحميل تفاصيل الإعلان", error);
        alert("حدث خطأ أثناء تحميل تفاصيل الإعلان");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendMessage = () => {
    if (!token) {
      setMessageStatus({
        type: "error",
        text: (
          <>
            الرجاء{" "}
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              style={{ padding: 0 }}
            >
              تسجيل الدخول
            </Button>{" "}
            أولاً لإرسال رسالة.
          </>
        ),
      });
      return;
    }

    if (messageText.trim() === "") {
      setMessageStatus({ type: "error", text: "الرجاء كتابة رسالة قبل الإرسال." });
      return;
    }

    setSending(true);
    axios
      .post(
        `${BASE_URL}/api/messages`,
        {
          ad_id: id,
          message: messageText,
          receiver_id: ad.user ? ad.user.id : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setMessageStatus({ type: "success", text: "تم إرسال الرسالة بنجاح." });
        setMessageText("");
      })
      .catch(() => {
        setMessageStatus({ type: "error", text: "حدث خطأ أثناء إرسال الرسالة." });
      })
      .finally(() => {
        setSending(false);
      });
  };

  const renderImages = (images) => {
    if (!images || images.length === 0) return <p>لا توجد صور</p>;

    const galleryImages = images.map((img) => ({
      original: `${BASE_URL}${img.path}`,
      thumbnail: `${BASE_URL}${img.path}`,
      description: img.title || "صورة الإعلان",
    }));

    return <Gallery items={galleryImages} />;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!ad) {
    return (
      <Container className="mt-4">
        <p>الإعلان غير موجود</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          الرجوع
        </Button>
      </Container>
    );
  }

  const isOwner = user && ad.user && user.id === ad.user.id;
  const isFavorite = favoriteAds.includes(ad.id);

  return (
    <Container className="mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        الرجوع
      </Button>

      <Card>
        {/* عرض الصور باستخدام react-image-gallery */}
        <div style={{ height: "400px", overflow: "hidden" }}>
          {ad.images && ad.images.length > 0 ? renderImages(ad.images) : (
            <Card.Img
              variant="top"
              src="https://via.placeholder.com/800x400?text=لا+يوجد+صور"
              alt="لا توجد صور"
              style={{ height: "400px", objectFit: "cover" }}
            />
          )}
        </div>

        <Card.Body>
          <Card.Title className="mb-3">
            {ad.title}{" "}
            {isFavorite && (
              <span style={{ color: "red", fontSize: "24px" }} title="مفضلة">
                ♥
              </span>
            )}
          </Card.Title>

          <Row className="mb-3">
            <Col md={6}>
              <h5>الوصف:</h5>
              <p>{ad.description || "لا يوجد وصف"}</p>
            </Col>
            <Col md={6}>
              <h5>التفاصيل:</h5>
              <ul className="list-unstyled">
                <li><strong>السعر:</strong> {ad.price} ل.س</li>
                <li><strong>الفئة:</strong> {ad.category ? ad.category.name : "غير محددة"}</li>
                <li><strong>المدينة:</strong> {ad.city ? ad.city.name : "غير محددة"}</li>
                <li><strong>تاريخ النشر:</strong> {new Date(ad.created_at).toLocaleDateString("ar-EG")}</li>
              </ul>
            </Col>
          </Row>

          {!isOwner && (
            <>
              <hr />
              <h5>مراسلة صاحب الإعلان</h5>
              {messageStatus && (
                <Alert variant={messageStatus.type === "success" ? "success" : "danger"}>
                  {messageStatus.text}
                </Alert>
              )}
              <Form.Group controlId="messageText" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  disabled={sending}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSendMessage} disabled={sending}>
                {sending ? "جاري الإرسال..." : "إرسال"}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdDetails;
