import { useEffect, useState, useRef } from "react";
import { Carousel, Spinner, Modal } from "react-bootstrap";
import { getTeamPictures } from "../../services/teamPicturesService";
import { supabase } from "../../services/supabaseClient";

import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TeamSlider = () => {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const touchStartX = useRef(null);

  const loadPictures = async () => {
    try {
      const data = await getTeamPictures();
      setPictures(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPictures();
  }, []);

  const openModal = (index) => {
    setCurrentIndex(index);
    setShow(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setShow(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % pictures.length);
    resetZoom();
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? pictures.length - 1 : prev - 1
    );
    resetZoom();
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => {
      const newZoom = e.deltaY < 0 ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newZoom, 1), 3);
    });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  };

  if (loading) return <Spinner animation="border" />;
  if (pictures.length === 0) return null;

  const getImageUrl = (pic) =>
    supabase.storage
      .from("team-pictures-bucket")
      .getPublicUrl(pic.image_path).data.publicUrl;

  return (
    <section className="pb-4">
      <div className="container">
        <h2 className="text-center mb-4 fs-4 fs-lg-3">
          Galerie photo
        </h2>

        <Carousel
          className="border bg-secondary border-2 border-secondary bs-darkShadow rounded overflow-hidden w-md-50 w-lg-50 mx-auto"
          variant="light"
          interval={null}
        >
          {pictures.map((pic, index) => (
            <Carousel.Item key={pic.id}>
              <div className="d-flex justify-content-center align-items-center h-16 h-lg-18">
                <img
                  className="d-block h-100 w-auto"
                  src={getImageUrl(pic)}
                  alt={pic.title}
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(index)}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <Modal
        show={show}
        onHide={closeModal}
        fullscreen
        centered
        contentClassName="bg-black"
      >
        <Modal.Body
          className="d-flex justify-content-center align-items-center position-relative p-0"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeModal}
            aria-label="Fermer la galerie"
            className="gallery-btn position-absolute top-0 end-0 m-3"
          >
            <FiX size={26} />
          </button>

          {/* Bouton précédent */}
          <button
            onClick={prevImage}
            aria-label="Image précédente"
            className="gallery-btn position-absolute start-0 top-50 translate-middle-y ms-3"
          >
            <FiChevronLeft size={30} />
          </button>

          {/* Bouton suivant */}
          <button
            onClick={nextImage}
            aria-label="Image suivante"
            className="gallery-btn position-absolute end-0 top-50 translate-middle-y me-3"
          >
            <FiChevronRight size={30} />
          </button>

          <img
            src={getImageUrl(pictures[currentIndex])}
            alt="fullscreen"
            draggable={false}
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.2s ease",
              maxHeight: "100vh",
              maxWidth: "100%",
              objectFit: "contain",
              cursor: zoom > 1 ? "grab" : "default",
            }}
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default TeamSlider;