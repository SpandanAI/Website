import React from "react";

export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-4xl sm:leading-[1.2] lg:text-[2.65rem] lg:leading-[1.22] ${
          isCentered ? "mx-auto max-w-[36rem]" : ""
        }`}
      >
        {title}
      </h2>
      <p className="mt-5 text-base leading-[1.7] text-muted sm:text-lg">{description}</p>
    </div>
  );
}
