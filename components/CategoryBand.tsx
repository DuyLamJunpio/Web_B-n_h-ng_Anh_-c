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
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#656159]">
            Mỗi nốt hương là một lát cắt ký ức, mở ra hành trình đánh thức giác quan qua từng nốt hương tự nhiên.
          </p>
        </div>

        {/* 6 Large Standalone Independent Stories */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-12">
          {stories.map((story, index) => (
            <Link
              key={story.slug}
              href={`/story/${story.slug}`}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d753d]"
            >
              {/* Large Image Frame */}
              <div className="relative aspect-[0.78/1] overflow-hidden rounded-2xl bg-[#ded8cb] shadow-sm transition-shadow duration-500 group-hover:shadow-md">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  priority={index < 3}
                />
                <span className="absolute left-4 top-4 inline-flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-xs font-semibold tracking-wider text-white border border-white/20">
                  0{index + 1}
                </span>
              </div>

              {/* Story Content Below Image */}
              <div className="pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9d753d]">
                  {story.product}
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-medium leading-tight tracking-[-0.03em] transition-colors group-hover:text-[#9d753d]">
                  {story.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#656159]">
                  {story.detail}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#9d753d] transition-transform duration-300 group-hover:translate-x-1">
                  <span>Khám phá</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
