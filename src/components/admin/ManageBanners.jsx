import { useEffect, useState } from "react";
import { Button, Modal, Spinner, Alert, Image } from "react-bootstrap";
import imageCompression from "browser-image-compression";
import { supabase } from "../../services/supabaseClient";
import {
  getHomeBanners,
  addHomeBanner,
  activateBanner,
  deleteHomeBanner,
} from "../../services/homeBannerService";
import ImageCropModal from "./ImageCropModal";

const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activatingId, setActivatingId] = useState(null); // pour loader bouton

  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [tempImage, setTempImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  // ---------------- LOAD ----------------
  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await getHomeBanners();
      setBanners(data);
    } catch (err) {
      console.error(err);
      setError("Erreur chargement bannières.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // ---------------- UPLOAD ----------------
  const handleValidate = async () => {
    if (!imageFile) return;

    try {
      setSaving(true);
      setError(null);

      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      });

      const fileName = `banner-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("home-banners-bucket")
        .upload(fileName, compressedFile, {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      await addHomeBanner({
        image_path: fileName,
        active_banner: false,
      });

      setShowModal(false);
      setImageFile(null);
      setTempImage(null);

      await loadBanners();
    } catch (err) {
      console.error(err);
      setError("Erreur upload bannière.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- ACTIVATE ----------------
  const handleActivate = async (id) => {
    try {
      setError(null);
      setActivatingId(id);

      // Appel RPC Supabase
      await activateBanner(id)

      await loadBanners();
    } catch (err) {
      console.error("Activation error raw:", err);
      setError(
        err?.message ||
          "Erreur activation bannière. Vérifiez que la fonction RPC existe et que les paramètres sont corrects."
      );
    } finally {
      setActivatingId(null);
    }
  };

  // ---------------- DELETE ----------------
  const confirmDelete = async () => {
    if (!selectedBanner) return;

    try {
      setSaving(true);

      // supprimer fichier storage
      await supabase.storage
        .from("home-banners-bucket")
        .remove([selectedBanner.image_path]);

      await deleteHomeBanner(selectedBanner.id);

      setShowConfirmDelete(false);
      setSelectedBanner(null);
      await loadBanners();
    } catch (err) {
      console.error(err);
      setError("Erreur suppression bannière.");
    } finally {
      setSaving(false);
    }
  };

  const getPublicUrl = (path) => {
    return supabase.storage
      .from("home-banners-bucket")
      .getPublicUrl(path).data.publicUrl;
  };

  // ---------------- RENDER ----------------
  return (
    <div className="pb-5 px-4 mt-5">
      <h2 className="fs-4 fs-md-3 text-center text-lg-start mb-3">
        Gérer la bannière
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        className="mb-4 border border-customDark bs-darkShadow"
        onClick={() => setShowModal(true)}
      >
        Ajouter une bannière
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="row g-3">
          {banners.map((banner) => (
            <div key={banner.id} className="col-12 col-md-6 col-lg-4">
              <div className="border border-primary p-2 text-center position-relative">
                {banner.active_banner && (
                  <span className="badge bg-success position-absolute top-0 start-0 m-2">
                    Active
                  </span>
                )}

                <Image
                  src={getPublicUrl(banner.image_path)}
                  fluid
                  style={{ maxHeight: 200, objectFit: "cover" }}
                  className="mb-2"
                />

                <div className="d-flex justify-content-center gap-2">
                  <Button
                    size="sm"
                    className="border border-customDark"
                    onClick={() => handleActivate(banner.id)}
                    disabled={activatingId === banner.id || banner.active_banner}
                  >
                    {activatingId === banner.id ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Sélectionner"
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    className="border border-customDark text-customLight"
                    onClick={() => {
                      setSelectedBanner(banner);
                      setShowConfirmDelete(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- ADD MODAL ---------------- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle bannière</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => {
              setTempImage(e.target.files[0]);
              setShowCrop(true);
            }}
          />

          {imageFile && (
            <div className="text-center">
              <Image
                src={URL.createObjectURL(imageFile)}
                fluid
                style={{ maxHeight: 200, objectFit: "cover" }}
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="border border-customDark text-customLight"
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            className="border border-customDark"
            onClick={handleValidate}
            disabled={saving || !imageFile}
          >
            {saving ? "Sauvegarde..." : "Valider"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------- DELETE CONFIRM ---------------- */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer suppression</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette bannière ?
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="border border-customDark text-customLight"
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
            disabled={saving}
          >
            Annuler
          </Button>

          <Button
            variant="danger"
            className="text-customLight border border-customDark"
            onClick={confirmDelete}
            disabled={saving}
          >
            {saving ? "Suppression..." : "Supprimer"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------- CROP MODAL ---------------- */}
      <ImageCropModal
        show={showCrop}
        imageFile={tempImage}
        onClose={() => setShowCrop(false)}
        onValidate={(file) => {
          setImageFile(file);
          setShowCrop(false);
        }}
        aspect={16 / 9} // format bannière
      />
    </div>
  );
};

export default ManageBanners;