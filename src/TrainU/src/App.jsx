import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // L'import du fichier créé ci-dessus

// Pages
import Home from "./pages/Accueil.jsx";
import Formation from "./pages/Formation.jsx";
import FormationDetail from "./pages/FormationDetail.jsx";
import LoginUtilisateur from "./pages/LoginUtilisateur.jsx";
import LoginIntervenant from "./pages/LoginIntervenant";
import LoginAdmin from "./pages/LoginAdmin";
import SessionSelection from "./pages/SessionSelection.jsx";
import Paiement from "./pages/paiement.jsx";
import SignUtilisateur from "./pages/SignUtilisateur.jsx";
import DashboardApprenant from "./pages/Dashboardapp.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import DashboardIntervenant from "./pages/DashboardIntervenant.jsx";
import Profil from "./pages/Profil.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* --- ROUTES PUBLIQUES --- */}
              <Route index element={<Home />} />
              <Route path="/login" element={<LoginUtilisateur />} />
              <Route path="/intervenant/login" element={<LoginIntervenant />} />
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route path="/formation" element={<Formation />} />
              <Route path="/formation/:id" element={<FormationDetail />} />
              <Route path="/signutilisateur" element={<SignUtilisateur />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />

              {/* --- ROUTES PROTÉGÉES : APPRENANT --- */}
              <Route element={<ProtectedRoute allowedRoles={["apprenant", "utilisateur"]} />}>
                <Route path="/DashboardApprenant" element={<DashboardApprenant />} />
                <Route path="/profil" element={<Profil />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["apprenant", "utilisateur", "admin"]} />}>
                <Route path="/formation/:id/session/" element={<SessionSelection />} />
                <Route path="/paiement" element={<Paiement />} />
                {/* L'admin peut maintenant entrer ici */}
              </Route>

              {/* --- ROUTES PROTÉGÉES : ADMIN --- */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              </Route>

              {/* --- ROUTES PROTÉGÉES : INTERVENANT --- */}
              <Route element={<ProtectedRoute allowedRoles={["intervenant"]} />}>
                <Route path="/intervenant/dashboard" element={<DashboardIntervenant />} />
              </Route>

            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Elements>
  );
}