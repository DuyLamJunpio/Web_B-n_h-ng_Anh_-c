import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryBand from "@/components/CategoryBand";
import FeaturedStoryVideo from "@/components/FeaturedStoryVideo";
import NaturalIngredients from "@/components/NaturalIngredients";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <HeroVideo />
        <FeaturedProducts />
        <CategoryBand />
        <FeaturedStoryVideo />
        <NaturalIngredients />
        <About />
      </main>
      <Footer />
    </>
  );
}
