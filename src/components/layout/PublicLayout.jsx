import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

const PublicLayout = ({ children }) => {
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
