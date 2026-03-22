import { useEffect } from "react";
import { trackVisit } from "../../services/analyticsService"

import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

const PublicLayout = ({ children }) => {

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem("visited");

    if (!alreadyVisited) {
      trackVisit()
        .then(() => {
          sessionStorage.setItem("visited", "true");
        })
        .catch((err) => {
          console.log("Tracking error : ", err)
        })
    }   
  }, []);

  return (
    <>
      <Header />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
