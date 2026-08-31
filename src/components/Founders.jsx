import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { fadeInOnScroll, staggerContainer, staggerItem, viewportOnce } from "../lib/animations";

const founders = [
  { name: "N.R. Rohan", role: "Chief Executive Officer", photo: "/images/N.R. Rohan.jpg" },
  { name: "K. Dharanidhar G", role: "Chief Technology Officer", photo: "/images/K. Dharanidhar G.jpg" },
  { name: "S. Aniruddhan", role: "Director", photo: "/images/S. Aniruddhan.jpg" },
  { name: "V. S. Chakravarthy", role: "Director", photo: "/images/V. S. Chakravarthy.jpg" }
];

export default function Founders() {
  return (
    <motion.section
      id="team"
      className="bg-surface py-20 sm:py-24"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(56, 189, 248, 0.06), rgba(56, 189, 248, 0.0))"
      }}
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Leadership Team"
          title="Founding engineering and product leadership."
          description="Core team responsible for silicon architecture, program execution, and company direction."
          align="center"
        />

        <motion.div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
          {founders.map((founder, index) => (
            <motion.article
              key={`${founder.role}-${index}`}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm"
              style={{
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              whileHover={{
                y: -4,
                boxShadow: "0 18px 40px rgba(0, 0, 0, 0.12)"
              }}
              variants={staggerItem}
            >
              {founder.photo ? (
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="mx-auto h-44 w-44 rounded-3xl object-cover"
                />
              ) : (
                <div className="mx-auto h-44 w-44 rounded-3xl bg-slate-200" aria-hidden="true" />
              )}
              <p className="mt-5 text-xl font-semibold text-ink">{founder.name}</p>
              <p className="mt-2 text-[15px] leading-6 font-medium text-muted">{founder.role}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
