import FastMarquee from "react-fast-marquee";
import { useLang } from "@/i18n/LanguageContext";

export default function Marquee() {
  const { t } = useLang();
  const items = t("marquee") || [];
  return (
    <section
      className="border-y border-white/10 bg-[#0A0A0A] py-8"
      data-testid="editorial-marquee"
    >
      <FastMarquee speed={30} gradient={false} pauseOnHover>
        {items.concat(items).map((tItem, i) => (
          <div key={i} className="flex items-center mx-12">
            <span className="font-serif italic text-3xl md:text-5xl text-white/80">
              {tItem}
            </span>
            <span className="ml-12 text-[#D4AF37] text-xl">✦</span>
          </div>
        ))}
      </FastMarquee>
    </section>
  );
}
