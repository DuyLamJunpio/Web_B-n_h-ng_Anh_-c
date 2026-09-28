import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { stories } from "@/lib/storyData";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);

  if (!story) notFound();

  return (
    <>
      <Header />
      <main className="bg-[#f3f0e8] text-[#282724]">
        <section className="relative flex min-h-[75vh] sm:min-h-[82vh] items-end overflow-hidden bg-[#161513] text-white">
          <Image
            src={story.image}
            alt={story.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55 sm:opacity-60 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Dual multi-stop gradients for flawless contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e0d0c]/85 via-[#121110]/50 to-[#141311]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#9d753d]/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 pt-40 sm:px-8 sm:pb-20 sm:pt-48 lg:px-12 lg:pb-24 lg:pt-56 text-left flex flex-col items-start">
            <Link
              href="/#stories"
              className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium !text-white/80 transition-colors hover:!text-white"
            >
              <span>←</span>
              <span>Quay lại thư viện câu chuyện</span>
            </Link>

            <div className="mb-4 inline-flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#dfbe8c]">
                {story.route}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#dfbe8c]" />
              <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                Ghi chép hành trình
              </span>
            </div>

            <h1 className="max-w-[1000px] text-5xl font-medium leading-[0.96] tracking-[-0.04em] sm:text-7xl lg:text-[clamp(4.5rem,10vw,9.5rem)] !text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)]">
              {story.title}
            </h1>

            <p className="mt-6 max-w-[620px] text-lg sm:text-2xl leading-relaxed !text-white/90 font-light drop-shadow-sm">
              {story.product}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1300px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:py-32 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-xs uppercase tracking-[0.18em] text-[#9d753d]">Câu chuyện 0{stories.indexOf(story) + 1} / 0{stories.length}</p>
            <h2 className="mt-6 text-4xl font-medium leading-[1] tracking-[-0.04em] sm:text-5xl">{story.detail}</h2>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <p className="max-w-[680px] text-2xl leading-[1.15] tracking-[-0.02em] sm:text-3xl">{story.description}</p>
            <p className="mt-10 max-w-[600px] text-base leading-relaxed text-[#656159]">RUNGU tìm về những nguyên liệu có ký ức riêng, để mỗi lần thắp lên hay chạm vào, bạn có thể bước vào một vùng không gian khác — chậm hơn, sâu hơn và rất riêng.</p>
            <div className="mt-10 max-w-[650px] border-t border-[#282724]/15 pt-6 w-full">
              <p className="text-xs uppercase tracking-[0.16em] text-[#9d753d]">Thông tin thực vật học</p>
              <p className="mt-3 text-sm leading-relaxed text-[#656159]">{story.fact}</p>
              <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs underline decoration-[#9d753d] underline-offset-4 transition-colors hover:text-[#9d753d]">Tham khảo: {story.sourceLabel} ↗</a>
            </div>
          </div>
        </section>

        <section className="border-y border-[#282724]/15 bg-[#ebe7dd] px-5 py-16 sm:px-8 lg:px-12 lg:py-24 text-center sm:text-left">
          <div className="mx-auto max-w-[1300px]">
            <div className="mb-12 max-w-[560px] mx-auto sm:mx-0">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9d753d]">Theo dấu nguyên liệu</p>
              <h2 className="mt-5 text-4xl font-medium leading-[1] tracking-[-0.04em] sm:text-5xl">Một câu chuyện được mở ra theo từng lớp</h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-16">
              {story.chapters.map((chapter) => (
                <article key={chapter.label} className="border-t border-[#282724]/25 pt-5 text-center sm:text-left">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#9d753d]">{chapter.label}</p>
                  <h3 className="mt-7 text-2xl font-medium leading-[1.05] tracking-[-0.03em]">{chapter.title}</h3>
                  <p className="mt-5 text-sm leading-[1.7] text-[#656159]">{chapter.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 px-5 pb-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:pb-32">
          <div className="relative min-h-[440px] overflow-hidden bg-[#ded8cb] sm:min-h-[620px]">
            <Image src={story.image} alt="Chi tiết không gian và nguyên liệu" fill sizes="(min-width: 1024px) 57vw, 100vw" className="object-cover object-[35%_center] transition-transform duration-700 hover:scale-[1.02]" />
          </div>
          <div className="relative min-h-[440px] overflow-hidden bg-[#ded8cb] sm:min-h-[620px]">
            <Image src={story.image} alt="Không gian kể chuyện của RUNGU" fill sizes="(min-width: 1024px) 43vw, 100vw" className="object-cover object-[75%_center] transition-transform duration-700 hover:scale-[1.02]" />
          </div>
        </section>

        <section className="border-t border-[#282724]/15 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 text-center sm:text-left">
          <div className="mx-auto flex max-w-[1600px] flex-col justify-between items-center sm:items-end gap-8 sm:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#9d753d]">Tiếp tục khám phá</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em]">Những lối đi khác</h2>
            </div>
            <Link href="/san-pham" className="text-sm underline decoration-[#9d753d] underline-offset-8 transition-colors hover:text-[#9d753d]">Xem toàn bộ vật phẩm tại /san-pham →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
