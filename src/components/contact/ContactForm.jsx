import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { sendContactMessage } from "../../services/messagingService";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);

    const message = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      content: formData.get("content"),
    };

    try {
      await sendContactMessage(message);
      setSuccess("Votre message a bien été envoyé.");
      e.target.reset();
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.log("erreur envoi message : ", err );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column w-md-60 w-lg-50 mx-auto">
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Nom complet</Form.Label>
        <Form.Control name="full_name" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Objet</Form.Label>
        <Form.Control name="subject" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" name="content" rows={10} required />
      </Form.Group>

      <Button
        variant="tertiary"
        className="w-auto mx-auto border border-primaryDark text-customDark"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Envoyer"}
      </Button>
    </Form>
  );
};

export default ContactForm;