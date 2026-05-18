import { initExternalLinks } from "./external-links.js";

class SiteFooter extends HTMLElement {
  connectedCallback() {
    initExternalLinks(this);
  }
}

customElements.define("site-footer", SiteFooter);
