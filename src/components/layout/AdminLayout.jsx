import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const { profile } = useContext(AuthContext);

  return (
    <>
      <AdminNavbar />
      <p className="text-center m-0">
        Connecté : {profile?.first_name} {profile?.last_name} ({profile?.role})
      </p>
      <main className="mt-4 pb-6">{children}</main>
    </>
  );
};

export default AdminLayout;
