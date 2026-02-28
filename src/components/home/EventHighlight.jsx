import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import { getNextEvents } from "../../services/eventsService";
import { supabase } from "../../services/supabaseClient";

const EventHighlight = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleShow = (event) => {
    setSelectedEvent(event);
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
    setSelectedEvent(null);
  }

  const loadEvents = async () => {
    try {
      const data = await getNextEvents(3);
      setEvents(data);
    } catch (err) {
      console.error("Erreur chargement prochains événements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <section className="pt-4 pb-6 px-3 bg-light bg-primary-light">
      <Container>
        <h2 className="text-center mb-4 fs-4 fs-lg-3">Prochains événements</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-center">Aucun événement à venir.</p>
        ) : (
          <Row className="g-4">
            {events.map((event) => (
              <Col key={event.id} xs={12} md={4}>
                <Card className="h-100 border-primaryDark border-2 bs-primaryDark" onClick={() => handleShow(event)}>
                  {event.image_path && (
                    <Card.Img
                      variant="top"
                      src={
                        supabase.storage
                          .from("events-bucket")
                          .getPublicUrl(event.image_path).data.publicUrl
                      }
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{event.title}</Card.Title>

                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(event.date).toLocaleDateString()}
                    </Card.Subtitle>

                    <Card.Text className="flex-grow-1">
                      {event.description.length > 120
                        ? event.description.substring(0, 120) + "..."
                        : event.description}
                    </Card.Text>

                    {event.link && (
                      <Button
                        variant="tertiary"
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-primaryDark bs-darkShadow"
                      >
                        S'inscrire
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        size="lg"
      >
        {selectedEvent && (
          <>
            <Modal.Header closeButton className="border border-secondary bg-secondary-light">
              <Modal.Title>{selectedEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border border-secondary d-flex flex-column py-4">
              {selectedEvent.image_path && (
                <img
                  src={
                    supabase.storage
                      .from("events-bucket")
                      .getPublicUrl(selectedEvent.image_path).data.publicUrl
                  }
                  alt={selectedEvent.title}
                  className="img-fluid mb-3 rounded"
                />
              )}

              <p className="text-muted text-center fw-bold">
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>

              <p className="mb-3">{selectedEvent.description}</p>

              {selectedEvent.link && (
                <Button
                  variant="tertiary"
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-customDark bs-darkShadow w-auto mx-auto px-4"
                >
                  S'inscrire
                </Button>
              )}
            </Modal.Body>
          </>
        )}
      </Modal>
    </section>
  );
};

export default EventHighlight;
