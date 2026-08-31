import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { applicationTabs } from "../data/siteContent";
import { fadeInOnScroll, staggerContainer, staggerItem, viewportOnce } from "../lib/animations";

export default function Applications() {
  return (
    <motion.section
      id="use-cases"
      className="bg-white py-20 sm:py-24"
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Use Cases"
          title="Deployment surfaces for analog-native AI silicon."
          description="Target environments where edge inference and wireless acceleration deliver measurable impact."
          align="center"
        />

        <motion.div
          className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
        >
          {applicationTabs.map((tab) => (
            <motion.article
              key={tab.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-[1.375rem]"
              variants={staggerItem}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">{tab.label}</p>
              <p className="mt-4 text-[15px] leading-7 text-muted">{tab.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
