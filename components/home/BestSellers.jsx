"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { products } from "@/data/categories";
import ProductCard from "@/components/product/ProductCard";

export default function BestSellers() {
  const bestSellers = products.slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-secondary/40 py-20 md:py-28">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
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
          <div className="max-w-2xl">
            {/* Badge */}
            <span className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-accent">
              Most Loved Gifts
            </span>

            {/* Heading */}
            <h2 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Best Sellers
            </h2>

            <p className="text-lg text-muted-foreground">
              Explore our most loved, best-rated, and frequently purchased gifts
              curated for every special occasion.
            </p>
          </div>

          {/* Desktop CTA */}
          <Link
            href="/shop"
            className="hidden items-center gap-2 rounded-2xl border border-accent bg-card px-7 py-4 font-semibold text-accent shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-xl md:inline-flex"
          >
            View All Products
            <FiArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 30,
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
              whileHover={{
                y: -8,
              }}
            >
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[2rem] bg-accent/5 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                {/* Card */}
                <div className="relative">
                  <ProductCard product={product} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          className="mt-10 md:hidden"
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
          }}
          viewport={{
            once: true,
          }}
        >
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-2xl border border-accent bg-card px-6 py-4 text-center font-semibold text-accent shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          >
            View All Products
            <FiArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
