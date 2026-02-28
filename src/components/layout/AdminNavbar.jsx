import { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService";

const AdminNavbar = () => {
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" sticky="top" className="bg-primary-light py-3">
      <Container>
        <Navbar.Brand as={Link} to="/admin">
          <h1 className="m-0 fs-5 fs-lg-4">Les Minots de Bonniot</h1>
          <p className="m-0">Admin</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-lg-auto me-lg-4 mb-4 mb-lg-0 d-flex align-items-center">
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin">Dashboard</Nav.Link>
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin/manage-home">HomePage</Nav.Link>
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin/manage-banners">Bannières</Nav.Link>
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin/manage-events">Événements</Nav.Link>
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin/manage-team">Équipe</Nav.Link>
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin/manage-docs">Docs légaux</Nav.Link>
            <Nav.Link as={Link} className="mb-2 mb-lg-0 nav-link mx-1" to="/admin/messaging">Messagerie</Nav.Link>
          </Nav>

          <div className="text-center align-items-center">
            <p className="mb-2">
                {profile?.first_name} ({profile?.role})
            </p>
            <Button onClick={handleLogout} variant="danger" className="text-customLight border border-customDark">Déconnexion</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
