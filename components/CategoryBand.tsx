import Image from "next/image";
import Link from "next/link";
import { stories } from "@/lib/storyData";

export default function CategoryBand() {
  return (
    <section id="stories" aria-label="Thư viện câu chuyện sản phẩm" className="scroll-mt-24 bg-[#f3f0e8] text-[#282724]">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 text-center lg:mb-16">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d753d]">Thư viện hương thơm</p>
          <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl">Một thư viện của những câu chuyện</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {stories.map((story, index) => (
            <Link key={story.slug} href={`/story/${story.slug}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d753d]">
              <div className="relative aspect-[0.78/1] overflow-hidden bg-[#ded8cb]">
                <Image src={story.image} alt={story.imageAlt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${index % 2 === 0 ? "object-[48%_center]" : "object-[62%_center]"}`} priority={index < 2} />
                <span className="absolute left-4 top-4 text-xs text-white/80">0{index + 1}</span>
              </div>
              <div className="pt-5">
                <h3 className="text-2xl font-medium leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-[#9d753d]">{story.title}</h3>
                <p className="mt-3 text-sm text-[#656159]">{story.product}</p>
                <p className="mt-1 text-sm text-[#656159]">{story.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
