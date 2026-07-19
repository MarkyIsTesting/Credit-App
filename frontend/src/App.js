import { useEffect } from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import Home from "@/pages/Home";
import GrainOverlay from "@/components/GrainOverlay";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

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

  return (
    <div className="App bg-[#0A0A0A] text-[#FAFAFA] min-h-screen">
      <GrainOverlay />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
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
