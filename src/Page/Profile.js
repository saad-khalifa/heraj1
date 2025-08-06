import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const profileImageUrl = user?.profile_image
    ? `http://localhost:8000/storage/${user.profile_image}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // أيقونة افتراضية

  const handleEdit = () => {
    navigate("/account-settings");
  };

  // أنماط تعتمد على الوضع الحالي (dark / light)
  const cardClass = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card className={`text-center shadow p-3 ${cardClass}`}>
            <Card.Img
              variant="top"
              src={profileImageUrl}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                margin: "0 auto",
                objectFit: "cover",
                border: theme === "dark" ? "2px solid #fff" : "2px solid #000",
              }}
            />
            <Card.Body>
              <Card.Title>{user?.name}</Card.Title>
              <Card.Text>{user?.email}</Card.Text>
              <Button variant={theme === "dark" ? "outline-light" : "primary"} onClick={handleEdit}>
                تعديل الحساب
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
