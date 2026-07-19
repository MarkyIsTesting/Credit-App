import { motion } from "framer-motion";

const items = [
  {
    id: "personnel",
    title: "Prêt personnel",
    range: "3 000 € — 75 000 €",
    rate: "à partir de 4,90 %",
    duration: "12 à 84 mois",
    img: "https://images.unsplash.com/photo-1630705352366-a037e5cf9a4d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsaWZlc3R5bGUlMjBjb3VwbGV8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-5 md:row-span-2",
    aspect: "aspect-[4/5]",
  },
  {
    id: "immobilier",
    title: "Prêt immobilier",
    range: "jusqu'à 3 M€",
    rate: "à partir de 3,20 %",
    duration: "jusqu'à 30 ans",
    img: "https://images.pexels.com/photos/16810314/pexels-photo-16810314.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    span: "md:col-span-4",
    aspect: "aspect-[5/4]",
  },
  {
    id: "auto",
    title: "Crédit auto",
    range: "5 000 € — 150 000 €",
    rate: "à partir de 4,20 %",
    duration: "24 à 84 mois",
    img: "https://images.unsplash.com/photo-1760902419069-466f6f82c8b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBmaW5hbmNlJTIwYWJzdHJhY3QlMjBsdXh1cnl8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-3",
    aspect: "aspect-square",
  },
  {
    id: "professionnel",
    title: "Prêt professionnel",
    range: "20 000 € — 1,5 M€",
    rate: "à partir de 5,50 %",
    duration: "jusqu'à 15 ans",
    img: "https://images.pexels.com/photos/15713593/pexels-photo-15713593.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    span: "md:col-span-4",
    aspect: "aspect-[16/10]",
  },
  {
    id: "rachat",
    title: "Rachat de crédit",
    range: "regroupement dès 10 000 €",
    rate: "à partir de 4,50 %",
    duration: "12 à 240 mois",
    img: "https://images.unsplash.com/photo-1760902419069-466f6f82c8b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBmaW5hbmNlJTIwYWJzdHJhY3QlMjBsdXh1cnl8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-3",
    aspect: "aspect-[4/5]",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LoanTypes() {
  return (
    <section
      id="offres"
      data-testid="loan-types-section"
      className="relative bg-[#0A0A0A] py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-4 flex items-start gap-4">
            <span className="text-xs tracking-caps text-[#D4AF37] mt-2">
              01 —
            </span>
            <span className="text-xs tracking-caps text-white/60 mt-2">
              Nos offres
            </span>
          </div>
          <h2 className="md:col-span-8 font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.02] tracking-tighter">
            Cinq formes de crédit,{" "}
            <span className="italic text-[#D4AF37]">une seule exigence</span> —
            la vôtre.
          </h2>
        </div>

        {/* Tetris grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 auto-rows-auto">
          {items.map((it, i) => (
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
              <div
                className={`relative overflow-hidden ${it.aspect} bg-[#1B1B1F]`}
              >
                <img
                  src={it.img}
                  alt={it.title}
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
                    {it.title}
                  </h3>
                  <p className="text-xs tracking-caps text-white/50 mt-2">
                    {it.range}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs tracking-caps text-[#D4AF37]">
                    {it.rate}
                  </p>
                  <p className="text-xs text-white/40 mt-2">{it.duration}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
