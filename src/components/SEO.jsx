import { useEffect } from "react";

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || "https://ankvidhya.com")
  .trim()
  .replace(/\/+$/, "");

const DEFAULT_DESCRIPTION =
  "Explore Ankvidhya mathematics programs, school partnerships and learning centers. Making Math Genius.";
const DEFAULT_IMAGE = "/images/home-hero-abacus-student.webp";

function setMeta(attribute, key, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export default function SEO({
  title = "Making Math Genius",
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  noIndex = false,
}) {
  useEffect(() => {
    const fullTitle = `${title} | Ankvidhya`;
    const canonicalUrl = new URL(path, `${SITE_ORIGIN}/`).toString();
    const imageUrl = image.startsWith("http")
      ? image
      : new URL(image, `${SITE_ORIGIN}/`).toString();

    document.title = fullTitle;
    setMeta("name", "description", description || DEFAULT_DESCRIPTION);
    setMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:locale", "en_IN");
    setMeta("property", "og:site_name", "Ankvidhya");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description || DEFAULT_DESCRIPTION);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description || DEFAULT_DESCRIPTION);
    setMeta("name", "twitter:image", imageUrl);
    setLink("canonical", canonicalUrl);

    const structuredDataId = "ankvidhya-organization-jsonld";
    let structuredData = document.getElementById(structuredDataId);
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = structuredDataId;
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Ankvidhya",
      url: SITE_ORIGIN,
      logo: new URL("/Ank_Logo.png", `${SITE_ORIGIN}/`).toString(),
      email: "info@ankvidhya.com",
      telephone: "+916357785778",
      address: {
        "@type": "PostalAddress",
        streetAddress: "C/326/327, Monarch Gaurav Path, Pal Gam",
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        postalCode: "395009",
        addressCountry: "IN",
      },
    });
  }, [title, description, path, image, noIndex]);

  return null;
}
