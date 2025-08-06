import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <>
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          color: "white",
          padding: "2rem",
          marginTop: '-15px'
        }}
      >
        <Container className="d-flex align-items-center justify-content-center text-center text-lg-start">
          <div style={{ maxWidth: 600 }}>
            <h1
              className="display-3 fw-bold mb-3 fade-in-up"
              style={{
                textShadow: "2px 2px 8px rgba(0,0,0,0.8)"
              }}
            >
              حراج سوريا
            </h1>
            <p
              className="lead mb-4 fade-in-up"
              style={{
                fontSize: "1.3rem",
                textShadow: "1px 1px 6px rgba(0,0,0,0.7)",
                animationDelay: "0.3s",
                animationFillMode: "forwards"
              }}
            >
              أكبر منصة إعلانات مبوبة في سوريا.<br />
              ابحث، بيع، أو اشترِ بكل سهولة وأمان.
            </p>
            <Button
              variant="light"
              size="lg"
              className="fade-in-up"
              onClick={() => navigate("/browse-ads")}
              style={{
                fontWeight: "bold",
                padding: "0.75rem 2rem",
                animationDelay: "0.6s",
                animationFillMode: "forwards"
              }}
            >
              تصفح الإعلانات
            </Button>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Home;
