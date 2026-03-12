import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => setExpanded(false);

  return (
    <Navbar
      bg="primary-light"
      expand="lg"
      sticky="top"
      className="m-0"
      expanded={expanded}
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand onClick={handleClose}>
            <h1 className="fs-4 fs-lg-3 m-0">Les Minots de Bonniot</h1>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle
          aria-controls="main-navbar"
          onClick={() => setExpanded(expanded ? false : true)}
        />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto mt-3 mt-md-0">
            <LinkContainer to="/" onClick={handleClose}>
              <Nav.Link className="mb-3 mb-lg-0 mx-auto mx-lg-2">
                Accueil
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/team" onClick={handleClose}>
              <Nav.Link className="mb-3 mb-lg-0 mx-auto mx-lg-2">
                L'équipe
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/gallery" onClick={handleClose}>
              <Nav.Link className="mb-3 mb-lg-0 mx-auto mx-lg-2">
                Photos
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/contact" onClick={handleClose}>
              <Nav.Link className="mb-3 mb-lg-0 mx-auto mx-lg-2">
                Contact
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/login" onClick={handleClose}>
              <Nav.Link className="mb-3 mb-lg-0 mx-auto mx-lg-2">
                Admin
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;