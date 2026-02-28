import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { getActiveBanner } from "../../services/homeBannerService";
import { Spinner } from "react-bootstrap";
import defaultBanner from "../../assets/APE_banner.jpg";

const Header = () => {
  const [bannerUrl, setBannerUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBanner = async () => {
    try {
      const banner = await getActiveBanner();

      if (banner?.image_path) {
        const { data } = supabase.storage
          .from("home-banners-bucket")
          .getPublicUrl(banner.image_path);

        setBannerUrl(data.publicUrl);
      }
    } catch (err) {
      console.error("Erreur chargement bannière :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  if (loading) {
    return (
      <header className="py-5 h-14 h-sm-16 h-md-18 h-lg-20 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </header>
    );
  }

  return (
    <header
      className="py-5 h-14 h-sm-16 h-md-18 h-lg-20"
      style={{
        backgroundImage: `url(${bannerUrl || defaultBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    </header>
  );
};

export default Header;