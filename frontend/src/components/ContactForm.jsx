import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOAN_TYPES = ["personnel", "immobilier", "auto", "professionnel", "rachat"];

export default function ContactForm() {
  const { t } = useLang();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    loan_type: "personnel",
    amount: 25000,
    duration_months: 60,
    monthly_income: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        duration_months: Number(form.duration_months),
        monthly_income: form.monthly_income ? Number(form.monthly_income) : null,
      };
      await axios.post(`${API}/applications`, payload);
      toast.success(t("form.success"));
      setForm({
        full_name: "", email: "", phone: "", loan_type: "personnel",
        amount: 25000, duration_months: 60, monthly_income: "", message: "",
      });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : t("form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="demande"
      data-testid="contact-section"
      className="relative bg-[#1B1B1F] py-24 md:py-40 border-y border-white/10"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 grid md:grid-cols-12 gap-10 md:gap-20">
        <div className="md:col-span-5">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-xs tracking-caps text-[#D4AF37]">06 —</span>
            <span className="text-xs tracking-caps text-white/60">
              {t("form.chip")}
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.02] tracking-tighter">
            {t("form.title1")}{" "}
            <span className="italic text-[#D4AF37]">{t("form.title2")}</span>
            {t("form.title3")}
          </h2>
          <p className="text-white/60 mt-8 leading-relaxed max-w-md">
            {t("form.intro")}
          </p>

          <div className="mt-14 space-y-6 border-t border-white/10 pt-8">
            <div>
              <p className="text-xs tracking-caps text-white/40 mb-1">
                {t("form.cabinet")}
              </p>
              <p className="text-white/80">{t("form.address")}</p>
            </div>
            <div>
              <p className="text-xs tracking-caps text-white/40 mb-1">
                {t("form.lineLabel")}
              </p>
              <p className="text-white/80">{t("form.phone")}</p>
            </div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          onSubmit={submit}
          data-testid="loan-application-form"
          className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="md:col-span-2">
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.fullName")}
            </label>
            <input
              type="text" required
              value={form.full_name}
              onChange={update("full_name")}
              className="editorial-input"
              placeholder={t("form.fullNamePh")}
              data-testid="form-fullname"
            />
          </div>
          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.email")}
            </label>
            <input
              type="email" required
              value={form.email}
              onChange={update("email")}
              className="editorial-input"
              placeholder={t("form.emailPh")}
              data-testid="form-email"
            />
          </div>
          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.phoneLabel")}
            </label>
            <input
              type="tel" required
              value={form.phone}
              onChange={update("phone")}
              className="editorial-input"
              placeholder={t("form.phonePh")}
              data-testid="form-phone"
            />
          </div>

          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.loanType")}
            </label>
            <select
              value={form.loan_type}
              onChange={update("loan_type")}
              className="editorial-input appearance-none"
              data-testid="form-loantype"
            >
              {LOAN_TYPES.map((tid) => (
                <option key={tid} value={tid} className="bg-[#0A0A0A] text-white">
                  {t(`loanLabels.${tid}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.amount")}
            </label>
            <input
              type="number" min="1000" required
              value={form.amount}
              onChange={update("amount")}
              className="editorial-input"
              data-testid="form-amount"
            />
          </div>

          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.duration")}
            </label>
            <input
              type="number" min="6" max="360" required
              value={form.duration_months}
              onChange={update("duration_months")}
              className="editorial-input"
              data-testid="form-duration"
            />
          </div>

          <div>
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.income")}
            </label>
            <input
              type="number" min="0"
              value={form.monthly_income}
              onChange={update("monthly_income")}
              className="editorial-input"
              placeholder={t("form.incomePh")}
              data-testid="form-income"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs tracking-caps text-white/40 block mb-2">
              {t("form.message")}
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={update("message")}
              className="editorial-input resize-none"
              placeholder={t("form.messagePh")}
              data-testid="form-message"
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
            <button
              type="submit"
              disabled={loading}
              data-testid="form-submit"
              className="btn-sweep border border-[#D4AF37] text-[#D4AF37] px-10 py-4 text-xs tracking-caps disabled:opacity-50"
            >
              {loading ? t("form.sending") : t("form.submit")}
            </button>
            <p className="text-[10px] text-white/30 max-w-md leading-relaxed">
              {t("form.terms")}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
