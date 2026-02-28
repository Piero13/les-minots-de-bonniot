import { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert, Image } from "react-bootstrap";
import imageCompression from "browser-image-compression";
import ImageCropModal from "./ImageCropModal";
import { supabase } from "../../services/supabaseClient";
import { getAboutContent, updateAboutContent } from "../../services/homeService";

const ManageHomeContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [showCrop, setShowCrop] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await getAboutContent();
      setContent(data);
    } catch (err) {
      setError("Erreur chargement contenu.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imagePath = content?.about_image_url || null;

      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });

        const fileName = `about-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("home-bucket")
          .upload(fileName, compressedFile, {
            upsert: false,
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        // supprimer ancienne image
        if (content?.about_image_url) {
          await supabase.storage
            .from("home-bucket")
            .remove([content.about_image_url]);
        }

        imagePath = fileName;
      }

      await updateAboutContent({
        id: content?.id,
        about_title: e.target.title.value,
        about_text: e.target.text.value,
        about_image_url: imagePath,
      });

      setImageFile(null);
      await loadContent();

    } catch (err) {
      console.error(err);
      setError("Impossible de sauvegarder.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="pb-5 px-4">
      <h2 className="fs-4 fs-md-3 text-center text-lg-start">Gérer la section présentation</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Titre</Form.Label>
          <Form.Control name="title" defaultValue={content?.about_title || ""} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-1">Texte de description</Form.Label>
          <Form.Control as="textarea" name="text" rows={5} defaultValue={content?.about_text || ""} required />
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
        </Form.Group>

        {content?.about_image_url && !imageFile && (
          <div className="mt-3">
            <Image
              src={supabase.storage.from("home-bucket").getPublicUrl(content.about_image_url).data.publicUrl}
              fluid
              style={{ maxHeight: 250 }}
            />
          </div>
        )}

        <div className="d-flex justify-content-center justify-content-lg-start">
          <Button type="submit" disabled={saving} className="border border-customDark mt-3 bs-darkShadow">
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </Form>

      <ImageCropModal
        show={showCrop}
        imageFile={tempImage}
        onClose={() => setShowCrop(false)}
        onValidate={(file) => {
          setImageFile(file);
          setShowCrop(false);
        }}
        aspect={4/3}
      />
    </div>
  );
};

export default ManageHomeContent;