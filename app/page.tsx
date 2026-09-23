import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import CategoryBand from "@/components/CategoryBand";
import FeaturedStoryVideo from "@/components/FeaturedStoryVideo";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <HeroVideo />
        <CategoryBand />
        <FeaturedStoryVideo />
        <About />
      </main>
      <Footer />
    </>
  );
}
