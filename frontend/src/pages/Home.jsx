import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import LoanTypes from "@/components/LoanTypes";
import Manifesto from "@/components/Manifesto";
import Simulator from "@/components/Simulator";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import Faq from "@/components/Faq";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main data-testid="home-page" className="relative bg-[#0A0A0A] text-[#FAFAFA]">
      <Nav />
      <Hero />
      <Marquee />
      <LoanTypes />
      <Manifesto />
      <Simulator />
      <Testimonials />
      <Partners />
      <Faq />
      <ContactForm />
      <Footer />
    </main>
  );
}
