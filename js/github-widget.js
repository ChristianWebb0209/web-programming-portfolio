import { iconLink } from "./social-links.js";

const GITHUB_ICON = "assets/icons/github-icon.svg";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatProfileDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
}

class GithubWidget extends HTMLElement {
  async connectedCallback() {
    const user = this.dataset.user || "ChristianWebb0209";
    const fallback = this.innerHTML;
    this.dataset.state = "loading";
    this.setAttribute("aria-busy", "true");
    this.setAttribute("aria-live", "polite");
    this.textContent = "Loading GitHub profile…";

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const profile = await res.json();

      const name = escapeHtml(profile.name || profile.login);
      const login = escapeHtml(profile.login);
      const bio = profile.bio ? `<p>${escapeHtml(profile.bio)}</p>` : "";
      const updated = formatProfileDate(profile.updated_at);

      this.dataset.state = "ready";
      this.removeAttribute("aria-busy");
      this.innerHTML = `<p><strong>${name}</strong> (@${login})</p>
        ${bio}
        <p>Public repos: ${profile.public_repos} · Followers: ${profile.followers} · Following: ${profile.following}</p>
        ${updated ? `<p><small>Profile last updated ${escapeHtml(updated)}</small></p>` : ""}
        <p>${iconLink(profile.html_url, GITHUB_ICON, "View GitHub profile")}</p>`;
    } catch (error) {
      this.dataset.state = "error";
      this.removeAttribute("aria-busy");
      this.innerHTML = `<p>Could not load GitHub profile (${escapeHtml(error.message)}).</p>${fallback}`;
    }
  }
}

customElements.define("github-widget", GithubWidget);
