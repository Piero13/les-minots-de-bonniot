import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert, Image } from "react-bootstrap";
import imageCompression from "browser-image-compression";
import ImageCropModal from "./ImageCropModal";
import { v4 as uuidv4 } from "uuid";
import { getEvents, addEvent, updateEvent, deleteEvent } from "../../services/eventsService";
import { supabase } from "../../services/supabaseClient";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [showCrop, setShowCrop] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  // =============================
  // PREVIEW IMAGE
  // =============================
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await getEvents(false);
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des événements.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    setError(null);

    const form = e.target;

    try {
      const eventId = currentEvent ? currentEvent.id : uuidv4();
      let imagePath = currentEvent?.image_path || null;

      // 🔥 IMAGE VERSIONNÉE + SUPPRESSION ANCIENNE
      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });

        const fileName = `events/${eventId}-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("events-bucket")
          .upload(fileName, compressedFile, {
            upsert: false,
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        // 🧹 supprimer ancienne image
        if (currentEvent?.image_path) {
          await supabase.storage
            .from("events-bucket")
            .remove([currentEvent.image_path]);
        }

        imagePath = fileName;
      }

      const eventData = {
        id: eventId,
        title: form.title.value,
        description: form.description.value,
        date: form.date.value,
        link: form.link.value,
        archived: false,
        image_path: imagePath,
      };

      if (currentEvent) {
        await updateEvent(eventId, eventData);
      } else {
        await addEvent(eventData);
      }

      setShowModal(false);
      setCurrentEvent(null);
      setImageFile(null);
      setPreviewUrl(null);
      await loadEvents();

    } catch (err) {
      console.error(err);
      setError("Impossible de sauvegarder l'événement.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;

    try {
      const eventToDelete = events.find(e => e.id === id);

      if (eventToDelete?.image_path) {
        await supabase.storage
          .from("events-bucket")
          .remove([eventToDelete.image_path]);
      }

      await deleteEvent(id);
      await loadEvents();

    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'événement.");
    }
  };

  const getCurrentImageUrl = () => {
    if (previewUrl) return previewUrl;

    if (currentEvent?.image_path) {
      return supabase.storage
        .from("events-bucket")
        .getPublicUrl(currentEvent.image_path).data.publicUrl;
    }

    return null;
  };

  return (
    <div className="pb-5 px-4">
      <h2 className="fs-4 fs-md-3 mb-3 text-center text-lg-start">
        Gérer les événements
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-center justify-content-lg-start">
        <Button
          variant="primary"
          className="mb-5 border border-customDark bs-darkShadow"
          onClick={() => {
            setCurrentEvent(null);
            setImageFile(null);
            setPreviewUrl(null);
            setShowModal(true);
          }}
        >
          Ajouter un évènement
        </Button>
      </div>

      {loadingEvents ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover className="w-100 w-lg-75 mx-auto border-secondary bs-secondaryDark">
          <thead>
            <tr>
              <th className="w-10">Image</th>
              <th>Titre</th>
              <th className="d-none d-md-table-cell">Description</th>
              <th className="d-none d-md-table-cell">Inscription</th>
              <th className="w-10">Date</th>
              <th className="w-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  Aucun évènement
                </td>
              </tr>
            )}

            {events.map((evt) => (
              <tr key={evt.id}>
                <td>
                  {evt.image_path && (
                    <Image
                      src={
                        supabase.storage
                          .from("events-bucket")
                          .getPublicUrl(evt.image_path).data.publicUrl
                      }
                      rounded
                      className="w-11 w-lg-14 h-9 h-lg-11"
                    />
                  )}
                </td>
                <td>{evt.title}</td>
                <td className="d-none d-md-table-cell">{evt.description}</td>
                <td className="d-none d-md-table-cell">{evt.link}</td>
                <td>{new Date(evt.date).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="tertiary"
                    className="w-9 w-md-10 fs-7 fs-md-6 mb-2 text-customDark border border-customDark"
                    onClick={() => {
                      setCurrentEvent(evt);
                      setImageFile(null);
                      setPreviewUrl(null);
                      setShowModal(true);
                    }}
                  >
                    Modifier
                  </Button>{" "}
                  <Button
                    variant="danger"
                    className="w-9 w-md-10 fs-7 fs-md-6 text-customLight border border-customDark"
                    onClick={() => handleDelete(evt.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ================= MODAL ================= */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleAddOrEdit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentEvent ? "Modifier" : "Ajouter"} évènement
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Titre</Form.Label>
              <Form.Control
                name="title"
                defaultValue={currentEvent?.title || ""}
                placeholder="Titre"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Description</Form.Label>
              <Form.Control
                name="description"
                as="textarea"
                defaultValue={currentEvent?.description || ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                defaultValue={currentEvent?.date?.split("T")[0] || ""}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Lien</Form.Label>
              <Form.Control
                name="link"
                defaultValue={currentEvent?.link || ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setTempImage(e.target.files[0]);
                  setShowCrop(true);
                }}
              />

              {getCurrentImageUrl() && (
                <div className="mt-3 text-center">
                  <small className="d-block mb-2">Prévisualisation :</small>
                  <Image
                    src={getCurrentImageUrl()}
                    rounded
                    className="w-100"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="text-customLight border border-customDark"
              variant="danger"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </Button>
            <Button className="border border-customDark" type="submit">
              {currentEvent ? "Modifier" : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ImageCropModal
        show={showCrop}
        imageFile={tempImage}
        onClose={() => setShowCrop(false)}
        onValidate={(file) => {
          setImageFile(file);
          setShowCrop(false);
        }}
        aspect={16 / 9}
      />
    </div>
  );
};

export default ManageEvents;