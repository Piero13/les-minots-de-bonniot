import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const { user, loading, profile, isAdmin, isSuperAdmin } = useContext(AuthContext);

  // ⚠️ attendre que le profil soit chargé
  if (loading || !profile) return null;

  // 1️⃣ pas connecté → login
  if (!user) return <Navigate to="/login" replace />;

  // 2️⃣ route super_admin → rediriger si pas super_admin
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // 3️⃣ route admin → rediriger si pas admin
  if (!requireSuperAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 4️⃣ tout est ok → afficher la page
  return children;
};

export default ProtectedRoute;
