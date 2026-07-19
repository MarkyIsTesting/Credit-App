import { motion } from "framer-motion";
import FastMarquee from "react-fast-marquee";

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

const shortReviews = [
  { quote: "Service impeccable, taux imbattable.", name: "Camille R.", stars: 5 },
  { quote: "Décision en 24h, très professionnels.", name: "Malik B.", stars: 5 },
  { quote: "Enfin une banque qui écoute vraiment.", name: "Sophie L.", stars: 5 },
  { quote: "Prêt immobilier signé en une semaine, chapeau.", name: "Thomas D.", stars: 5 },
  { quote: "Conseillère au top, dossier réglé sans stress.", name: "Nadia F.", stars: 5 },
  { quote: "Rachat de crédit qui m'a sauvé la vie.", name: "Éric M.", stars: 5 },
  { quote: "Zéro frais cachés, tout est transparent.", name: "Léa P.", stars: 5 },
  { quote: "Un vrai partenaire pour mon entreprise.", name: "Karim S.", stars: 5 },
  { quote: "Rapide, humain, efficace. Je recommande.", name: "Chloé V.", stars: 5 },
  { quote: "Meilleure expérience de crédit que j'aie vécue.", name: "Antoine G.", stars: 5 },
  { quote: "Réponse claire, contrat lisible, décaissement rapide.", name: "Fatima K.", stars: 5 },
  { quote: "Le conseil patrimonial dont je rêvais.", name: "Guillaume T.", stars: 5 },
];

const Stars = ({ n = 5 }) => (
  <div className="flex gap-1" aria-label={`${n} étoiles sur 5`}>
    {Array.from({ length: n }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className="w-3 h-3 fill-[#D4AF37]"
        aria-hidden="true"
      >
        <path d="M10 1.5l2.7 5.47 6.03.88-4.36 4.25 1.03 6L10 15.27 4.6 18.1l1.03-6L1.27 7.85l6.03-.88L10 1.5z" />
      </svg>
    ))}
  </div>
);

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
          <div className="md:col-span-8 flex flex-col gap-6">
            <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.02] tracking-tighter">
              La confiance,{" "}
              <span className="italic text-[#D4AF37]">notre premier taux</span>.
            </h2>
            <div className="flex items-center gap-4">
              <Stars n={5} />
              <span className="text-xs tracking-caps text-white/60">
                4,9 / 5 · 2 847 avis vérifiés
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10 mb-16 md:mb-24">
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
              <div>
                <Stars n={5} />
                <p className="font-serif italic text-xl md:text-2xl text-white leading-snug mt-6">
                  “{t.quote}”
                </p>
              </div>
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

      {/* Scrolling reviews marquee */}
      <div
        data-testid="reviews-marquee"
        className="relative border-y border-white/10 bg-[#0A0A0A]/70 py-6"
      >
        <FastMarquee speed={40} gradient={false} pauseOnHover>
          {shortReviews.concat(shortReviews).map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-5 mx-8 border border-white/10 bg-[#1B1B1F]/60 backdrop-blur-sm px-6 py-4 min-w-[380px] max-w-[460px]"
              data-testid={`review-marquee-item-${i}`}
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif text-lg">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <Stars n={r.stars} />
                <p className="text-sm text-white/85 mt-1.5 truncate">
                  “{r.quote}”
                </p>
                <p className="text-[10px] tracking-caps text-white/40 mt-1">
                  {r.name}
                </p>
              </div>
            </div>
          ))}
        </FastMarquee>
      </div>

      <div className="relative border-b border-white/10 bg-[#0A0A0A]/70 py-6">
        <FastMarquee speed={30} gradient={false} direction="right" pauseOnHover>
          {[...shortReviews].reverse().concat([...shortReviews].reverse()).map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-5 mx-8 border border-white/10 bg-[#1B1B1F]/60 backdrop-blur-sm px-6 py-4 min-w-[380px] max-w-[460px]"
              data-testid={`review-marquee-alt-${i}`}
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif text-lg">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <Stars n={r.stars} />
                <p className="text-sm text-white/85 mt-1.5 truncate">
                  “{r.quote}”
                </p>
                <p className="text-[10px] tracking-caps text-white/40 mt-1">
                  {r.name}
                </p>
              </div>
            </div>
          ))}
        </FastMarquee>
      </div>
    </section>
  );
}
