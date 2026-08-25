import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Products } from "@/components/sections/Products";
import { Security } from "@/components/sections/Security";
import { Transparency } from "@/components/sections/Transparency";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";

export default function Landing() {
  return (
    <>
      <Hero />
      <Partners />
      <Products />
      <Security />
      <Transparency />
      <Contact />
      <Faq />
    </>
  );
}
