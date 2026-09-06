import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_ORIGIN = "https://spandanai.com";
const HOME_DESCRIPTION =
  "SpandanAI is a fabless semiconductor company building hybrid analog-digital silicon for AI inference and next-generation communication systems.";
const TEAM_DESCRIPTION = "Leadership and team at SpandanAI.";

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setMetaDescription(content) {
  let meta = document.head.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

export default function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/team") {
      document.title = "Meet the Team | SpandanAI";
      setMetaDescription(TEAM_DESCRIPTION);
      setCanonical(`${SITE_ORIGIN}/team`);
      return;
    }

    if (pathname === "/") {
      document.title = "SpandanAI";
      setMetaDescription(HOME_DESCRIPTION);
      setCanonical(`${SITE_ORIGIN}/`);
      return;
    }

    document.title = "Page not found | SpandanAI";
    setMetaDescription(HOME_DESCRIPTION);
    setCanonical(`${SITE_ORIGIN}/`);
  }, [pathname]);

  return null;
}
