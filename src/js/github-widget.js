import { iconLink } from "./social-links.js";

const GITHUB_ICON = "../assets/icons/github-icon.svg";

class GithubWidget extends HTMLElement {
  async connectedCallback() {
    const user = this.dataset.user || "ChristianWebb0209";
    const fallback = this.innerHTML;
    this.dataset.state = "loading";
    this.textContent = "Loading GitHub stats…";
    try {
      const res = await fetch(`https://api.github.com/users/${user}`);
      if (!res.ok) throw new Error(res.statusText);
      const u = await res.json();
      this.dataset.state = "ready";
      this.innerHTML = `<p><strong>${u.name || u.login}</strong> (@${u.login})</p>
        <p>Public repos: ${u.public_repos} · Followers: ${u.followers}</p>
        <p>${iconLink(u.html_url, GITHUB_ICON, "View GitHub profile")}</p>`;
    } catch {
      this.dataset.state = "error";
      this.innerHTML = fallback;
    }
  }
}
customElements.define("github-widget", GithubWidget);
