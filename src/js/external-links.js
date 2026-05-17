/** Default attributes for off-site links (new tab, no opener leak). */
export const EXTERNAL_LINK_TARGET = "_blank";
export const EXTERNAL_LINK_REL = "noopener noreferrer";

export function isExternalHref(href, base = window.location.href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    return new URL(href, base).origin !== new URL(base).origin;
  } catch {
    return false;
  }
}

export function applyExternalLinkDefaults(anchor, base = window.location.href) {
  const href = anchor.getAttribute("href");
  if (!isExternalHref(href, base)) return;

  anchor.target = EXTERNAL_LINK_TARGET;
  const rel = new Set((anchor.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
  for (const token of EXTERNAL_LINK_REL.split(/\s+/)) rel.add(token);
  anchor.setAttribute("rel", [...rel].join(" "));
}

export function initExternalLinks(root = document, base = window.location.href) {
  root.querySelectorAll("a[href]").forEach((anchor) => applyExternalLinkDefaults(anchor, base));
}

function observeExternalLinks() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLAnchorElement) {
          applyExternalLinkDefaults(node);
        } else if (node instanceof Element) {
          initExternalLinks(node);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function bootExternalLinks() {
  initExternalLinks();
  if (document.body) observeExternalLinks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootExternalLinks, { once: true });
} else {
  bootExternalLinks();
}
