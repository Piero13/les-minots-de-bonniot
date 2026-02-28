import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="pt-8 mw-16 mw-md-18">
      <div className="border border-2 border-primary rounded-3 p-4">
        <h2 className="fs-4 fs-md-3 text-center mb-4">Connexion Admin</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="mb-8 d-flex flex-column">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="mx-auto bs-darkShadow">Se connecter</Button>
        </Form>

        <Button className="w-100 border border-primaryDark bs-darkShadow" variant="tertiary" href="/">Retour au site</Button>
      </div>

    </Container>
  );
};

export default Login;
