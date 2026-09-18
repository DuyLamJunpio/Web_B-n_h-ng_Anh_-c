"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const collections = [
  {
    id: 1,
    title: "Palo Santo & Xô Thơm (Thanh Tẩy)",
    desc: "Mùi hương từ gỗ thông, chanh và bạc hà hòa quyện, mang đến cảm giác thanh lọc không gian và tâm trí, bắt nguồn từ Nam Mỹ cổ đại.",
    img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=85&w=1200",
    align: "left",
  },
  {
    id: 2,
    title: "Nến Thơm Nghệ Thuật (Hơi Ấm)",
    desc: "Ánh sáng lung linh hắt bóng lên nền đá tối, lan tỏa hương thơm từ sáp tự nhiên và tinh dầu trị liệu, sưởi ấm những đêm tĩnh lặng.",
    img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=85&w=1200",
    align: "right",
  },
  {
    id: 3,
    title: "Vòng Tay Tây Tạng (Năng Lượng)",
    desc: "Chế tác từ gỗ tự nhiên với năng lượng nguyên thủy, mỗi hạt vòng là một lời nhắc nhở về sự bình an và tập trung trong từng hơi thở.",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1200",
    align: "left",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="w-full py-24 bg-linen-base">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl md:text-5xl font-light text-center mb-24 text-forest-950"
        >
          Những Vật Phẩm Chữa Lành
        </motion.h2>

        <div className="flex flex-col gap-32">
          {collections.map((item, i) => (
            <div 
              key={item.id} 
              className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${
                item.align === "right" ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg border border-forest-800/10"
                >
                  <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors duration-1000 z-10 pointer-events-none mix-blend-overlay blur-sm" />
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                  />
                </motion.div>
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: item.align === "left" ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-6 text-forest-950">
                    {item.title}
                  </h3>
                  <p className="font-sans text-forest-800/80 font-light leading-relaxed mb-8">
                    {item.desc}
                  </p>
                  <button className="uppercase text-xs tracking-widest border-b border-forest-700 text-forest-700 hover:text-forest-950 font-semibold pb-1 transition-colors cursor-pointer">
                    Khám phá thêm
                  </button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
