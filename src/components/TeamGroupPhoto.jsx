import React, { useState } from "react";
import { teamGroupPhoto } from "../data/teamContent";

const TEAM_PHOTO_PRESENT =
  Object.keys(import.meta.glob("../../public/images/team/team-photo.webp")).length > 0;

export default function TeamGroupPhoto() {
  const [imageFailed, setImageFailed] = useState(false);
  const src = TEAM_PHOTO_PRESENT && !imageFailed ? teamGroupPhoto?.src : null;
  const alt = teamGroupPhoto?.alt || "SpandanAI team";
  const showImage = Boolean(src);

  return (
    <figure className="mx-auto w-full max-w-[72rem]">
      <div
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
        style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)" }}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="block h-auto w-full"
            loading="eager"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="team-photo-slot flex aspect-video w-full items-center justify-center"
            role="img"
            aria-label="Team photo"
          >
            <span className="text-sm font-semibold tracking-[0.04em] text-blue-700/80 sm:text-base">
              Team photo
            </span>
          </div>
        )}
      </div>
    </figure>
  );
}
