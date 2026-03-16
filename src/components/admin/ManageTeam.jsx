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

  const [team, setTeam] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [memberImageFile, setMemberImageFile] = useState(null);
  const [memberTempImage, setMemberTempImage] = useState(null);

  const [showPictureModal, setShowPictureModal] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureTempFile, setPictureTempFile] = useState(null);

  const [showCrop, setShowCrop] = useState(false);

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

  const getCurrentImageUrl = (file, currentPath, bucket) => {
    if (file) return URL.createObjectURL(file);
    if (currentPath) {
      return supabase.storage.from(bucket).getPublicUrl(currentPath).data.publicUrl;
    }
    return null;
  };

  const handleAddOrEditMember = async (e) => {
    e.preventDefault();
    setError(null);

    const form = e.target;

    try {
      const payload = {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        role: form.role.value,
      };

      let member;

      if (!currentMember) {
        member = await addTeamMember(payload);
      } else {
        member = await updateTeamMember(currentMember.id, payload);
      }

      if (memberImageFile && member.id) {

        const compressedFile = await imageCompression(memberImageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });

        const fileName = `${member.id}-${Date.now()}.jpg`;

        const { error } = await supabase.storage
          .from("team-bucket")
          .upload(fileName, compressedFile, { contentType: "image/jpeg" });

        if (error) throw error;

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

      const member = team.find((m) => m.id === id);

      if (member?.photo_path) {
        await supabase.storage.from("team-bucket").remove([member.photo_path]);
      }

      await deleteTeamMember(id);
      await loadTeam();

    } catch (err) {
      console.error(err);
      setError("Erreur suppression membre.");
    }
  };

  const handleAddOrEditPicture = async (e) => {
    e.preventDefault();
    setError(null);

    const form = e.target;
    const title = form.title.value;

    try {

      let imagePath = currentPicture?.image_path || null;

      if (pictureFile) {

        const compressedFile = await imageCompression(pictureFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });

        const fileName = `${Date.now()}-${compressedFile.name}`;

        const { error } = await supabase.storage
          .from("team-pictures-bucket")
          .upload(fileName, compressedFile, { contentType: "image/jpeg" });

        if (error) throw error;

        if (currentPicture?.image_path) {
          await supabase.storage.from("team-pictures-bucket").remove([currentPicture.image_path]);
        }

        imagePath = fileName;
      }

      const payload = { title, image_path: imagePath };

      if (!currentPicture) {

        if (!pictureFile) {
          setError("Veuillez sélectionner une image.");
          return;
        }

        await addTeamPicture(payload);

      } else {

        await updateTeamPicture(currentPicture.id, payload);

      }

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

      const pic = pictures.find((p) => p.id === id);

      if (pic?.image_path) {
        await supabase.storage.from("team-pictures-bucket").remove([pic.image_path]);
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

      {/* Admin Members */}

      <h2 className="fs-4 fs-md-3 mb-3 text-center text-lg-start">
        Gérer les membres
      </h2>

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

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover className="w-100 w-lg-75 mx-auto mb-5 border border-primary">
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
                    onClick={() => { setCurrentMember(m); setShowMemberModal(true); }}
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

      {/* Admin Gallery */}

      <h2 className="fs-4 fs-md-3 mb-3 text-center text-lg-start">
        Galerie photo de l'équipe
      </h2>

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
        <Table striped bordered hover className="w-100 w-lg-75 mx-auto  border border-primary">
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
                    width={120}
                    rounded
                    className="w-11 w-md-12 w-lg-14"
                  />
                  )}
                </td>
                <td>{p.title}</td>
                <td>
                  <Button 
                    variant="tertiary"
                    className="w-9 w-md-10 fs-7 fs-md-6 mb-2 text-customDark border border-customDark" 
                    onClick={() => { setCurrentPicture(p); setShowPictureModal(true); }}
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

      {/* Member Modal */}

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
                required
                placeholder="Prénom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Nom</Form.Label>
              <Form.Control 
                name="last_name"
                defaultValue={currentMember?.last_name || ""}
                required
                placeholder="Nom"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-1">Rôle</Form.Label>
              <Form.Control 
                name="role" 
                defaultValue={currentMember?.role || ""} 
                required
                placeholder="Röle"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mb-1">Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setMemberTempImage(e.target.files[0]);
                  setShowCrop(true);
                }}
              />

              {getCurrentImageUrl(memberImageFile || memberTempImage, currentMember?.photo_path, "team-bucket") && (
                <div className="text-center mt-3">
                  <Image
                    src={getCurrentImageUrl(memberImageFile || memberTempImage, currentMember?.photo_path, "team-bucket")}
                    roundedCircle
                    width={150}
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
            <Button 
              className="border border-customDark"
              type="submit"
            >
              {currentMember ? "Modifier" : "Ajouter"}
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>

      {/* Picture Modal */}

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
                required 
                placeholder="Titre"
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

              {getCurrentImageUrl(pictureFile || pictureTempFile, currentPicture?.image_path, "team-pictures-bucket") && (
                <div className="text-center mt-3">
                  <Image
                    src={getCurrentImageUrl(pictureFile || pictureTempFile, currentPicture?.image_path, "team-pictures-bucket")}
                    className="w-80 w-md-50"
                    style={{ objectFit: "cover" }}
                    rounded
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
            <Button 
              className="border border-customDark"
              type="submit"
            >
              {currentPicture ? "Modifier" : "Ajouter"}
            </Button>
          </Modal.Footer>

        </Form>
      </Modal>

      {/* Crop Modal */}

      <ImageCropModal
        show={showCrop}
        imageFile={memberTempImage || pictureTempFile}
        onClose={() => setShowCrop(false)}
        onValidate={(cropped) => {
          if (showMemberModal) setMemberImageFile(cropped);
          else setPictureFile(cropped);
          setShowCrop(false);
        }}
        aspect={showMemberModal ? 1 : 4 / 3}
      />
    </div>
  );
};

export default ManageTeam;