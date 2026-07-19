import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth, formatApiErrorDetail } from "@/auth/AuthContext";
import { useLang } from "@/i18n/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOAN_TYPES = ["personnel", "immobilier", "auto", "professionnel", "rachat"];
const LOCALES = { fr: "fr-FR", nl: "nl-NL", de: "de-CH", es: "es-ES", pt: "pt-PT", pl: "pl-PL" };

export default function NewApplication() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("personnel");
  const [amount, setAmount] = useState(25000);
  const [months, setMonths] = useState(60);
  const [phone, setPhone] = useState("");
  const [income, setIncome] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fmt = useMemo(
    () => new Intl.NumberFormat(LOCALES[lang] || "fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang]
  );

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API}/applications`,
        {
          full_name: user.name,
          email: user.email,
          phone,
          loan_type: loanType,
          amount: Number(amount),
          duration_months: Number(months),
          monthly_income: income ? Number(income) : null,
          message: message || null,
        },
        { withCredentials: true }
      );
      toast.success(t("newApp.success"));
      navigate("/client", { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      data-testid="new-application"
      className="min-h-screen bg-[#0A0A0A] text-white"
    >
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/40 sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-4 flex items-center justify-between">
          <Link to="/client" className="flex items-center gap-3 text-xs tracking-caps text-white/60 hover:text-white" data-testid="new-app-back">
            <ArrowLeft className="w-4 h-4" />
            {t("appDetail.back")}
          </Link>
          <Link to="/" className="hidden md:block">
            <img src="/brand/eurokredit-logo.jpg" alt="EuroKredit" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-6 md:px-12 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-caps text-[#D4AF37] mb-4">
            {t("newApp.chip")}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.02] tracking-tighter mb-6">
            {t("newApp.title1")}{" "}
            <span className="italic text-[#D4AF37]">{t("newApp.title2")}</span>.
          </h1>
          <p className="text-white/50 max-w-lg leading-relaxed">
            {t("newApp.subtitle")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          onSubmit={submit}
          data-testid="new-application-form"
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <div className="md:col-span-2">
            <label className="text-xs tracking-caps text-white/40 block mb-4">
              {t("form.loanType")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {LOAN_TYPES.map((tid) => (
                <button
                  key={tid}
                  type="button"
                  onClick={() => setLoanType(tid)}
                  data-testid={`new-app-type-${tid}`}
                  className={`text-xs tracking-caps py-3 px-2 border transition-all ${
                    loanType === tid
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-white/15 text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  {t(`loanLabels.${tid}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between mb-4">
              <label className="text-xs tracking-caps text-white/40">{t("simulator.amount")}</label>
              <span className="font-serif text-3xl text-white">{fmt.format(amount)}</span>
            </div>
            <Slider
              value={[amount]}
              onValueChange={(v) => setAmount(v[0])}
              min={3000}
              max={500000}
              step={1000}
              data-testid="new-app-amount"
              className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37]"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between mb-4">
              <label className="text-xs tracking-caps text-white/40">{t("simulator.duration")}</label>
              <span className="font-serif text-3xl text-white">
                {months} {t("simulator.months")}
              </span>
            </div>
            <Slider
              value={[months]}
              onValueChange={(v) => setMonths(v[0])}
              min={12}
              max={300}
              step={6}
              data-testid="new-app-duration"
              className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.phoneLabel")}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="editorial-input"
              placeholder="+33 6 00 00 00 00"
              data-testid="new-app-phone"
            />
          </div>
          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.income")}
            </label>
            <input
              type="number"
              min="0"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="editorial-input"
              placeholder={t("form.incomePh")}
              data-testid="new-app-income"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.message")}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="editorial-input resize-none"
              placeholder={t("form.messagePh")}
              data-testid="new-app-message"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="new-app-submit"
            className="btn-sweep md:col-span-2 border border-[#D4AF37] text-[#D4AF37] py-4 text-xs tracking-caps disabled:opacity-50 mt-4"
          >
            {loading ? t("form.sending") : t("newApp.submit")}
          </button>
        </motion.form>
      </div>
    </main>
  );
}
