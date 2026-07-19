import { useEffect } from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ClientDashboard from "@/pages/ClientDashboard";
import ApplicationDetail from "@/pages/ApplicationDetail";
import NewApplication from "@/pages/NewApplication";
import GrainOverlay from "@/components/GrainOverlay";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/auth/AuthContext";
import ProtectedRoute from "@/auth/ProtectedRoute";

function LenisSetup() {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    // Only enable smooth scroll on the marketing home
    if (window.location.pathname !== "/") return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  return null;
}

function App() {
  return (
    <div className="App bg-[#0A0A0A] text-[#FAFAFA] min-h-screen">
      <GrainOverlay />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <LenisSetup />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/client"
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/new"
                element={
                  <ProtectedRoute>
                    <NewApplication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/applications/:id"
                element={
                  <ProtectedRoute>
                    <ApplicationDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1B1B1F",
            border: "1px solid rgba(250,250,250,0.1)",
            color: "#FAFAFA",
            fontFamily: "Manrope, sans-serif",
            borderRadius: "4px",
          },
        }}
      />
    </div>
  );
}

export default App;
