class SiteNav extends HTMLElement {
  connectedCallback() {
    const page = document.body.dataset.page || "";

    this.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const isAbout =
        page === "about" &&
        (href === "index.html" ||
          href === "../index.html" ||
          href.endsWith("/index.html"));
      const isPage =
        page !== "about" &&
        (href === `${page}.html` || href.endsWith(`/pages/${page}.html`));
      a.toggleAttribute("aria-current", isAbout || isPage ? "page" : false);
    });
  }
}

customElements.define("site-nav", SiteNav);
