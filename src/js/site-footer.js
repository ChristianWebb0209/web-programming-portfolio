import { githubProfileLink, linkedinProfileLink } from "./social-links.js";
import { initExternalLinks } from "./external-links.js";

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer>
      <p><small>Christian Webb</small></p>
      <p class="footer-links">${githubProfileLink()}${linkedinProfileLink()}</p>
    </footer>`;
    initExternalLinks(this);
  }
}

customElements.define("site-footer", SiteFooter);
