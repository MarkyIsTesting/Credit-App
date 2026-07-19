import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Offres", href: "#offres" },
  { label: "Méthode", href: "#methode" },
  { label: "Simulateur", href: "#simulateur" },
  { label: "Avis", href: "#avis" },
  { label: "FAQ", href: "#faq" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-black/60 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-5 flex items-center justify-between">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-center gap-2"
          aria-label="EuroKredit — accueil"
        >
          <span className="font-serif text-2xl tracking-tight text-white">
            Euro<span className="italic text-[#D4AF37]">Kredit</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              className="text-xs tracking-caps text-white/60 hover:text-white transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#demande"
          data-testid="nav-apply-button"
          className="btn-sweep border border-white/20 text-white px-5 py-3 text-xs tracking-caps hover:border-[#D4AF37] transition-all duration-300"
        >
          Demander un prêt
        </a>
      </div>
    </motion.header>
  );
}
