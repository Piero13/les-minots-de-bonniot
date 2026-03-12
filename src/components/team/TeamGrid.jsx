import { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { getTeamMembers } from "../../services/teamService";
import { supabase } from "../../services/supabaseClient";

const TeamGrid = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeam = async () => {
    try {
      const data = await getTeamMembers();
      setTeam(data);
    } catch (err) {
      console.error("Erreur chargement équipe :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <section className="pb-7">
      <div className="container">
        <h2 className="text-center mb-4 fs-4 fs-lg-3">Notre équipe APE</h2>
        <Row className="g-4">
          {team.map((member) => (
            <Col xs={6} md={4} lg={3} key={member.id}>
              <Card className="min-vh-11 text-center border border-2 border-secondary bs-darkShadow">
                {member.photo_path && (
                  <Card.Img
                    variant="top"
                    src={supabase.storage.from("team-bucket").getPublicUrl(member.photo_path).data.publicUrl}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{member.first_name} {member.last_name}</Card.Title>
                  <Card.Text>{member.role}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TeamGrid;
