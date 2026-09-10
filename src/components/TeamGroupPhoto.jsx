import React, { useState } from "react";
import { teamGroupPhoto } from "../data/teamContent";

const TEAM_PHOTO_PRESENT = {
  "/images/team/team-photo.webp":
    Object.keys(import.meta.glob("../../public/images/team/team-photo.webp")).length > 0,
  "/images/team/team-photo-2.webp":
    Object.keys(import.meta.glob("../../public/images/team/team-photo-2.webp")).length > 0
};

export default function TeamGroupPhoto({
  photo = teamGroupPhoto,
  frameClassName = "mx-auto w-full max-w-[72rem]",
  loading = "eager",
  fetchPriority
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = TEAM_PHOTO_PRESENT[photo?.src] && !imageFailed ? photo.src : null;
  const alt = photo?.alt || "SpandanAI team";
  const showImage = Boolean(src);

  return (
    <figure className={frameClassName}>
      <div
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white sm:rounded-3xl"
        style={{ boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)" }}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            width={photo.width}
            height={photo.height}
            className="block h-auto w-full max-w-full"
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="team-photo-slot flex w-full items-center justify-center"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
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
