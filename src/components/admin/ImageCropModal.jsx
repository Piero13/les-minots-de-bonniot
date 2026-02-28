import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Modal, Button, Spinner } from "react-bootstrap";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
};

const ImageCropModal = ({ show, imageFile, onClose, onValidate, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (imageFile) {
      setImageUrl(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleValidate = async () => {
    try {
      setLoading(true);

      const blob = await getCroppedImg(imageUrl, croppedAreaPixels);
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });

      onValidate(file);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Recadrer l'image</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ position: "relative", height: 400 }}>
        {imageUrl && (
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Spinner animation="border" variant="light" />
          </div>
        )}
      </Modal.Body>

      <div className="px-3 pb-2">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-100"
        />
      </div>

      <Modal.Footer>
        <Button variant="danger" onClick={onClose} disabled={loading} className="text-customLight">
          Annuler
        </Button>
        <Button onClick={handleValidate} disabled={loading}>
          {loading ? "Traitement..." : "Valider"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageCropModal;