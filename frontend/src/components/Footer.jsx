import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const offers = ["personnel", "immobilier", "auto", "professionnel", "rachat"];
  const cabinetLinks = t("footer.cabinetLinks") || [];
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#0A0A0A] pt-24 md:pt-32 pb-10"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex justify-center md:justify-start mb-16"
        >
          <img
            src="/brand/eurokredit-logo.jpg"
            alt="EuroKredit"
            data-testid="footer-logo"
            className="h-20 md:h-28 w-auto object-contain"
          />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif tracking-tighter text-white leading-[0.85] text-[16vw] md:text-[13vw] italic"
        >
          EuroKredit.
        </motion.h3>

        <div className="mt-16 md:mt-20 grid md:grid-cols-12 gap-10 border-t border-white/10 pt-12">
          <div className="md:col-span-4">
            <p className="text-white/60 leading-relaxed max-w-xs">
              {t("footer.about")}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs tracking-caps text-white/40 mb-4">
              {t("footer.offers")}
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {offers.map((id) => (
                <li key={id}>{t(`loanLabels.${id}`)}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs tracking-caps text-white/40 mb-4">
              {t("footer.cabinet")}
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {cabinetLinks.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-xs tracking-caps text-white/40 mb-4">
              {t("footer.contact")}
            </p>
            <p className="text-sm text-white/70">28, rue de la Banque</p>
            <p className="text-sm text-white/70">75002 Paris — France</p>
            <p className="text-sm text-white/70 mt-3">+33 (0)1 42 60 00 00</p>
            <p className="text-sm text-white/70">contact@eurokredit.fr</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs tracking-caps text-white/40">
          <p>© {new Date().getFullYear()} EuroKredit — {t("footer.rights")}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.legal")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.cookies")}
            </a>
          </div>
          <p>{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
