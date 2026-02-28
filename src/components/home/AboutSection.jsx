import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Spinner, Button } from "react-bootstrap";
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
    <section className="py-4 px-3 bg-customLight">
      <Container>
        <Row className="align-items-center justify-content-center">
          {content.about_image_url && (
            <Col xs={12} md={6} lg={5} className="mb-4 mb-md-0 w-auto mx-auto mx-md-0 mx-lg-7">
              <Image
                className="w-10 w-md-12 w-lg-15 border border-primaryDark bs-primaryDark"
                src={supabase.storage.from("home-bucket").getPublicUrl(content.about_image_url).data.publicUrl}
                fluid
                rounded
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

      
    </section>
  );
};

export default AboutSection;
