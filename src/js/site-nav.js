import "./external-links.js";

class SiteNav extends HTMLElement {  connectedCallback() {
    const page = document.body.dataset.page || "";

    if (!this.querySelector("nav")) {
      this.innerHTML = `<nav><ul>
        <li><a href="index.html">About</a></li>
        <li><a href="resume.html">Resume</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul></nav>`;
    }

    this.querySelectorAll("a").forEach((a) => {
      const href = (a.getAttribute("href") || "").replace(/^\.\//, "");
      const isAbout = page === "about" && (href === "index.html" || href === "/");
      const isPage = page !== "about" && href === `${page}.html`;
      a.toggleAttribute("aria-current", isAbout || isPage ? "page" : false);
    });
  }
}

customElements.define("site-nav", SiteNav);
