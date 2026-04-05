import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import emailjs from "@emailjs/browser"
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

    if (formData.get("honeypot")) return;

    const message = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      content: formData.get("content"),
    };

    try {
      // send message to supabase
      await sendContactMessage(message);

      // send message to emailjs
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          full_name: message.full_name,
          email: message.email,
          subject: message.subject,
          content: message.content,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      ).catch(err => console.log("Error: ", err));

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
        <Form.Control className="border border-primary" name="full_name" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control className="border border-primary" type="email" name="email" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Objet</Form.Label>
        <Form.Control className="border border-primary" name="subject" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control className="border border-primary" as="textarea" name="content" rows={10} required />
      </Form.Group>

      <Form.Control type="text" name="honeypot" className="d-none"/>

      <Button
        variant="primary"
        className="w-10 mx-auto border border-primaryDark text-customLight bs-darkShadow"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Envoyer"}
      </Button>
    </Form>
  );
};

export default ContactForm;