const RATE_LIMIT_MS = 60000;
const STORAGE_KEY = "portfolio-contact-last-submit";
const SITE_NOTE = "[Sent from Christian Webb portfolio site]";
// I got the LLM to build this to make sure the email address follows this regex
const EMAIL_PATTERN = /[^@\s]+@[^@\s]+\.[^@\s]+/;

// Burner inbox for portfolio contact form submissions (not my primary email).
const CONTACT_EMAIL = "mlgalpaca3@gmail.com";
// The LLM chose formsubmit.co which I agree with since it seems like the simplest option
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`;

function getLastSubmitTime() {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return 0;
  const time = Number(value);
  return Number.isFinite(time) ? time : 0;
}

function getCooldownRemaining() {
  const elapsed = Date.now() - getLastSubmitTime();
  return Math.max(0, RATE_LIMIT_MS - elapsed);
}

function recordSubmit() {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

function setStatus(statusEl, { message, type }) {
  statusEl.textContent = message;
  statusEl.hidden = false;
  statusEl.classList.remove("is-error", "is-success", "is-loading");
  if (type) statusEl.classList.add(type);
}

function showRateLimitMessage(statusEl, remainingMs) {
  const seconds = Math.ceil(remainingMs / 1000);
  setStatus(statusEl, {
    type: "is-error",
    message:
      seconds === 1
        ? "Please wait 1 second before sending another message. Your previous message was not sent again."
        : `Please wait ${seconds} seconds before sending another message. Your previous message was not sent again.`,
  });
}

function setFormBusy(form, submitBtn, busy) {
  form.setAttribute("aria-busy", busy ? "true" : "false");
  submitBtn.disabled = busy;
  submitBtn.textContent = busy ? "Sending…" : "Submit";
  for (const field of form.querySelectorAll("input, textarea, button")) {
    if (field !== submitBtn) field.disabled = busy;
  }
}

async function sendContactEmail({ name, from, message }) {
  const response = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email: from,
      message: `${SITE_NOTE}\n\n${message}\n\n---\nFrom: ${name}\nReply-To: ${from}`,
      _subject: "Portfolio site contact",
      _replyto: from,
      _template: "table",
      _captcha: "false",
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // I guess do nothing here
  }

  if (!response.ok) {
    const detail =
      typeof data?.message === "string"
        ? data.message
        : `The server responded with ${response.status}.`;
    throw new Error(detail);
  }

  if (data?.success === false || data?.success === "false") {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : "email service rejected this submission."
    );
  }

  return data;
}

function initContactForm() {
  const form = document.querySelector('body[data-page="contact"] form');
  const statusEl = document.getElementById("contact-status");
  const submitBtn = form?.querySelector('button[type="submit"]');
  const emailInput = form?.querySelector("#from");

  if (!form || !statusEl || !submitBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.hidden = true;
    statusEl.textContent = "";
    statusEl.classList.remove("is-error", "is-success", "is-loading");

    if (!form.reportValidity()) {
      setStatus(statusEl, {
        type: "is-error",
        message:
          "Some fields are missing or invalid. Fix the highlighted fields, then try again. Nothing was sent.",
      });
      return;
    }

    const email = String(emailInput?.value ?? "").trim();
    if (!EMAIL_PATTERN.test(email)) {
      emailInput?.setCustomValidity(
        "Enter an email with @ and a dot in the domain (e.g. name@example.com)."
      );
      emailInput?.reportValidity();
      setStatus(statusEl, {
        type: "is-error",
        message:
          "Your email address must include @ and a dot in the domain (e.g. name@example.com). Nothing was sent.",
      });
      return;
    }
    emailInput?.setCustomValidity("");

    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot?.value) {
      setStatus(statusEl, {
        type: "is-success",
        message: "Message sent successfully.",
      });
      return;
    }

    const remaining = getCooldownRemaining();
    if (remaining > 0) {
      showRateLimitMessage(statusEl, remaining);
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("from") ?? "").trim();
    const message = String(data.get("body") ?? "").trim();

    setFormBusy(form, submitBtn, true);
    setStatus(statusEl, {
      type: "is-loading",
      message:
        "Sending your message… Please wait and do not close this page. Nothing has been delivered yet.",
    });

    try {
      await sendContactEmail({ name, from, message });
      recordSubmit();
      form.reset();
      setStatus(statusEl, {
        type: "is-success",
        message: `Message sent successfully. Your note was delivered to my inbox and I will reply to ${from} when I can. If you do not hear back, double-check the address you entered or try again in about a minute.`,
      });
    } catch (error) {
      const detail =
        error instanceof Error && error.message
          ? error.message
          : "An unexpected error occurred.";
      setStatus(statusEl, {
        type: "is-error",
        message: `We could not send your message. ${detail} Your message was not delivered - please check your connection and try again.`,
      });
    } finally {
      setFormBusy(form, submitBtn, false);
    }
  });

  emailInput?.addEventListener("input", () => {
    emailInput.setCustomValidity("");
  });
}

initContactForm();
