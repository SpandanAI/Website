import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerItem } from "../lib/animations";

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) {
    return parts[0].replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  }

  const first = parts[0].replace(/[^A-Za-z]/g, "").charAt(0);
  const last = parts[parts.length - 1].replace(/[^A-Za-z]/g, "").charAt(0);
  return `${first}${last}`.toUpperCase();
}

export default function TeamMemberCard({ member, imageLoading = "eager" }) {
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(member.image) && !imageFailed;
  const initials = getInitials(member.name);
  const hoverTransition = { type: "tween", duration: 0.15, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.article
      className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm"
      style={{
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)"
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
              boxShadow: "0 18px 40px rgba(0, 0, 0, 0.12)",
              transition: hoverTransition
            }
      }
      transition={shouldReduceMotion ? { duration: 0 } : hoverTransition}
      variants={staggerItem}
    >
      {showImage ? (
        <img
          src={member.image}
          alt={member.name}
          width={176}
          height={176}
          className="mx-auto h-44 w-44 rounded-3xl object-cover"
          loading={imageLoading}
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="team-member-fallback mx-auto flex h-44 w-44 items-center justify-center rounded-3xl"
          aria-hidden="true"
        >
          <span className="text-2xl font-semibold tracking-[0.08em]">{initials}</span>
        </div>
      )}
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em] text-ink">{member.name}</h3>
      <p className="mt-2 text-[15px] font-medium leading-[1.6] text-muted">{member.role}</p>
    </motion.article>
  );
}
