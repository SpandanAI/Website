export function getSectionId(href) {
  return href.replace("#", "");
}

export function getNavTo(href, pathname) {
  const sectionId = getSectionId(href);

  if (pathname === "/team") {
    if (sectionId === "home") return "/";
    if (sectionId === "team") return "/team";
    return `/${href}`;
  }

  return href;
}

export function getLogoTo(pathname) {
  return pathname === "/team" ? "/" : "#home";
}

export function getPartnerTo(pathname) {
  return pathname === "/team" ? "/#contact" : "#contact";
}
