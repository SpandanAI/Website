export const LEADERSHIP_NAMES = [
  "N.R. Rohan",
  "K. Dharanidhar G",
  "S. Aniruddhan",
  "V. S. Chakravarthy"
];

export const LEADERSHIP_LINKEDIN = [
  {
    name: "N.R. Rohan",
    href: "https://www.linkedin.com/in/rohan-rajagopal-nurani-30695184/",
    label: "LinkedIn profile of N.R. Rohan"
  },
  {
    name: "K. Dharanidhar G",
    href: "https://www.linkedin.com/in/dharanidhar-kunjeti-40a1bb226/",
    label: "LinkedIn profile of K. Dharanidhar G"
  },
  {
    name: "S. Aniruddhan",
    href: "https://www.linkedin.com/in/sankaran-aniruddhan/",
    label: "LinkedIn profile of S. Aniruddhan"
  },
  {
    name: "V. S. Chakravarthy",
    href: "https://www.linkedin.com/in/srinivasa-chakravarthy-a09b5131/",
    label: "LinkedIn profile of V. S. Chakravarthy"
  }
];

export const CONTACT_EMAIL = "spandanai.sard@gmail.com";

export function collectPageFaults(page) {
  const pageErrors = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    consoleErrors.push(msg.text());
  });

  return {
    pageErrors,
    consoleErrors,
    assertClean() {
      if (pageErrors.length > 0) {
        throw new Error(`Uncaught page error: ${pageErrors.join(" | ")}`);
      }
      if (consoleErrors.length > 0) {
        throw new Error(`Console error: ${consoleErrors.join(" | ")}`);
      }
    }
  };
}
