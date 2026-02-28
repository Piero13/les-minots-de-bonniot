import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert, Image } from "react-bootstrap";
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../services/teamService";
import {
  getTeamPictures,
  addTeamPicture,
  updateTeamPicture,
  deleteTeamPicture,
} from "../../services/teamPicturesService";
import { supabase } from "../../services/supabaseClient";
import imageCompression from "browser-image-compression";
import ImageCropModal from "./ImageCropModal";

const ManageTeam = () => {
  // STATES
  const [team, setTeam] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MEMBER MODAL
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [memberImageFile, setMemberImageFile] = useState(null);
  const [memberTempImage, setMemberTempImage] = useState(null);

  // PICTURE MODAL
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureTempFile, setPictureTempFile] = useState(null);

  // IMAGE CROP
  const [showCrop, setShowCrop] = useState(false);

  // LOAD DATA
  const loadTeam = async () => {
    setLoading(true);
    try {
      const teamData = await getTeamMembers();
      const pictureData = await getTeamPictures();
      setTeam(teamData);
      setPictures(pictureData);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  // HELPER
  const getCurrentImageUrl = (file, currentPath, bucket) => {
    if (file) return URL.createObjectURL(file);
    if (currentPath) {
      return supabase.storage.from(bucket).getPublicUrl(currentPath).data.publicUrl;
    }
    return null;
  };

  // HANDLERS MEMBERS
  const handleAddOrEditMember = async (e) => {
    e.preventDefault();
    setError(null);

    const form = e.target;

    try {
      let member;
      const payload = {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        role: form.role.value,
      };

      if (!currentMember) member = await addTeamMember(payload);
      else member = await updateTeamMember(currentMember.id, payload);

      // IMAGE
      if (memberImageFile && member.id) {
        const compressedFile = await imageCompression(memberImageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
        const fileName = `${member.id}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("team-bucket")
          .upload(fileName, compressedFile, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;

        if (currentMember?.photo_path) {
          await supabase.storage.from("team-bucket").remove([currentMember.photo_path]);
        }

        await updateTeamMember(member.id, { photo_path: fileName });
      }

      setShowMemberModal(false);
      setCurrentMember(null);
      setMemberImageFile(null);
      setMemberTempImage(null);
      await loadTeam();
    } catch (err) {
      console.error(err);
      setError("Erreur sauvegarde membre.");
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      const memberToDelete = team.find((m) => m.id === id);
      if (memberToDelete?.photo_path) {
        await supabase.storage.from("team-bucket").remove([memberToDelete.photo_path]);
      }
      await deleteTeamMember(id);
      await loadTeam();
    } catch (err) {
      console.error(err);
      setError("Erreur suppression membre.");
    }
  };

  // HANDLERS PICTURES
  const handleAddOrEditPicture = async (e) => {
    e.preventDefault();
    setError(null);

    const form = e.target;

    try {
      if (!pictureFile) {
        setError("Veuillez sélectionner une image.");
        return;
      }

      // 🔹 Compression de l'image
      const compressedFile = await imageCompression(pictureFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      // 🔹 Nom du fichier avec timestamp
      const fileName = `${Date.now()}-${compressedFile.name}`;

      // 🔹 Upload dans le bucket
      const { error: uploadError } = await supabase.storage
        .from("team-pictures-bucket")
        .upload(fileName, compressedFile, { contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      // 🔹 Préparer le payload pour Supabase avec title + image_path
      const payload = {
        title: form.title.value,
        image_path: fileName,
      };

      if (!currentPicture) {
        // CREATE
        await addTeamPicture(payload);
      } else {
        // UPDATE
        // Supprimer l'ancienne image si elle existe
        if (currentPicture.image_path) {
          await supabase.storage.from("team-pictures-bucket").remove([currentPicture.image_path]);
        }
        await updateTeamPicture(currentPicture.id, payload);
      }

      // 🔹 Reset state et reload
      setShowPictureModal(false);
      setCurrentPicture(null);
      setPictureFile(null);
      setPictureTempFile(null);
      await loadTeam();

    } catch (err) {
      console.error(err);
      setError("Erreur sauvegarde image.");
    }
  };

  const handleDeletePicture = async (id) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    try {
      const picToDelete = pictures.find((p) => p.id === id);
      if (picToDelete?.image_path) {
        await supabase.storage.from("team-pictures-bucket").remove([picToDelete.image_path]);
      }
      await deleteTeamPicture(id);
      await loadTeam();
    } catch (err) {
      console.error(err);
      setError("Erreur suppression image.");
    }
  };

  return (
    <div className="pb-5 px-4">
      <h2 className="fs-4 fs-md-3 mb-3 text-center text-lg-start">Gérer les membres</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        className="mb-3 border border-customDark bs-darkShadow"
        onClick={() => {
          setCurrentMember(null);
          setMemberImageFile(null);
          setMemberTempImage(null);
          setShowMemberModal(true);
        }}
      >
        Ajouter un membre
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover className="w-100 w-lg-75 mx-auto mb-5 border-secondary bs-secondaryDark">
          <thead>
            <tr>
              <th className="w-8">Photo</th>
              <th className="d-none d-md-table-cell">Nom</th>
              <th>Prénom</th>
              <th>Rôle</th>
              <th className="w-9">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">Aucun membre</td>
              </tr>
            )}
            {team.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.photo_path && (
                    <Image
                      src={supabase.storage.from("team-bucket").getPublicUrl(m.photo_path).data.publicUrl}
                      roundedCircle
                      className="w-8 w-md-10 w-lg-12"
                    />
                  )}
                </td>
                <td className="d-none d-md-table-cell">{m.last_name}</td>
                <td>{m.first_name}</td>
                <td>{m.role}</td>
                <td>
                  <Button
                    variant="tertiary"
                    className="w-9 w-md-10 fs-7 fs-md-6 mb-2 text-customDark border border-customDark"
                    onClick={() => {
                      setCurrentMember(m);
                      setMemberImageFile(null);
                      setMemberTempImage(null);
                      setShowMemberModal(true);
                    }}
                  >
                    Modifier
                  </Button>{" "}
                  <Button
                    variant="danger"
                    className="w-9 w-md-10 fs-7 fs-md-6 text-customLight border border-customDark"
                    onClick={() => handleDeleteMember(m.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ------------------ GALLERY ------------------ */}
      <h2 className="fs-4 fs-md-3 mb-3 text-center text-lg-start">Galerie photo de l'équipe</h2>
      <Button
        variant="primary"
        className="mb-3 border border-customDark bs-darkShadow"
        onClick={() => {
          setCurrentPicture(null);
          setPictureFile(null);
          setPictureTempFile(null);
          setShowPictureModal(true);
        }}
      >
        Ajouter une image
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover className="w-100 w-lg-75 mx-auto border-secondary bs-secondaryDark">
          <thead>
            <tr>
              <th className="w-10">Image</th>
              <th>Titre</th>
              <th className="w-9">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pictures.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center">Aucune image</td>
              </tr>
            )}
            {pictures.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image_path && (
                    <Image
                      src={supabase.storage.from("team-pictures-bucket").getPublicUrl(p.image_path).data.publicUrl}
                      rounded
                      className="w-12 w-lg-14"
                    />
                  )}
                </td>
                <td>{p.title}</td>
                <td>
                  <Button
                    variant="tertiary"
                    className="w-9 w-md-10 fs-7 fs-md-6 mb-2 text-customDark border border-customDark"
                    onClick={() => {
                      setCurrentPicture(p);
                      setPictureFile(null);
                      setPictureTempFile(null);
                      setShowPictureModal(true);
                    }}
                  >
                    Modifier
                  </Button>{" "}
                  <Button
                    variant="danger"
                    className="w-9 w-md-10 fs-7 fs-md-6 text-customLight border border-customDark"
                    onClick={() => handleDeletePicture(p.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ------------------ MODALS ------------------ */}

      {/* MEMBER MODAL */}
      <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)}>
        <Form onSubmit={handleAddOrEditMember}>
          <Modal.Header closeButton>
            <Modal.Title>{currentMember ? "Modifier" : "Ajouter"} membre</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Prénom</Form.Label>
              <Form.Control
                name="first_name"
                defaultValue={currentMember?.first_name || ""}
                placeholder="Prénom"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Nom</Form.Label>
              <Form.Control
                name="last_name"
                defaultValue={currentMember?.last_name || ""}
                placeholder="Nom"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Rôle</Form.Label>
              <Form.Control
                name="role"
                defaultValue={currentMember?.role || ""}
                placeholder="Rôle"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setMemberTempImage(e.target.files[0]);
                  setShowCrop(true);
                }}
              />
              {getCurrentImageUrl(memberTempImage, currentMember?.photo_path, "team-bucket") && (
                <div className="mt-3 text-center">
                  <small className="d-block mb-2">Prévisualisation :</small>
                  <Image
                    src={getCurrentImageUrl(memberTempImage, currentMember?.photo_path, "team-bucket")}
                    roundedCircle
                    className="w-50"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="text-customLight border border-customDark"
              variant="danger"
              onClick={() => setShowMemberModal(false)}
            >
              Annuler
            </Button>
            <Button className="border border-customDark" type="submit">
              {currentMember ? "Modifier" : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* PICTURE MODAL */}
      <Modal show={showPictureModal} onHide={() => setShowPictureModal(false)}>
        <Form onSubmit={handleAddOrEditPicture}>
          <Modal.Header closeButton>
            <Modal.Title>{currentPicture ? "Modifier" : "Ajouter"} image</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Titre</Form.Label>
              <Form.Control
                name="title"
                defaultValue={currentPicture?.title || ""}
                placeholder="Titre"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setPictureTempFile(e.target.files[0]);
                  setShowCrop(true);
                }}
              />
              {getCurrentImageUrl(pictureTempFile, currentPicture?.image_path, "team-pictures-bucket") && (
                <div className="mt-3 text-center">
                  <small className="d-block mb-2">Prévisualisation :</small>
                  <Image
                    src={getCurrentImageUrl(pictureTempFile, currentPicture?.image_path, "team-pictures-bucket")}
                    rounded
                    className="w-80 w-md-50"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="text-customLight border border-customDark"
              variant="danger"
              onClick={() => setShowPictureModal(false)}
            >
              Annuler
            </Button>
            <Button className="border border-customDark" type="submit">
              {currentPicture ? "Modifier" : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* IMAGE CROP */}
      <ImageCropModal
        show={showCrop}
        imageFile={memberTempImage || pictureTempFile}
        onClose={() => setShowCrop(false)}
        onValidate={(cropped) => {
          if (showMemberModal) setMemberImageFile(cropped);
          else setPictureFile(cropped);
          setShowCrop(false);
        }}
        aspect={4 / 3}
      />
    </div>
  );
};

export default ManageTeam;