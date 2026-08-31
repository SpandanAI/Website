import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import {
  buttonHover,
  fadeInOnScroll,
  staggerContainer,
  staggerItem,
  viewportOnce
} from "../lib/animations";

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const organization = formData.get("organization")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";

    const subject = encodeURIComponent(
      organization ? `SpandanAI inquiry from ${name} (${organization})` : `SpandanAI inquiry from ${name}`
    );
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, organization ? `Organization: ${organization}` : "", "", message]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:spandanai.sard@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <motion.section
      id="contact"
      className="bg-white py-20 sm:py-24"
      variants={fadeInOnScroll}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {/* Contact section: accessible form layout with placeholder business details. */}
      <motion.div
        className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem}>
          <SectionHeading
            eyebrow="Contact"
            title="Engage with SpandanAI."
            description="Connect with the team for partnerships, technical collaboration, and program discussions."
          />
          <p className="mt-4 text-[15px] leading-6 font-medium text-muted">
            We typically respond within 1-2 business days.
          </p>

          <motion.div className="mt-10 space-y-5" variants={staggerContainer}>
            <motion.div
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]"
              variants={staggerItem}
            >
              <p className="text-sm font-semibold text-ink">Email</p>
              <a
                href="mailto:spandanai.sard@gmail.com"
                className="mt-2 inline-flex text-muted transition-colors duration-200 ease-out hover:text-blue-700"
              >
                spandanai.sard@gmail.com
              </a>
            </motion.div>
            <motion.div
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)]"
              variants={staggerItem}
            >
              <p className="text-sm font-semibold text-ink">Focus Areas</p>
              <p className="mt-2 text-[15px] leading-7 text-muted">
                Edge AI inference silicon
                <br />
                Analog wireless communication
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.form
          className="rounded-[2rem] border border-slate-200 bg-surface p-5 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
          variants={staggerItem}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-medium text-ink">
              Name
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="mt-6 block text-sm font-medium text-ink">
            Organization / Company
            <input
              type="text"
              name="organization"
              autoComplete="organization"
              placeholder="Your organization"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="mt-6 block text-sm font-medium text-ink">
            Message
            <textarea
              name="message"
              required
              rows="6"
              placeholder="Tell us about your partnership or investment interest"
              className="mt-2 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <motion.button
            type="submit"
            className="mt-6 w-full rounded-full bg-blue-600 px-7 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
            whileHover={shouldReduceMotion ? undefined : buttonHover}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            Contact Team
          </motion.button>

          <p className="mt-4 text-sm leading-6 text-muted">
            We respect your privacy. Your information will only be used to
            respond to your inquiry.
          </p>
        </motion.form>
      </motion.div>
    </motion.section>
  );
}
