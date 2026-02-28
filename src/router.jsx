import { createBrowserRouter, Outlet } from "react-router-dom";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";


// Client pages
import Home from "./pages/Home";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import LegalDocuments from "./pages/LegalDocuments"
import Policy from "./pages/Policy";
import LegalNotices from "./pages/LegalNotices";

// Protected routes
import ProtectedRoute from "./components/ProtectedRoute";

// Admin pages
import ManageEvents from "./components/admin/ManageEvents";
import ManageTeam from "./components/admin/ManageTeam";
import ManageHomeContent from "./components/admin/ManageHomeContent";
import ManageLegalDocs from "./components/admin/ManageLegalDocs";
import AdminMessaging from "./components/admin/AdminMessaging";
import ManageBanners from "./components/admin/ManageBanners";

export const router = createBrowserRouter([
  // Pages publiques
  {
    element: <PublicLayout><Outlet /></PublicLayout>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/team", element: <Team /> },
      { path: "/contact", element: <Contact /> },
      { path: "/documents", element: <LegalDocuments /> },
      { path: "/policy", element: <Policy /> },
      { path: "/legal-notices", element: <LegalNotices /> },
    ],
  },

  // Login
  { path: "/login", element: <Login /> },

  // Admin – parent sécurisé
  {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>,
    children: [
      { path: "", element: <Admin /> }, // /admin
      { path: "manage-events", element: <ManageEvents /> },
      { path: "manage-team", element: <ManageTeam /> },
      { path: "manage-home", element: <ManageHomeContent /> },
      { path: "manage-docs", element: <ManageLegalDocs /> },
      { path: "messaging", element: <AdminMessaging /> },
      { path: "manage-banners", element: <ManageBanners />}
    ],
  },
]);
