import { useEffect, useState } from "react";
import { Container, ListGroup, Spinner } from "react-bootstrap";
import { getCalendarEvents } from "../../services/eventsService";

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await getCalendarEvents();
      setEvents(data);
    } catch (err) {
      console.error("Erreur chargement calendrier :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <section className="pt-4 pb-6 px-3  bg-customLight">
      <Container>
        <h2 className="text-center mb-4 fs-4 fs-lg-3">Calendrier des événements</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-center">Aucun événement programmé.</p>
        ) : (
          <ListGroup className="bs-secondaryDark border border-2 border-secondary">
            {events.map((event) => (
              <ListGroup.Item
                key={event.id}
                className="d-flex justify-content-between align-items-center flex-wrap"
              >
                <div>
                  <strong>{new Date(event.date).toLocaleDateString()}</strong> – {event.title}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
    </section>
  );
};

export default EventsCalendar;
