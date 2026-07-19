import { motion } from "framer-motion";

const list = [
  {
    quote:
      "Un accompagnement d'une élégance rare. En 72 heures, notre acquisition immobilière était bouclée — sans le moindre stress.",
    name: "Amélie Doré",
    role: "Directrice, Paris",
  },
  {
    quote:
      "EuroKredit a su comprendre la trajectoire de mon cabinet mieux que ma propre banque. Le prêt professionnel a changé notre développement.",
    name: "Julien Marchetti",
    role: "Architecte, Lyon",
  },
  {
    quote:
      "Discrétion, précision, réactivité. J'ai retrouvé ce qu'était un vrai conseil patrimonial.",
    name: "S. Van Broeck",
    role: "Investisseur, Bruxelles",
  },
];

export default function Testimonials() {
  return (
    <section
      id="avis"
      data-testid="testimonials-section"
      className="relative bg-[#0A0A0A] py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-4 flex items-start gap-4">
            <span className="text-xs tracking-caps text-[#D4AF37] mt-2">
              04 —
            </span>
            <span className="text-xs tracking-caps text-white/60 mt-2">
              Paroles de clients
            </span>
          </div>
          <h2 className="md:col-span-8 font-serif text-4xl md:text-6xl text-white leading-[1.02] tracking-tighter">
            La confiance,{" "}
            <span className="italic text-[#D4AF37]">notre premier taux</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {list.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              data-testid={`testimonial-${i}`}
              className={`border border-white/10 p-8 md:p-10 bg-[#1B1B1F]/40 backdrop-blur-sm flex flex-col justify-between ${
                i === 1 ? "md:translate-y-8" : ""
              }`}
            >
              <p className="font-serif italic text-xl md:text-2xl text-white leading-snug">
                “{t.quote}”
              </p>
              <footer className="mt-10 pt-6 border-t border-white/10">
                <p className="text-sm text-white">{t.name}</p>
                <p className="text-xs tracking-caps text-white/40 mt-1">
                  {t.role}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
