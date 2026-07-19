import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

export default function Faq() {
  const { t } = useLang();
  const items = t("faq.items") || [];
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
              {t("faq.chip")}
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.05] tracking-tighter">
            {t("faq.title1")}{" "}
            <span className="italic text-[#D4AF37]">{t("faq.title2")}</span>
            {t("faq.title3")}
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
