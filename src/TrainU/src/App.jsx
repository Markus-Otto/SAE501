import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Accueil.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx"; // ta page existante

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              {/* plus tard: /register */}
              <Route path="/paiements" element={<PaymentsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Elements>
  );
}
