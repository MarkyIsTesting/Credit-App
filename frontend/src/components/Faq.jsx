import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const items = [
  {
    q: "Quels sont les critères d'éligibilité ?",
    a: "Nous étudions chaque dossier selon vos revenus, votre stabilité professionnelle et votre historique bancaire. Aucun profil type — nous privilégions l'analyse individuelle.",
  },
  {
    q: "Combien de temps pour obtenir une réponse ?",
    a: "Une pré-décision est communiquée sous 48 heures ouvrées après réception de votre dossier complet. Le décaissement intervient sous 7 à 10 jours.",
  },
  {
    q: "Puis-je regrouper mes crédits existants ?",
    a: "Oui. Notre offre de rachat de crédit permet de consolider plusieurs prêts en une seule mensualité, avec une durée et un taux ajustés à votre nouvelle capacité.",
  },
  {
    q: "Les taux annoncés sont-ils garantis ?",
    a: "Les taux affichés sont des taux d'appel indicatifs. Votre TAEG définitif dépend de votre profil, du montant, de la durée et des garanties apportées.",
  },
  {
    q: "Quels justificatifs sont demandés ?",
    a: "Pièce d'identité, justificatif de domicile, trois derniers bulletins de salaire ou bilans, et vos deux derniers relevés bancaires. Nous vous accompagnons dans la constitution du dossier.",
  },
  {
    q: "Le remboursement anticipé est-il possible ?",
    a: "Oui, partiellement ou totalement, avec des indemnités plafonnées par la réglementation européenne. Aucun frais caché.",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative bg-[#0A0A0A] py-24 md:py-40 border-t border-white/10"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 grid md:grid-cols-12 gap-10 md:gap-20">
        <div className="md:col-span-4">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-xs tracking-caps text-[#D4AF37]">05 —</span>
            <span className="text-xs tracking-caps text-white/60">
              Questions fréquentes
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05] tracking-tighter">
            Tout ce qu'il faut{" "}
            <span className="italic text-[#D4AF37]">savoir</span>, avant de
            signer.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="md:col-span-8"
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-testid={`faq-item-${i}`}
                className="border-b border-white/10 border-t-0"
              >
                <AccordionTrigger className="text-left font-serif text-xl md:text-2xl text-white hover:text-[#D4AF37] hover:no-underline py-8 tracking-tight">
                  <span className="flex items-baseline gap-6">
                    <span className="text-xs tracking-caps text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{it.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-base leading-relaxed pb-8 pl-16 max-w-2xl">
                  {it.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
