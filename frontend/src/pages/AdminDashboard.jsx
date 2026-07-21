import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth, formatApiErrorDetail } from "@/auth/AuthContext";
import { useLang } from "@/i18n/LanguageContext";
import { LogOut, ArrowRight, ShieldCheck } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOCALES = { fr: "fr-FR", nl: "nl-NL", de: "de-CH", es: "es-ES", pt: "pt-PT", pl: "pl-PL" };
const STEP_LABELS = ["Soumise", "En examen", "Pré-accord", "Contrat", "Décaissée"];

function Stat({ label, value }) {
  return (
    <div className="border border-white/10 bg-[#1B1B1F]/40 p-6 md:p-8">
      <p className="text-xs tracking-caps text-white/40 mb-3">{label}</p>
      <p className="font-serif text-3xl md:text-4xl text-white tracking-tighter">{value}</p>
    </div>
  );
}

function StepBar({ index }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`h-1 flex-1 ${i <= index ? "bg-[#D4AF37]" : "bg-white/10"}`} />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fmt = useMemo(
    () => new Intl.NumberFormat(LOCALES[lang] || "fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang]
  );
  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(LOCALES[lang] || "fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    [lang]
  );

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/applications`, { withCredentials: true });
      setApps(data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const doLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const totalRequested = apps.reduce((s, a) => s + (a.amount || 0), 0);
  const inProgress = apps.filter((a) => a.step_index < 4).length;
  const disbursed = apps.filter((a) => a.step_index === 4).length;

  return (
    <main data-testid="admin-dashboard" className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/40 sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" data-testid="admin-home-link">
            <img src="/brand/eurokredit-logo.jpg" alt="EuroKredit" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-xs tracking-caps">Administration</p>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs tracking-caps text-white/40" data-testid="admin-user-role">
                {user?.name}
              </p>
              <p className="text-sm text-white">{user?.email}</p>
            </div>
            <button
              onClick={doLogout}
              data-testid="admin-logout"
              className="flex items-center gap-2 border border-white/15 px-4 py-2.5 text-xs tracking-caps text-white/70 hover:text-white hover:border-[#D4AF37] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-14 md:py-20">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-20"
        >
          <p className="text-xs tracking-caps text-[#D4AF37] mb-4">Console d'administration</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.02] tracking-tighter">
            Toutes les <span className="italic text-[#D4AF37]">demandes</span>.
          </h1>
          <p className="text-white/50 mt-6 max-w-lg leading-relaxed">
            Pilotez chaque dossier de financement. Cliquez sur une demande pour faire
            avancer son statut, étape par étape.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14 md:mb-20" data-testid="admin-stats">
          <Stat label="Dossiers en cours" value={inProgress} />
          <Stat label="Montant total demandé" value={fmt.format(totalRequested)} />
          <Stat label="Dossiers décaissés" value={disbursed} />
        </div>

        {/* List */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-caps text-[#D4AF37] mb-2">Registre</p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter">
              {apps.length} demande{apps.length > 1 ? "s" : ""}
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-white/40 tracking-caps">Chargement…</p>
        ) : apps.length === 0 ? (
          <div className="border border-white/10 p-10 md:p-14 text-center" data-testid="admin-empty">
            <p className="font-serif italic text-2xl md:text-3xl text-white mb-4">Aucune demande</p>
            <p className="text-white/50 max-w-md mx-auto text-sm leading-relaxed">
              Les demandes de financement soumises par les clients apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="admin-applications-list">
            {apps.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
                data-testid={`admin-app-row-${a.id}`}
                className="group border border-white/10 bg-[#1B1B1F]/40 hover:border-white/25 transition-colors"
              >
                <Link
                  to={`/client/applications/${a.id}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-8"
                >
                  <div className="md:col-span-3">
                    <p className="text-xs tracking-caps text-white/40 mb-1">{a.full_name}</p>
                    <p className="text-sm text-white/70 truncate">{a.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs tracking-caps text-white/40 mb-1">
                      {t(`loanLabels.${a.loan_type}`) || a.loan_type}
                    </p>
                    <p className="font-serif text-xl md:text-2xl text-white tracking-tighter">
                      {fmt.format(a.amount)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs tracking-caps text-white/40 mb-1">Durée</p>
                    <p className="text-white/85">{a.duration_months} mois</p>
                  </div>
                  <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs tracking-caps text-[#D4AF37]">
                        {STEP_LABELS[a.step_index] || a.status}
                      </p>
                      <p className="text-[10px] tracking-caps text-white/40">{a.step_index + 1}/5</p>
                    </div>
                    <StepBar index={a.step_index} />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                    <p className="text-[10px] tracking-caps text-white/40 hidden md:block">
                      {dateFmt.format(new Date(a.created_at))}
                    </p>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
