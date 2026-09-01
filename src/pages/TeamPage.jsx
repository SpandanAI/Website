import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import TeamMemberCard from "../components/TeamMemberCard";
import { leadershipMembers, teamGroupPhoto, teamMembers } from "../data/teamContent";
import { fadeInOnScroll, staggerContainer, viewportOnce } from "../lib/animations";

export default function TeamPage() {
  const headingRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Team | SpandanAI";
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main>
      <section className="team-intro relative isolate -mt-[var(--navbar-height)] pt-[var(--navbar-height)]" aria-labelledby="team-page-heading">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">Team</p>
          <h1
            id="team-page-heading"
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-white outline-none sm:text-5xl sm:leading-[1.15]"
          >
            Meet the Team
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.7] text-white/80 sm:text-lg">
            Leadership and team at SpandanAI.
          </p>
        </div>
      </section>

      <motion.section
        className="bg-surface py-20 sm:py-24"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(56, 189, 248, 0.06), rgba(56, 189, 248, 0.0))"
        }}
        variants={fadeInOnScroll}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Leadership"
            title="Founding engineering and product leadership."
            description="Core team responsible for silicon architecture, program execution, and company direction."
            align="center"
          />

          <motion.div
            className="mx-auto mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
          >
            {leadershipMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} imageLoading="eager" />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {teamMembers.length > 0 ? (
        <motion.section
          className="bg-white py-20 sm:py-24"
          variants={fadeInOnScroll}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Team" title="Team Members" align="center" />
            <motion.div
              className="mx-auto mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
            >
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} imageLoading="lazy" />
              ))}
            </motion.div>
          </div>
        </motion.section>
      ) : null}

      {teamGroupPhoto?.src ? (
        <section className="bg-surface py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
            <img
              src={teamGroupPhoto.src}
              alt={teamGroupPhoto.alt || ""}
              className="w-full rounded-3xl object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
