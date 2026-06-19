"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/categories");

      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };
  const featured = categories.slice(0, 6);

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{
            opacity: 0,
            y: -20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
        >
          <span className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-accent">
            Curated Collections
          </span>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Browse by Category
          </h2>

          <p className="text-lg text-muted-foreground">
            Explore carefully curated gift collections designed for every
            occasion and every special person in your life.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
        >
          {featured.map((category) => (
            <motion.div
              key={category._id}
              variants={itemVariants}
              whileHover={{
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
              className="group"
            >
              <Link href={`/shop?category=${category.slug}`} className="block">
                <div className="relative h-80 overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm transition-all duration-500 hover:border-accent/40 hover:shadow-2xl">
                  {/* Luxury Background */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/10" />

                  {/* Decorative Glow */}
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-accent/10 blur-3xl transition duration-500 group-hover:scale-125" />

                  <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl transition duration-500 group-hover:scale-125" />

                  {/* Huge Gift Icon */}
                  {/* Category Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="h-full w-full object-cover opacity-[0.22] transition duration-700 group-hover:scale-110 group-hover:opacity-[0.35]"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-7">
                    {/* Top Badge */}
                    <div>
                      <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-sm">
                        {category.name}
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="translate-y-4 transition duration-500 group-hover:translate-y-0">
                      <h3 className="mb-3 text-2xl font-bold text-foreground transition duration-300 group-hover:text-white">
                        {category.name}
                      </h3>

                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground transition duration-300 group-hover:text-white/90">
                        {category.description}
                      </p>

                      <div className="mt-6 flex items-center gap-2 font-medium text-accent transition duration-300 group-hover:text-white">
                        Explore Category
                        <span className="transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-[2rem] ring-1 ring-transparent transition duration-500 group-hover:ring-accent/20" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-14 flex justify-center"
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
            delay: 0.2,
          }}
          viewport={{
            once: true,
          }}
        >
          <Link
            href="/categories"
            className="rounded-2xl border border-border bg-card px-8 py-4 font-semibold text-foreground shadow-sm transition duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-xl"
          >
            View All Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
