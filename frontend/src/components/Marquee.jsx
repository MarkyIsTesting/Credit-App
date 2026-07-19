import FastMarquee from "react-fast-marquee";

const items = [
  "Prêt personnel",
  "Financement immobilier",
  "Crédit auto",
  "Rachat de crédit",
  "Prêt professionnel",
  "Investissement patrimonial",
  "Conseil sur-mesure",
];

export default function Marquee() {
  return (
    <section
      className="border-y border-white/10 bg-[#0A0A0A] py-8"
      data-testid="editorial-marquee"
    >
      <FastMarquee speed={30} gradient={false} pauseOnHover>
        {items.concat(items).map((t, i) => (
          <div key={i} className="flex items-center mx-12">
            <span className="font-serif italic text-3xl md:text-5xl text-white/80">
              {t}
            </span>
            <span className="ml-12 text-[#D4AF37] text-xl">✦</span>
          </div>
        ))}
      </FastMarquee>
    </section>
  );
}
