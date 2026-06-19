"use client";

import { motion } from "framer-motion";
import { testimonials, whyChooseUs } from "@/data/content";

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/5 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* ==========================
            WHY CHOOSE US
        ========================== */}
        <motion.div
          className="mb-24"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
        >
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-accent">
              Why Customers Love Us
            </span>

            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Why Choose URS Gift Club
            </h2>

            <p className="text-lg text-muted-foreground">
              We make gifting meaningful with premium curated products, trusted
              quality, and unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-2xl"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{
                  once: true,
                }}
              >
                {/* Glow */}
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/10 blur-3xl transition duration-500 group-hover:scale-125" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-3xl">
                    ✨
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <p className="leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ==========================
            TESTIMONIALS
        ========================== */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
        >
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Customer Reviews
            </span>

            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              What Our Customers Say
            </h2>

            <p className="text-lg text-muted-foreground">
              Thousands of happy customers trust URS Gift Club for unforgettable
              gifting experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm transition duration-300 hover:border-accent/30 hover:shadow-2xl"
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -30 : 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{
                  once: true,
                }}
              >
                {/* Quote Background */}
                <div className="absolute right-6 top-4 text-[6rem] font-serif text-accent/10">
                  "
                </div>

                {/* Header */}
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-white shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {Array.from({
                    length: testimonial.rating,
                  }).map((_, i) => (
                    <span key={i} className="text-lg text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>

                {/* Review */}
                <p className="relative z-10 text-lg leading-8 text-foreground/90">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
