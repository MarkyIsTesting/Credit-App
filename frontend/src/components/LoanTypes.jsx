import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

const layout = [
  { id: "personnel", img: "https://images.unsplash.com/photo-1630705352366-a037e5cf9a4d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsaWZlc3R5bGUlMjBjb3VwbGV8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85", span: "md:col-span-5 md:row-span-2", aspect: "aspect-[4/5]" },
  { id: "immobilier", img: "https://images.pexels.com/photos/16810314/pexels-photo-16810314.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", span: "md:col-span-4", aspect: "aspect-[5/4]" },
  { id: "auto", img: "https://images.unsplash.com/photo-1760902419069-466f6f82c8b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBmaW5hbmNlJTIwYWJzdHJhY3QlMjBsdXh1cnl8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85", span: "md:col-span-3", aspect: "aspect-square" },
  { id: "professionnel", img: "https://images.pexels.com/photos/15713593/pexels-photo-15713593.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", span: "md:col-span-4", aspect: "aspect-[16/10]" },
  { id: "rachat", img: "https://images.unsplash.com/photo-1760902419069-466f6f82c8b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBmaW5hbmNlJTIwYWJzdHJhY3QlMjBsdXh1cnl8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85", span: "md:col-span-3", aspect: "aspect-[4/5]" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export default function LoanTypes() {
  const { t } = useLang();
  return (
    <section
      id="offres"
      data-testid="loan-types-section"
      className="relative bg-[#0A0A0A] py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-4 flex items-start gap-4">
            <span className="text-xs tracking-caps text-[#D4AF37] mt-2">01 —</span>
            <span className="text-xs tracking-caps text-white/60 mt-2">
              {t("loans.chip")}
            </span>
          </div>
          <h2 className="md:col-span-8 font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.02] tracking-tighter">
            {t("loans.title1")}{" "}
            <span className="italic text-[#D4AF37]">{t("loans.title2")}</span>{" "}
            {t("loans.title3")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 auto-rows-auto">
          {layout.map((it, i) => {
            const item = t(`loans.items.${it.id}`) || {};
            return (
              <motion.article
                key={it.id}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                data-testid={`loan-card-${it.id}`}
                className={`group relative ${it.span} border-t border-white/10 pt-6`}
              >
                <div className={`relative overflow-hidden ${it.aspect} bg-[#1B1B1F]`}>
                  <img
                    src={it.img}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 grayscale-[0.15]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[10px] tracking-caps text-white/80 bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs tracking-caps text-white/50 mt-2">
                      {item.range}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs tracking-caps text-[#D4AF37]">
                      {item.rate}
                    </p>
                    <p className="text-xs text-white/40 mt-2">{item.duration}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
