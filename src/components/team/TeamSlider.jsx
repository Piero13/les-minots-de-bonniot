import { useEffect, useState, useRef } from "react";
import { Carousel, Spinner, Modal } from "react-bootstrap";
import { getTeamPictures } from "../../services/teamPicturesService";
import { supabase } from "../../services/supabaseClient";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TeamSlider = () => {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [zoom, setZoom] = useState(1);

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

  const getImageUrl = (pic) =>
    supabase.storage
      .from("team-pictures-bucket")
      .getPublicUrl(pic.image_path).data.publicUrl;

  const openModal = (index) => {
    setCurrentIndex(index);
    setZoom(1);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setZoom(1);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % pictures.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? pictures.length - 1 : prev - 1
    );
  };

  const handleWheel = (e) => {
    e.preventDefault();

    setZoom((prev) => {
      const newZoom = e.deltaY < 0 ? prev + 0.15 : prev - 0.15;
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

  useEffect(() => {
    setZoom(1);
  }, [currentIndex]);

  // navigation clavier
  useEffect(() => {
    const handleKey = (e) => {
      if (!show) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (loading) return <Spinner animation="border" />;
  if (!pictures.length) return null;

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
                  alt={`Photo de ${pic.title} à l'école Saint julien 1, Marseille 12`}
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(index)}
                  loading="lazy"
                />
              </div>
              <Carousel.Caption>
                <h3>{pic.title}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* LIGHTBOX */}

      <Modal
        show={show}
        onHide={closeModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border border-secondary bg-secondary-light">
          <Modal.Title>
            {pictures[currentIndex]?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          className="border border-secondary d-flex flex-column align-items-center py-4"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="position-relative w-100 d-flex justify-content-center">

            <button
              onClick={prevImage}
              className="gallery-btn position-absolute start-0 top-50 translate-middle-y"
            >
              <FiChevronLeft size={30} />
            </button>

            <img
              src={getImageUrl(pictures[currentIndex])}
              alt={pictures[currentIndex]?.title}
              draggable={false}
              className="img-fluid rounded"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease",
                maxHeight: "70vh",
                objectFit: "contain",
                cursor: zoom > 1 ? "grab" : "default",
              }}
              loading="lazy"
            />

            <button
              onClick={nextImage}
              className="gallery-btn position-absolute end-0 top-50 translate-middle-y"
            >
              <FiChevronRight size={30} />
            </button>

          </div>

          {/* titre de l'image */}
          <h5 className="mt-3 text-center">
            {pictures[currentIndex]?.title}
          </h5>

          {/* compteur */}
          <p className="text-muted">
            {currentIndex + 1} / {pictures.length}
          </p>

        </Modal.Body>
      </Modal>
    </section>
  );
};

export default TeamSlider;