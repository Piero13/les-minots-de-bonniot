import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-primary-light py-4 m-0">
      <Container>
        <Row>
          <Col md={4}>
            <p className="mb-2 text-center text-md-start">&copy; {new Date().getFullYear()} Les Minots de Bonniot</p>
            <p className="mb-4 mb-md-0 text-center text-md-start">Tous droits réservés</p>
          </Col>
          <Col md={4}>
            <p className="text-center">Site créé par Pierre Fasce</p>
          </Col>
          <Col md={4} className="d-flex flex-column align-items-center align-items-md-end">
            <a href="/legal-notices" className="mb-2 nav-link">Mentions légales</a>
            <a href="/policy" className="mb-2 nav-link">Politique de confidentialité</a>
            <a href="/documents" className="nav-link">Documents légaux</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
