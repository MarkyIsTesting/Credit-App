import { motion } from "framer-motion";
import FastMarquee from "react-fast-marquee";
import { useLang } from "@/i18n/LanguageContext";
import { ShieldCheck, Landmark, Scale, Lock, Award, BadgeCheck } from "lucide-react";

const iconMap = {
  ShieldCheck,
  Landmark,
  Scale,
  Lock,
  Award,
  BadgeCheck,
};

// Real European regulatory / trust badges — no fake logos
const CERTIFICATIONS = [
  { key: "acpr", icon: "Landmark" },
  { key: "orias", icon: "Scale" },
  { key: "fgdr", icon: "ShieldCheck" },
  { key: "rgpd", icon: "Lock" },
  { key: "iso", icon: "Award" },
  { key: "afub", icon: "BadgeCheck" },
];

const NETWORK = [
  "Banque de France",
  "Federation Bancaire Européenne",
  "SWIFT · Réseau interbancaire",
  "SEPA · Zone unique de paiement",
  "Crédit Logement · Garantie",
  "Chambre des courtiers en crédit",
  "Notaires de France · Signature électronique",
];

export default function Partners() {
  const { t } = useLang();
  const certs = t("partners.certs") || {};
  return (
    <section
      id="partenaires"
      data-testid="partners-section"
      className="relative bg-[#0A0A0A] py-24 md:py-40 border-t border-white/10"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-4 flex items-start gap-4">
            <span className="text-xs tracking-caps text-[#D4AF37] mt-2">07 —</span>
            <span className="text-xs tracking-caps text-white/60 mt-2">
              {t("partners.chip")}
            </span>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.02] tracking-tighter">
              {t("partners.title1")}{" "}
              <span className="italic text-[#D4AF37]">{t("partners.title2")}</span>{" "}
              {t("partners.title3")}
            </h2>
            <p className="text-white/50 mt-6 max-w-xl leading-relaxed">
              {t("partners.subtitle")}
            </p>
          </div>
        </div>

        {/* Certifications grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {CERTIFICATIONS.map((c, i) => {
            const Icon = iconMap[c.icon] || ShieldCheck;
            const meta = certs[c.key] || {};
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                data-testid={`cert-${c.key}`}
                className="group relative border border-white/10 bg-[#1B1B1F]/40 backdrop-blur-sm p-6 md:p-8 hover:border-[#D4AF37]/40 transition-colors"
              >
                <Icon className="w-6 h-6 text-[#D4AF37] mb-6 stroke-[1.2]" />
                <p className="font-serif text-xl md:text-2xl text-white tracking-tighter leading-tight">
                  {meta.name || c.key.toUpperCase()}
                </p>
                <p className="text-[10px] tracking-caps text-white/40 mt-2">
                  {meta.type}
                </p>
                <p className="text-xs text-white/50 mt-4 leading-relaxed">
                  {meta.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-white/10 pt-12"
          data-testid="partners-stats"
        >
          {[
            { k: "€ 1,2 Md", l: t("partners.stat1") },
            { k: "€ 100 000", l: t("partners.stat2") },
            { k: "27 ans", l: t("partners.stat3") },
            { k: "SOC 2", l: t("partners.stat4") },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-serif text-3xl md:text-4xl text-white tracking-tighter">
                {s.k}
              </span>
              <span className="text-xs tracking-caps text-white/50 leading-relaxed">
                {s.l}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Banking network marquee */}
      <div className="mt-16 md:mt-24 border-y border-white/10 bg-[#0A0A0A]/70 py-6" data-testid="network-marquee">
        <FastMarquee speed={25} gradient={false} pauseOnHover>
          {NETWORK.concat(NETWORK).map((n, i) => (
            <div key={i} className="flex items-center mx-8" data-testid={`network-item-${i}`}>
              <span className="font-serif italic text-xl md:text-2xl text-white/60">
                {n}
              </span>
              <span className="ml-8 text-[#D4AF37]">◆</span>
            </div>
          ))}
        </FastMarquee>
      </div>
    </section>
  );
}
