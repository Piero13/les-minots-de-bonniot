import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary-light py-4 m-0">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
            <p className="mb-2 text-center text-md-start">&copy; {new Date().getFullYear()} Les Minots de Bonniot</p>
            <p className="mb-2 text-center text-md-start">Tous droits réservés</p>
            <a href="https://www.facebook.com/ApeSaintJulienMixte1" target="_blank" title="Lien vers la page Facebook de l'association des parents d'élèves de l'école Saint Julien 1, Marseille 12"><FaFacebook className="fs-1 fs-md-2 social-link"/></a>
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
