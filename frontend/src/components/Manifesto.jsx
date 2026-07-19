import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageContext";

const numerals = ["I", "II", "III"];

export default function Manifesto() {
  const { t } = useLang();
  const chapters = t("manifesto.chapters") || [];
  return (
    <section
      id="methode"
      data-testid="manifesto-section"
      className="relative bg-[#0A0A0A] py-24 md:py-40 overflow-hidden"
    >
      <div
        className="absolute right-0 top-1/4 w-[45%] h-[60%] pointer-events-none opacity-30"
        aria-hidden="true"
      >
        <img
          src="https://images.pexels.com/photos/15713593/pexels-photo-15713593.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
          className="w-full h-full object-cover grayscale"
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0A0A]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-4 flex items-start gap-4">
            <span className="text-xs tracking-caps text-[#D4AF37] mt-2">02 —</span>
            <span className="text-xs tracking-caps text-white/60 mt-2">
              {t("manifesto.chip")}
            </span>
          </div>
          <h2 className="md:col-span-8 font-serif text-4xl md:text-6xl text-white leading-[1.02] tracking-tighter">
            {t("manifesto.title1")}{" "}
            <span className="italic text-[#D4AF37]">{t("manifesto.title2")}</span>{" "}
            {t("manifesto.title3")}
          </h2>
        </div>

        <div className="space-y-16 md:space-y-24 md:pl-[8%]">
          {chapters.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              data-testid={`manifesto-chapter-${i + 1}`}
              className="relative grid grid-cols-12 gap-6 md:gap-10 items-start border-t border-white/10 pt-10"
            >
              <div className="col-span-3 md:col-span-2">
                <span className="font-serif text-6xl md:text-8xl text-white/15 leading-none italic block">
                  {numerals[i]}
                </span>
              </div>
              <div className="col-span-9 md:col-span-6">
                <h3 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-4">
                  {c.title}
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md">
                  {c.body}
                </p>
              </div>
              <div className="hidden md:flex col-span-4 justify-end">
                <span className="text-xs tracking-caps text-white/30">
                  {t("manifesto.chapterLabel")} {String(i + 1).padStart(2, "0")} / 03
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
