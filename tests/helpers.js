export const LEADERSHIP_NAMES = [
  "N.R. Rohan",
  "K. Dharanidhar G",
  "S. Aniruddhan",
  "V. S. Chakravarthy"
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
