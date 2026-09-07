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

        <div className="mt-8 flex justify-center">
          <Link
            to="/team"
            className="meet-the-team-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-blue-600 bg-blue-50/90 px-7 py-2.5 text-[0.95rem] font-semibold text-blue-700 no-underline shadow-sm transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:border-blue-700 hover:bg-blue-100 hover:text-blue-800 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:no-underline active:no-underline visited:no-underline"
          >
            Meet the Team
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <motion.div className="mx-auto mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
          {leadershipMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} imageLoading="lazy" />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
