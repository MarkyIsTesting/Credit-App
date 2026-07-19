import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth, formatApiErrorDetail } from "@/auth/AuthContext";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOCALES = { fr: "fr-FR", nl: "nl-NL", de: "de-CH", es: "es-ES", pt: "pt-PT", pl: "pl-PL" };

export default function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fmt = useMemo(
    () => new Intl.NumberFormat(LOCALES[lang] || "fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang]
  );

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/applications/${id}`, { withCredentials: true });
      setApp(data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
      navigate("/client");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const stepLabels = t("appDetail.steps") || [];
  const stepDescs = t("appDetail.stepDescriptions") || [];

  const advance = async (newIndex) => {
    setSaving(true);
    try {
      const { data } = await axios.patch(
        `${API}/applications/${id}/step`,
        { step_index: newIndex },
        { withCredentials: true }
      );
      setApp(data);
      toast.success(t("appDetail.stepUpdated"));
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !app) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/60 text-xs tracking-caps">
        {t("dashboard.loading")}
      </main>
    );
  }

  return (
    <main
      data-testid="application-detail"
      className="min-h-screen bg-[#0A0A0A] text-white"
    >
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/40 sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-4 flex items-center justify-between">
          <Link to="/client" className="flex items-center gap-3 text-xs tracking-caps text-white/60 hover:text-white" data-testid="detail-back">
            <ArrowLeft className="w-4 h-4" />
            {t("appDetail.back")}
          </Link>
          <Link to="/" className="hidden md:block">
            <img src="/brand/eurokredit-logo.jpg" alt="EuroKredit" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-caps text-[#D4AF37] mb-4">
            {t(`loanLabels.${app.loan_type}`) || app.loan_type}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.02] tracking-tighter">
            {fmt.format(app.amount)}{" "}
            <span className="italic text-[#D4AF37]/80 text-2xl md:text-3xl">
              · {app.duration_months} {t("simulator.months")}
            </span>
          </h1>
          <p className="text-white/40 text-xs tracking-caps mt-4" data-testid="detail-ref">
            {t("appDetail.refLabel")} {app.id.slice(0, 8).toUpperCase()}
          </p>
        </motion.div>

        {/* Progress */}
        <section className="mt-14 md:mt-20 border-t border-white/10 pt-10">
          <p className="text-xs tracking-caps text-[#D4AF37] mb-2">
            {t("appDetail.progressChip")}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tighter mb-10">
            {t("appDetail.progressTitle")}
          </h2>

          <ol className="space-y-6" data-testid="detail-steps-list">
            {stepLabels.map((label, i) => {
              const done = i < app.step_index;
              const current = i === app.step_index;
              return (
                <li key={i} className="grid grid-cols-12 gap-4 md:gap-6 items-start" data-testid={`step-${i}`}>
                  <div className="col-span-2 md:col-span-1 flex flex-col items-center">
                    {done ? (
                      <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                    ) : current ? (
                      <div className="relative">
                        <Clock className="w-6 h-6 text-[#D4AF37]" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-white/20" />
                    )}
                    {i < 4 && (
                      <div className={`w-px flex-1 mt-2 h-16 ${done ? "bg-[#D4AF37]" : "bg-white/10"}`} />
                    )}
                  </div>
                  <div className="col-span-10 md:col-span-11 pb-8">
                    <div className="flex items-center gap-4">
                      <span className={`text-xs tracking-caps ${current ? "text-[#D4AF37]" : done ? "text-white/60" : "text-white/30"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className={`font-serif text-2xl md:text-3xl tracking-tight ${current ? "text-white" : done ? "text-white/80" : "text-white/30"}`}>
                        {label}
                      </h3>
                    </div>
                    <p className={`mt-3 text-sm leading-relaxed max-w-xl ${current || done ? "text-white/60" : "text-white/25"}`}>
                      {stepDescs[i]}
                    </p>
                    {/* Admin advance controls */}
                    {user?.role === "admin" && current && i < 4 && (
                      <button
                        onClick={() => advance(i + 1)}
                        disabled={saving}
                        data-testid={`admin-advance-${i}`}
                        className="btn-sweep mt-4 border border-[#D4AF37] text-[#D4AF37] px-5 py-2.5 text-xs tracking-caps disabled:opacity-50"
                      >
                        {saving ? "…" : t("appDetail.advance")} →
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Details */}
        <section className="mt-14 md:mt-20 border-t border-white/10 pt-10 grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-xs tracking-caps text-[#D4AF37] mb-2">
              {t("appDetail.contactChip")}
            </p>
            <h3 className="font-serif text-2xl tracking-tighter mb-8">
              {t("appDetail.contactTitle")}
            </h3>
            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-xs tracking-caps text-white/40 mb-1">{t("appDetail.name")}</dt>
                <dd className="text-white">{app.full_name}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-caps text-white/40 mb-1">{t("appDetail.email")}</dt>
                <dd className="text-white">{app.email}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-caps text-white/40 mb-1">{t("appDetail.phone")}</dt>
                <dd className="text-white">{app.phone}</dd>
              </div>
            </dl>
          </div>
          <div>
            <p className="text-xs tracking-caps text-[#D4AF37] mb-2">
              {t("appDetail.summaryChip")}
            </p>
            <h3 className="font-serif text-2xl tracking-tighter mb-8">
              {t("appDetail.summaryTitle")}
            </h3>
            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-xs tracking-caps text-white/40 mb-1">{t("appDetail.income")}</dt>
                <dd className="text-white">
                  {app.monthly_income ? fmt.format(app.monthly_income) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-caps text-white/40 mb-1">{t("appDetail.type")}</dt>
                <dd className="text-white">{t(`loanLabels.${app.loan_type}`)}</dd>
              </div>
              {app.message && (
                <div>
                  <dt className="text-xs tracking-caps text-white/40 mb-1">{t("appDetail.notes")}</dt>
                  <dd className="text-white/80 leading-relaxed">{app.message}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
