import { useContext, useEffect, useState } from "react";
import { Navbar, Container, Nav, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Header = () => {
  const { logout, token } = useContext(AuthContext);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  const checkPremium = async () => {
    try {
      const { data } = await API.get("/premium/user/premiumStatus");
      setIsPremium(data.isPremium);
    } catch {
      setIsPremium(false);
    }
  };

  useEffect(() => {
    if (token) checkPremium();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDownload = async () => {
    try {
      const res = await API.get("/expenses/download");
      window.open(res.data.fileUrl, "_blank");
    } catch {
      alert("Download failed");
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md" sticky="top">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            ExpenseTracker
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </Button>
            {isPremium ? (
              <Button
                variant="success"
                className="me-2"
                onClick={handleDownload}
              >
                Download Report
              </Button>
            ) : (
              <Button
                variant="warning"
                className="me-2"
                onClick={() => navigate("/payment")}
              >
                Buy Premium
              </Button>
            )}
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {!isPremium && (
        <Alert variant="info" className="text-center mb-0">
          🚀 Upgrade to Premium to unlock report downloads!
        </Alert>
      )}
    </>
  );
};

export default Header;
