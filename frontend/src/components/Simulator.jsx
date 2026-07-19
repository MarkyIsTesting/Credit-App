import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useLang } from "@/i18n/LanguageContext";

const RATES = { personnel: 4.9, immobilier: 3.2, auto: 4.2, professionnel: 5.5, rachat: 4.5 };
const TYPE_IDS = ["personnel", "immobilier", "auto", "professionnel", "rachat"];

function compute(amount, months, rate) {
  const r = rate / 100 / 12;
  if (r === 0) return amount / months;
  return (amount * r) / (1 - Math.pow(1 + r, -months));
}

const LOCALES = { fr: "fr-FR", nl: "nl-NL", de: "de-CH", es: "es-ES", pt: "pt-PT", pl: "pl-PL" };

function makeFormatter(lang) {
  return new Intl.NumberFormat(LOCALES[lang] || "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function AnimatedNumber({ value, fmt }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let start = display;
    const end = value;
    const duration = 500;
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [value]);
  return <>{fmt.format(display)}</>;
}

export default function Simulator() {
  const { t, lang } = useLang();
  const [type, setType] = useState("personnel");
  const [amount, setAmount] = useState(25000);
  const [months, setMonths] = useState(60);

  const rate = RATES[type];
  const monthly = useMemo(() => compute(amount, months, rate), [amount, months, rate]);
  const totalCost = monthly * months;
  const totalInterest = totalCost - amount;
  const fmt = useMemo(() => makeFormatter(lang), [lang]);

  return (
    <section
      id="simulateur"
      data-testid="simulator-section"
      className="relative bg-[#1B1B1F] py-24 md:py-40 border-y border-white/10 overflow-hidden"
    >
      <div
        className="absolute -left-20 top-1/2 -translate-y-1/2 w-[45%] h-[70%] opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1760902419069-466f6f82c8b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBmaW5hbmNlJTIwYWJzdHJhY3QlMjBsdXh1cnl8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
          <div className="md:col-span-4 flex items-start gap-4">
            <span className="text-xs tracking-caps text-[#D4AF37] mt-2">03 —</span>
            <span className="text-xs tracking-caps text-white/60 mt-2">
              {t("simulator.chip")}
            </span>
          </div>
          <h2 className="md:col-span-8 font-serif text-4xl md:text-6xl text-white leading-[1.02] tracking-tighter">
            {t("simulator.title1")}{" "}
            <span className="italic text-[#D4AF37]">{t("simulator.title2")}</span>
            {t("simulator.title3")}
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-6 space-y-14">
            <div>
              <label className="text-xs tracking-caps text-white/50 block mb-4">
                {t("simulator.type")}
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger
                  data-testid="simulator-type-select"
                  className="w-full bg-transparent border-0 border-b border-white/20 rounded-none text-white text-lg py-6 px-0 hover:border-[#D4AF37] focus:ring-0 focus:border-[#D4AF37]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border border-white/10 text-white">
                  {TYPE_IDS.map((tid) => (
                    <SelectItem
                      key={tid}
                      value={tid}
                      data-testid={`simulator-type-${tid}`}
                      className="text-white focus:bg-[#D4AF37] focus:text-black"
                    >
                      {t(`loanLabels.${tid}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-6">
                <label className="text-xs tracking-caps text-white/50">
                  {t("simulator.amount")}
                </label>
                <span className="font-serif text-3xl md:text-4xl text-white" data-testid="simulator-amount-value">
                  {fmt.format(amount)}
                </span>
              </div>
              <Slider
                data-testid="simulator-amount-slider"
                value={[amount]}
                onValueChange={(v) => setAmount(v[0])}
                min={3000}
                max={500000}
                step={1000}
                className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
              />
              <div className="flex justify-between text-xs text-white/40 mt-3 tracking-caps">
                <span>{fmt.format(3000)}</span>
                <span>{fmt.format(500000)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-6">
                <label className="text-xs tracking-caps text-white/50">
                  {t("simulator.duration")}
                </label>
                <span className="font-serif text-3xl md:text-4xl text-white" data-testid="simulator-duration-value">
                  {months} {t("simulator.months")}
                </span>
              </div>
              <Slider
                data-testid="simulator-duration-slider"
                value={[months]}
                onValueChange={(v) => setMonths(v[0])}
                min={12}
                max={300}
                step={6}
                className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
              />
              <div className="flex justify-between text-xs text-white/40 mt-3 tracking-caps">
                <span>12 {t("simulator.months")}</span>
                <span>300 {t("simulator.months")}</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="md:col-span-6 relative backdrop-blur-xl bg-black/40 border border-white/10 p-8 md:p-12"
            data-testid="simulator-result-panel"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs tracking-caps text-white/50">
                {t("simulator.monthly")}
              </span>
              <span className="text-xs tracking-caps text-[#D4AF37]">
                {t("simulator.taeg")} {rate.toFixed(2)}%
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${type}-${amount}-${months}-${lang}`}
                initial={{ opacity: 0.4, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-6xl md:text-8xl text-white tracking-tighter mb-2"
                data-testid="simulator-monthly-value"
              >
                <AnimatedNumber value={monthly} fmt={fmt} />
              </motion.div>
            </AnimatePresence>
            <span className="text-sm text-white/40 tracking-caps">
              {t("simulator.perMonth")}
            </span>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-xs tracking-caps text-white/50 mb-2">
                  {t("simulator.totalCost")}
                </p>
                <p className="font-serif text-2xl md:text-3xl text-white" data-testid="simulator-total-cost">
                  {fmt.format(totalCost)}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-caps text-white/50 mb-2">
                  {t("simulator.interest")}
                </p>
                <p className="font-serif text-2xl md:text-3xl text-[#D4AF37]" data-testid="simulator-total-interest">
                  {fmt.format(totalInterest)}
                </p>
              </div>
            </div>

            <a
              href="#demande"
              data-testid="simulator-apply-cta"
              className="btn-sweep block text-center mt-10 border border-white/20 text-white py-4 text-xs tracking-caps hover:border-[#D4AF37]"
            >
              {t("simulator.cta")}
            </a>

            <p className="text-[10px] text-white/30 mt-6 leading-relaxed">
              {t("simulator.disclaimer")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
