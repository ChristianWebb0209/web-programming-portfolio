class PageHeader extends HTMLElement {
  connectedCallback() {
    if (!this.querySelector(".page-header__inner")) {
      const inner = document.createElement("header");
      inner.className = "page-header__inner";
      inner.append(...this.childNodes);
      this.appendChild(inner);
    }
  }
}

customElements.define("page-header", PageHeader);
