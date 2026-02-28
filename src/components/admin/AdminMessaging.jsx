import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { getMessages, markAsRead, deleteMessage } from "../../services/messagingService";

const AdminMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  // Charger les messages
  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Marquer lu/non-lu
  const handleToggleRead = async (msg) => {
    try {
      await markAsRead(msg.id, !msg.is_read);
      await loadMessages();
    } catch (err) {
      console.error(err);
      setError("Impossible de mettre à jour le message.");
    }
  };

  // Supprimer
  const handleDelete = async (msg) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await deleteMessage(msg.id);
      await loadMessages();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le message.");
    }
  };

  // Ouvrir modal
  const handleShowModal = (msg) => {
    setCurrentMessage(msg);
    setShowModal(true);
  };

  // Fermer modal
  const handleCloseModal = async () => {
    // Si le message était non-lu, le marquer lu
    if (currentMessage && !currentMessage.is_read) {
      try {
        await markAsRead(currentMessage.id, true);
        await loadMessages();
      } catch (err) {
        console.error(err);
        setError("Impossible de mettre à jour le message.");
      }
    }
    setShowModal(false);
    setCurrentMessage(null);
  };

  return (
    <div className="pb-5 px-2">
      <h2 className="fs-4 fs-md-3 mb-3 text-center text-md-start">Messagerie</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover className="w-auto w-lg-100 mx-auto">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell">Nom</th>
              <th className="fs-7 fs-md-6">Email</th>
              <th className="fs-7 fs-md-6">Objet</th>
              <th className="fs-7 fs-md-6">Date</th>
              <th className="fs-7 fs-md-6">Lu</th>
              <th className="fs-7 fs-md-6 w-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  Aucun message
                </td>
              </tr>
            )}
            {messages.map((msg) => (
              <tr
                key={msg.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleShowModal(msg)}
              >
                <td className="d-none d-md-table-cell">{msg.full_name}</td>
                <td className="fs-7 fs-md-6 text-truncate">{msg.email}</td>
                <td className="fs-7 fs-md-6">{msg.subject || "—"}</td>
                <td className="fs-7 fs-md-6">{new Date(msg.created_at).toLocaleString()}</td>
                <td className="fs-7 fs-md-6 text-center">{msg.is_read ? "✅" : "❌"}</td>
                <td className="d-flex flex-column flex-md-row align-items-center">
                  <Button
                    variant="tertiary"
                    onClick={(e) => {
                      e.stopPropagation(); // éviter d’ouvrir le modal
                      handleToggleRead(msg);
                    }}
                    className="w-9 w-md-10 fs-7 fs-md-6 mb-2 mb-md-0 me-0 me-md-2 border border-customDark"
                  >
                    {msg.is_read ? "Marquer non-lu" : "Marquer lu"}
                  </Button>
                  <Button
                    className="w-9 w-md-10 fs-7 fs-md-6 text-customLight border border-customDark"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg);
                    }}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal message complet */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Détails du message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentMessage && (
            <>
              <p>
                <strong>Nom :</strong> {currentMessage.full_name}
              </p>
              <p>
                <strong>Email :</strong> {currentMessage.email}
              </p>
              <p>
                <strong>Objet :</strong> {currentMessage.subject || "—"}
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {new Date(currentMessage.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Message :</strong>
                <br />
                {currentMessage.content}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMessaging;
