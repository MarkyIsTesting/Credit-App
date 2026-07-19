import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const line1 = ["Le", "capital", "qui"];
const line2 = ["s'inscrit", "dans", "votre"];
const line3 = ["histoire."];

const parent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const child = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] pt-32 pb-16"
    >
      {/* Background image parallax */}
      <motion.div
        style={{ y: yImage, scale }}
        className="absolute right-0 top-24 md:top-16 h-[70%] w-[55%] md:w-[42%] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1779878603885-f211807da45e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBmaW5hbmNlJTIwYWJzdHJhY3QlMjBsdXh1cnl8ZW58MHx8fHwxNzg0NDkxNjc5fDA&ixlib=rb-4.1.0&q=85"
          alt=""
          className="w-full h-full object-cover object-center opacity-70 grayscale-[0.1]"
          style={{
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0A0A0A]" />
      </motion.div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 h-full flex flex-col justify-center min-h-[80vh]">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center gap-4 mb-10 md:mb-14"
          data-testid="hero-eyebrow"
        >
          <span className="h-px w-16 bg-white/30" />
          <span className="text-xs tracking-caps text-white/60">
            Établissement de crédit européen · Depuis 1998
          </span>
        </motion.div>

        {/* Kinetic headline */}
        <motion.h1
          variants={parent}
          initial="hidden"
          animate="visible"
          style={{ opacity }}
          data-testid="hero-headline"
          className="font-serif text-white tracking-tighter leading-[0.95] text-[14vw] md:text-[10vw] lg:text-[9vw] max-w-[95%]"
        >
          <span className="block">
            {line1.map((w, i) => (
              <span key={i} className="mask-word mr-[0.15em]">
                <motion.span variants={child}>{w}</motion.span>
              </span>
            ))}
          </span>
          <span className="block italic text-[#D4AF37]/90">
            {line2.map((w, i) => (
              <span key={i} className="mask-word mr-[0.15em]">
                <motion.span variants={child}>{w}</motion.span>
              </span>
            ))}
          </span>
          <span className="block">
            {line3.map((w, i) => (
              <span key={i} className="mask-word mr-[0.15em]">
                <motion.span variants={child}>{w}</motion.span>
              </span>
            ))}
          </span>
        </motion.h1>

        {/* Sub / CTA row */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            data-testid="hero-subtext"
            className="md:col-span-5 text-white/60 text-base md:text-lg leading-relaxed max-w-md"
          >
            Un accompagnement patrimonial d'exception. Nous finançons vos
            ambitions — personnelles, immobilières, professionnelles — avec la
            discrétion d'un cabinet privé.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25 }}
            className="md:col-span-4 md:col-start-9 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#simulateur"
              data-testid="hero-cta-simulate"
              className="btn-sweep flex-1 border border-[#D4AF37] text-[#D4AF37] px-6 py-4 text-xs tracking-caps text-center transition-colors duration-300"
            >
              Simuler mon prêt
            </a>
            <a
              href="#offres"
              data-testid="hero-cta-explore"
              className="flex-1 text-xs tracking-caps text-white/70 hover:text-white flex items-center justify-center gap-3 group"
            >
              <span>Explorer les offres</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>
        </div>

        {/* Bottom stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="mt-24 md:mt-32 grid grid-cols-3 border-t border-white/10 pt-8"
          data-testid="hero-stats"
        >
          {[
            { k: "27", label: "Années d'expertise" },
            { k: "1,2 Md€", label: "Financés en 2025" },
            { k: "48 h", label: "Décision moyenne" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-serif text-3xl md:text-5xl text-white">
                {s.k}
              </span>
              <span className="text-xs tracking-caps text-white/50">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
