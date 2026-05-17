import { EXTERNAL_LINK_REL, EXTERNAL_LINK_TARGET } from "./external-links.js";

export const GITHUB_PROFILE =
  "https://github.com/ChristianWebb0209";
export const LINKEDIN_PROFILE =
  "https://www.linkedin.com/in/christian-webb-76530928a/";

const ICON = {
  github: "../assets/icons/github-icon.svg",
  linkedin: "../assets/icons/linkedin-icon.svg",
};
export function iconLink(href, iconSrc, label) {
  return `<a class="icon-link" href="${href}" target="${EXTERNAL_LINK_TARGET}" rel="${EXTERNAL_LINK_REL}"><img src="${iconSrc}" alt="" width="20" height="20">${label}</a>`;
}

export const githubProfileLink = (label = "GitHub") =>
  iconLink(GITHUB_PROFILE, ICON.github, label);

export const linkedinProfileLink = (label = "LinkedIn") =>
  iconLink(LINKEDIN_PROFILE, ICON.linkedin, label);
