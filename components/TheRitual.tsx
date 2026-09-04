"use client";

import { motion } from "framer-motion";
import { Flame, Wind, Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Tĩnh Tâm",
    icon: Flame,
    desc: "Lắng đọng nhịp thở.",
  },
  {
    id: 2,
    title: "Khơi Lửa",
    icon: Wind,
    desc: "Đánh thức hương thơm.",
  },
  {
    id: 3,
    title: "Tận Hưởng",
    icon: Sparkles,
    desc: "Không gian chữa lành.",
  },
];

export default function TheRitual() {
  return (
    <section className="w-full py-32 bg-oak/10 border-t border-b border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-6">
            Nghệ Thuật Trải Nghiệm
          </h2>
          <p className="font-sans text-text-dim max-w-xl mx-auto font-light italic">
            "Để làn khói len lỏi vào từng góc khuất, cuốn đi những muộn phiền..."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full border border-white/10 mb-8 text-amber/70 group-hover:text-amber group-hover:border-amber/50 transition-colors duration-500">
                <step.icon strokeWidth={1} className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-light text-white/90 mb-4">
                Bước {step.id}: {step.title}
              </h3>
              <p className="font-sans text-text-dim text-sm font-light">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
