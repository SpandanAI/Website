import React from "react";

export default function DesignerSignature() {
  return (
    <div className="designer-signature">
      <svg className="designer-signature-art" viewBox="0 0 226 76" aria-hidden="true" focusable="false">
        <rect className="designer-signature-die" x="32" y="14" width="162" height="48" rx="2.75" />

        <path
          className="designer-signature-trace"
          d="M6 38 H40 M186 38 H220 M64 2 V14 M162 2 V14 M113 62 V74"
        />

        <circle className="designer-signature-pad" cx="6" cy="38" r="1.7" />
        <circle className="designer-signature-pad" cx="220" cy="38" r="1.7" />
        <circle className="designer-signature-pad" cx="64" cy="2.6" r="1.7" />
        <circle className="designer-signature-pad" cx="162" cy="2.6" r="1.7" />
        <circle className="designer-signature-pad" cx="113" cy="73.4" r="1.7" />
      </svg>

      <p className="designer-signature-copy">
        <span className="designer-signature-label">Designed by</span>{" "}
        <span className="designer-signature-name">Korak Das</span>
      </p>
      <p className="designer-signature-mark">KD • 2026</p>
    </div>
  );
}
