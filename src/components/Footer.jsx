import React from "react";
import { motion } from "framer-motion";
import { fadeInOnScroll, staggerContainer, staggerItem, viewportOnce } from "../lib/animations";

export default function Footer() {
  return (
    <motion.footer
      className="border-t border-slate-200 bg-surface"
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {/* Professional footer with key company contact details. */}
      <motion.div
        className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-6 lg:px-8"
        variants={staggerContainer}
      >
        <motion.img
          src="/images/logo-light.webp"
          alt="SpandanAI"
          className="logo mx-auto"
          loading="lazy"
          decoding="async"
          variants={staggerItem}
        />
        <motion.p className="mt-4 text-2xl font-bold tracking-tight text-ink" variants={staggerItem}>
          SpandanAI
        </motion.p>
        <motion.p className="mt-4 text-sm text-muted" variants={staggerItem}>
          © 2026 SpandanAI. All rights reserved.
        </motion.p>

        <motion.p
          className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600"
          variants={staggerItem}
        >
          Email
        </motion.p>
        <motion.a
          href="mailto:spandanai.sard@gmail.com"
          className="mt-2 inline-flex text-base text-muted transition-[color,transform] duration-200 ease-out hover:-translate-y-[2px] hover:text-blue-700"
          variants={staggerItem}
        >
          spandanai.sard@gmail.com
        </motion.a>
      </motion.div>
    </motion.footer>
  );
}
