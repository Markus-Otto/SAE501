import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Suspense, lazy } from "react"; // Ajout de Suspense et lazy
import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // L'import du fichier créé ci-dessus

// Pages
const Home = lazy(() => import("./pages/Accueil.jsx"));
const Formation = lazy(() => import("./pages/Formation.jsx"));
const FormationDetail = lazy(() => import("./pages/FormationDetail.jsx"));
const LoginUtilisateur = lazy(() => import("./pages/LoginUtilisateur.jsx"));
const LoginIntervenant = lazy(() => import("./pages/LoginIntervenant"));
const LoginAdmin = lazy(() => import("./pages/LoginAdmin"));
const SessionSelection = lazy(() => import("./pages/SessionSelection.jsx"));
const Paiement = lazy(() => import("./pages/Paiement.jsx"));
const SignUtilisateur = lazy(() => import("./pages/SignUtilisateur.jsx"));
const DashboardApprenant = lazy(() => import("./pages/Dashboardapp.jsx"));
const DashboardAdmin = lazy(() => import("./pages/DashboardAdmin.jsx"));
const DashboardIntervenant = lazy(() => import("./pages/DashboardIntervenant.jsx"));
const Profil = lazy(() => import("./pages/Profil.jsx"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales.jsx"));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Composant de chargement simple pour le Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
  </div>
);

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<LoginUtilisateur />} />
                <Route path="/intervenant/login" element={<LoginIntervenant />} />
                <Route path="/admin/login" element={<LoginAdmin />} />
                <Route path="/formation" element={<Formation />} />
                <Route path="/formation/:id" element={<FormationDetail />} />
                <Route path="/signutilisateur" element={<SignUtilisateur />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />

                <Route element={<ProtectedRoute allowedRoles={["apprenant", "utilisateur"]} />}>
                  <Route path="/DashboardApprenant" element={<DashboardApprenant />} />
                  <Route path="/profil" element={<Profil />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["apprenant", "utilisateur", "admin"]} />}>
                  <Route path="/formation/:id/session/" element={<SessionSelection />} />
                  <Route path="/paiement" element={<Paiement />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["intervenant"]} />}>
                  <Route path="/intervenant/dashboard" element={<DashboardIntervenant />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Elements>
  );
}