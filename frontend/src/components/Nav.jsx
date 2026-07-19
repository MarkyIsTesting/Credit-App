import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/auth/AuthContext";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown, User } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, languages, t } = useLang();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = languages.find((l) => l.code === lang) || languages[0];

  const links = [
    { label: t("nav.offres"), href: "#offres" },
    { label: t("nav.methode"), href: "#methode" },
    { label: t("nav.simulateur"), href: "#simulateur" },
    { label: t("nav.avis"), href: "#avis" },
    { label: t("nav.faq"), href: "#faq" },
  ];

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
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-5 flex items-center justify-between gap-6">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-center gap-3 group shrink-0"
          aria-label="EuroKredit — accueil"
        >
          <img
            src="/brand/eurokredit-logo.jpg"
            alt="EuroKredit"
            className="h-11 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
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

        <div className="flex items-center gap-3 md:gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="lang-switcher-trigger"
                aria-label={t("langLabel")}
                className="group flex items-center gap-2 border border-white/15 px-3 py-2.5 text-xs tracking-caps text-white/70 hover:text-white hover:border-[#D4AF37] transition-all duration-300"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              data-testid="lang-switcher-menu"
              className="bg-[#0A0A0A] border border-white/10 text-white min-w-[190px] rounded-none"
            >
              {languages.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  data-testid={`lang-option-${l.code}`}
                  onClick={() => setLang(l.code)}
                  className="flex items-center justify-between gap-3 cursor-pointer text-xs tracking-caps text-white/80 focus:bg-[#D4AF37] focus:text-black rounded-none py-2.5"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {l.code === lang && <Check className="w-3.5 h-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href="#demande"
            data-testid="nav-apply-button"
            className="btn-sweep hidden sm:inline-block border border-white/20 text-white px-5 py-3 text-xs tracking-caps hover:border-[#D4AF37] transition-all duration-300"
          >
            {t("nav.apply")}
          </a>

          {user ? (
            <Link
              to="/client"
              data-testid="nav-space-button"
              className="btn-sweep inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-3 sm:px-4 py-3 text-xs tracking-caps"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("nav.space")}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              data-testid="nav-signin-button"
              className="btn-sweep inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] px-3 sm:px-4 py-3 text-xs tracking-caps"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("nav.signIn")}</span>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
