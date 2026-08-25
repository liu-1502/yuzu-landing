import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Products } from "@/components/sections/Products";
import { Security } from "@/components/sections/Security";
import { Transparency } from "@/components/sections/Transparency";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.14em]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Partners />
        <Products />
        <Security />
        <Transparency />
        <Contact />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
