import { useEffect, useState } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUnreadMessagesCount } from "../../services/messagingService";
import {
  BsCalendarEvent,
  BsPeople,
  BsHouse,
  BsFileEarmarkText,
  BsEnvelope,
  BsCardImage 
} from "react-icons/bs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadMessagesCount();
        setUnreadCount(count || 0);
      } catch (err) {
        console.error("Erreur compteur messages :", err);
      }
    };

    loadUnreadCount();
  }, []);

  const cards = [
    {
      title: "Home",
      text: "Modifier la page d'accueil",
      path: "/admin/manage-home",
      icon: <BsHouse size={32}  fill="#F2B705" />,
    },
    {
      title: "Bannières",
      text: "Modifier la bannière d'en-tête",
      path: "/admin/manage-banners",
      icon: <BsCardImage  size={32}  fill="#F2B705" />,
    },
    {
      title: "Événements",
      text: "Gérer les événements",
      path: "/admin/manage-events",
      icon: <BsCalendarEvent size={32}  fill="#F2B705" />,
    },
    {
      title: "Équipe",
      text: "Gérer les membres du bureau",
      path: "/admin/manage-team",
      icon: <BsPeople size={32}  fill="#F2B705" />,
    },
    {
      title: "Docs légaux",
      text: "Ajouter / supprimer des documents",
      path: "/admin/manage-docs",
      icon: <BsFileEarmarkText size={32}  fill="#F2B705" />,
    },
    {
      title: "Messagerie",
      text: "Consulter les messages reçus",
      path: "/admin/messaging",
      icon: <BsEnvelope size={32}  fill="#F2B705"/>,
      badge: unreadCount,
    },
  ];

  return (
    <>
      <h2 className="fs-4 fs-md-3 text-center text-lg-start">Tableau de bord</h2>

      <Row className="mt-4 g-4">
        {cards.map((card, index) => (
          <Col md={4} key={index}>
            <Card
              className="h-100 bs-primaryDark border-1 border-primary"
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="text-primary">{card.icon}</div>
                  {card.badge > 0 && (
                    <Badge bg="danger" className="rounded-3 text-center p-2 fs-7">{card.badge}</Badge>
                  )}
                </div>

                <Card.Title>{card.title}</Card.Title>
                <Card.Text className="text-muted">{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Dashboard;
