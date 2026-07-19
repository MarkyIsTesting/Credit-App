import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth, formatApiErrorDetail } from "@/auth/AuthContext";
import { useLang } from "@/i18n/LanguageContext";

export default function Register() {
  const { t } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      toast.success(t("auth.registerSuccess"));
      navigate("/client", { replace: true });
    } catch (err) {
      const msg = formatApiErrorDetail(err?.response?.data?.detail) || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      data-testid="register-page"
      className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row"
    >
      <div className="hidden md:flex md:w-2/5 relative overflow-hidden border-r border-white/10">
        <img
          src="https://images.pexels.com/photos/15713593/pexels-photo-15713593.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="inline-block">
            <img src="/brand/eurokredit-logo.jpg" alt="EuroKredit" className="h-14 w-auto" />
          </Link>
          <div>
            <p className="text-xs tracking-caps text-[#D4AF37] mb-4">
              {t("auth.spaceLabel")}
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tighter text-white">
              {t("auth.joinTitle")}
              <span className="italic block text-[#D4AF37]">
                {t("auth.joinItalic")}
              </span>
            </h1>
            <p className="text-white/50 mt-6 max-w-sm text-sm leading-relaxed">
              {t("auth.joinSub")}
            </p>
          </div>
          <p className="text-[10px] tracking-caps text-white/30">© EuroKredit</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          onSubmit={submit}
          data-testid="register-form"
          className="w-full max-w-md"
        >
          <p className="text-xs tracking-caps text-[#D4AF37] mb-4">
            {t("auth.signUpChip")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-tighter text-white mb-10">
            {t("auth.signUpTitle")}
          </h2>

          <div className="space-y-8">
            <div>
              <label className="text-xs tracking-caps text-white/40 block mb-2">
                {t("auth.name")}
              </label>
              <input
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="editorial-input"
                placeholder="Prénom Nom"
                data-testid="register-name"
              />
            </div>
            <div>
              <label className="text-xs tracking-caps text-white/40 block mb-2">
                {t("auth.email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="editorial-input"
                placeholder="vous@exemple.fr"
                data-testid="register-email"
              />
            </div>
            <div>
              <label className="text-xs tracking-caps text-white/40 block mb-2">
                {t("auth.password")}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="editorial-input"
                placeholder={t("auth.passwordHint")}
                data-testid="register-password"
              />
              <p className="text-[10px] text-white/30 mt-2">
                {t("auth.passwordRules")}
              </p>
            </div>
          </div>

          {error && (
            <p
              className="text-xs text-red-400 mt-6 border-l-2 border-red-400 pl-3"
              data-testid="register-error"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="register-submit"
            className="btn-sweep w-full mt-10 border border-[#D4AF37] text-[#D4AF37] py-4 text-xs tracking-caps disabled:opacity-50"
          >
            {loading ? t("auth.creating") : t("auth.signUpCta")}
          </button>

          <p className="mt-8 text-xs tracking-caps text-white/40">
            {t("auth.hasAccount")}{" "}
            <Link
              to="/login"
              className="text-white hover:text-[#D4AF37] underline underline-offset-4"
              data-testid="link-to-login"
            >
              {t("auth.loginLink")}
            </Link>
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-xs tracking-caps text-white/40 hover:text-white"
            data-testid="register-back-home"
          >
            ← {t("auth.backHome")}
          </Link>
        </motion.form>
      </div>
    </main>
  );
}
