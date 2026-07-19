import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#0A0A0A] pt-24 md:pt-32 pb-10"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
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
              Établissement de crédit européen, agréé sous la supervision de
              l'ACPR. Un accompagnement patrimonial, depuis 1998.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs tracking-caps text-white/40 mb-4">Offres</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Prêt personnel</li>
              <li>Prêt immobilier</li>
              <li>Crédit auto</li>
              <li>Prêt professionnel</li>
              <li>Rachat de crédit</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs tracking-caps text-white/40 mb-4">Cabinet</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Notre méthode</li>
              <li>Nos conseillers</li>
              <li>Actualités</li>
              <li>Presse</li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-xs tracking-caps text-white/40 mb-4">Contact</p>
            <p className="text-sm text-white/70">28, rue de la Banque</p>
            <p className="text-sm text-white/70">75002 Paris — France</p>
            <p className="text-sm text-white/70 mt-3">+33 (0)1 42 60 00 00</p>
            <p className="text-sm text-white/70">contact@eurokredit.fr</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs tracking-caps text-white/40">
          <p>© {new Date().getFullYear()} EuroKredit — Tous droits réservés</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Confidentialité
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
          <p>
            Un crédit vous engage et doit être remboursé.
          </p>
        </div>
      </div>
    </footer>
  );
}
