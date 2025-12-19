import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Accueil.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx"; // ta page existante
import Formation from "./pages/Formation.jsx";
import FormationDetail from "./pages/FormationDetail.jsx";
import LoginUtilisateur from "./pages/LoginUtilisateur.jsx";
import LoginIntervenant from "./pages/LoginIntervenant";
import LoginAdmin from "./pages/LoginAdmin";
import SessionSelection from "./pages/SessionSelection.jsx";
import Paiement from "./pages/paiement.jsx";
import SignUtilisateur from "./pages/SignUtilisateur.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<LoginUtilisateur />} />
              <Route path="/intervenant/login" element={<LoginIntervenant />} />
              <Route path="/admin/login" element={<LoginAdmin />} />
              {/* plus tard: /register */}
              <Route path="/paiements" element={<PaymentsPage />} />
              <Route path="/formation" element={<Formation />} />
              <Route path="/formation/:id" element={<FormationDetail />} />
              <Route path="/formation/:id/session/" element={<SessionSelection />} />
              <Route path="/paiement" element={<Paiement />} />
              <Route path="/signutilisateur" element={<SignUtilisateur />} />
            </Route>
          
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Elements>
  );
}
