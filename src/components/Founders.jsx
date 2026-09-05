import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import TeamMemberCard from "./TeamMemberCard";
import { leadershipMembers } from "../data/teamContent";
import { fadeInOnScroll, staggerContainer, viewportOnce } from "../lib/animations";

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
          {leadershipMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} imageLoading="lazy" />
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
          >
            Meet the Team
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
