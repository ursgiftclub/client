"use client";

import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-background">
      {/* Glow */}
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Gift Icon */}
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-border bg-card shadow-2xl"
        >
          <span className="text-5xl">🎁</span>
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.5,
          }}
          className="mb-6 text-3xl font-bold tracking-tight text-foreground"
        >
          URS Gift Club
        </motion.h1>

        {/* Progress */}
        <div className="h-1.5 w-44 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: "100%",
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="h-full rounded-full bg-primary"
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Curating premium gifts...
        </p>
      </div>
    </div>
  );
}
