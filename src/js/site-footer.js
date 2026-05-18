import { githubProfileLink, linkedinProfileLink } from "./social-links.js";
import { initExternalLinks } from "./external-links.js";

class SiteFooter extends HTMLElement {
  connectedCallback() {
    let footer = this.querySelector("footer");
    if (!footer) {
      footer = document.createElement("footer");
      footer.innerHTML = `<p><small>Christian Webb</small></p><p class="footer-links"></p>`;
      this.appendChild(footer);
    }

    const links = footer.querySelector(".footer-links");
    if (links) {
      links.innerHTML = `${githubProfileLink()}${linkedinProfileLink()}`;
    }

    initExternalLinks(this);
  }
}

customElements.define("site-footer", SiteFooter);
