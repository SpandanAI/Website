import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { applicationTabs } from "../data/siteContent";
import { fadeInOnScroll, staggerContainer, staggerItem, viewportOnce } from "../lib/animations";

const USE_CASE_CARD_PLACEMENT = [
  "md:col-span-2 lg:col-span-2",
  "md:col-span-2 lg:col-span-2",
  "md:col-span-2 lg:col-span-2",
  "md:col-span-2 lg:col-span-2 lg:col-start-2",
  "md:col-span-2 md:col-start-2 lg:col-span-2 lg:col-start-4"
];

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
          className="mx-auto mt-10 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-6"
          variants={staggerContainer}
        >
          {applicationTabs.map((tab, index) => (
            <motion.article
              key={tab.id}
              className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 px-5 py-[1.375rem] ${USE_CASE_CARD_PLACEMENT[index] ?? "md:col-span-2 lg:col-span-2"}`}
              variants={staggerItem}
            >
              <p className="text-xs font-semibold uppercase leading-[1.45] tracking-[0.14em] text-blue-600">
                {tab.label}
              </p>
              <p className="mt-4 text-base leading-[1.7] text-muted">{tab.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
