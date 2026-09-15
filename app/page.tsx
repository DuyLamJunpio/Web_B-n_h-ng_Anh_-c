import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import About from "@/components/About";
import CategoryBand from "@/components/CategoryBand";
import Collections from "@/components/Collections";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <HeroVideo />
        <CategoryBand />
        <Collections />
        <About />
      </main>
      <Footer />
    </>
  );
}
