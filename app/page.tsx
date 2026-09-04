import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import SmokeScrollShowcase from "@/components/SmokeScrollShowcase";
import ZenSanctuary3D from "@/components/ZenSanctuary3D";
import About from "@/components/About";
import Collections from "@/components/Collections";
import Quiz from "@/components/Quiz";
import Ritual from "@/components/Ritual";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SoundAmbience from "@/components/SoundAmbience";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        {/* Cinematic Video Hero Section */}
        <HeroVideo />
        
        {/* 3D Scrollytelling Smoke-to-Product Showcase */}
        <SmokeScrollShowcase />
        <ZenSanctuary3D />
        <About />
        <Collections />
        <Quiz />
        <Ritual />
        <Testimonials />
      </main>
      <Footer />
      <SoundAmbience />
    </>
  );
}
