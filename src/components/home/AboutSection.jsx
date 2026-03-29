import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Spinner, Button } from "react-bootstrap";
import { FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaRegHeart, FaRegComment } from "react-icons/fa";
import { supabase } from "../../services/supabaseClient";
import { getAboutContent } from "../../services/homeService";

const AboutSection = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      const data = await getAboutContent();
      setContent(data);
    } catch (err) {
      console.error("Erreur chargement section 'Qui sommes-nous' :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const iconType = content?.about_icon;

  const iconMap = {
    information: <FaInfoCircle fill="#2C5AA0" className="fs-4"/>,
    important: <FaExclamationCircle fill="#E04F5F" className="fs-4"/>,
    danger: <FaExclamationTriangle fill="#E04F5F" className="fs-4"/>,
    communication: <FaRegComment fill="#2C5AA0" className="fs-4"/>,
    merci: <FaRegHeart fill="#E04F5F" className="fs-4"/>,
  };

  const icon = iconMap[iconType] || null;

  if (loading) {
    return (
      <section className="py-5 bg-customLight">
        <Container className="text-center">
          <Spinner animation="border" />
        </Container>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className="pt-4 pb-6 px-3 bg-customLight">
      <Container>
        <Row className="align-items-center justify-content-center">
          {content.about_image_url && (
            <Col xs={12} md={6} lg={5} className="mb-4 mb-md-0 w-auto mx-auto mx-lg-7">
              <Image
                className="w-14 w-md-15 w-lg-15 border border-primaryDark bs-primaryDark"
                src={supabase.storage.from("home-bucket").getPublicUrl(content.about_image_url).data.publicUrl}
                fluid
                rounded
                alt="Image d'accueil de la section Qui sommes nous ?"
              />
            </Col>
          )}
          <Col xs={12} md={content.about_image_url ? 6 : 12} lg={content.about_image_url ? 5 : 12} className="mx-lg-7 d-flex flex-column">
            {content.about_title && <h2 className="fs-4 fs-lg-3 text-center text-lg-start mb-4">{content.about_title}</h2>}
            {content.about_text && <p className="m-0">{content.about_text}</p>}
            <Button 
              href="/contact"
              variant="primary"
              className="w-auto mx-auto mt-4 border border-primaryDark bs-darkShadow text-customLight"
            >
              Contactez-nous
            </Button>
          </Col>
        </Row>
      </Container>

      {content.about_message && (
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center align-items-md-start mx-auto mt-6 w-80 w-md-60 border border-primary rounded p-3 bs-primaryDark">
            {icon && <span className="flex-shrink-0 mb-2 mb-md-0 me-0 me-md-2">{icon}</span>}
            <p className="m-0 p-0">{ content.about_message }</p>
          </div>
      )}
    </section>
  );
};

export default AboutSection;
