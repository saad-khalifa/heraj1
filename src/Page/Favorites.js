import React, { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8000";

function Favorites() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // التأكد من أن البيانات هي مصفوفة
      if (!Array.isArray(res.data)) {
        console.error("البيانات غير صحيحة: يجب أن تكون المفضلة مصفوفة");
        return [];
      }

      return res.data;
    },
    enabled: !!token,
  });

  const removeMutation = useMutation({
    mutationFn: async (adId) => {
      await axios.delete(`${BASE_URL}/api/favorites/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (_, adId) => {
      queryClient.invalidateQueries(["favorites"]); // تحديث البيانات بعد الحذف
    },
    onError: (error) => {
      console.error("فشل في حذف الإعلان من المفضلة", error);
    },
  });

  if (isLoading) return <p className="text-center mt-4">جاري التحميل...</p>;
  if (isError || !Array.isArray(favorites)) return <p className="text-center mt-4 text-danger">حدث خطأ في تحميل المفضلة أو البيانات غير صحيحة.</p>;

  return (
    <Container className="mt-4">
      <h2>المفضلة</h2>
      <Row>
        {favorites.length === 0 && <p>لا توجد إعلانات في المفضلة.</p>}
        {favorites.map((ad) => (
          <Col key={ad.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              {ad.images && ad.images.length > 0 ? (
                <Card.Img
                  variant="top"
                  src={`${BASE_URL}${ad.images[0].path}`}
                  style={{ height: "200px", objectFit: "contain" }}
                  alt={ad.title}
                />
              ) : (
                <div
                  style={{
                    height: "200px",
                    backgroundColor: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6c757d",
                  }}
                >
                  لا توجد صورة
                </div>
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{ad.title}</Card.Title>
                <Card.Text className="text-muted" style={{ fontSize: "0.9em" }}>
                  {ad.description ? ad.description.slice(0, 120) + "..." : ""}
                </Card.Text>

                <ul className="list-unstyled mb-2" style={{ fontSize: "0.9em" }}>
                  <li><strong>السعر:</strong> {ad.price} ل.س</li>
                  <li><strong>المدينة:</strong> {ad.city?.name || "-"}</li>
                  <li><strong>القسم:</strong> {ad.category?.name || "-"}</li>
                  <li><strong>الناشر:</strong> {ad.user?.name || "-"}</li>
                  <li><strong>تاريخ النشر:</strong> {new Date(ad.created_at).toLocaleString("ar-EG")}</li>
                </ul>

                <div className="mt-auto d-flex justify-content-between">
                  <Button
                    variant="info"
                    onClick={() => navigate(`/ads/${ad.id}`)}
                  >
                    التفاصيل
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => removeMutation.mutate(ad.id)}
                    disabled={removeMutation.isLoading}
                  >
                    {removeMutation.isLoading ? "جارٍ الإزالة..." : "إزالة"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Favorites;
