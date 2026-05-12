"use strict";

/* ==========================================================
   Skylin — Contact Page Script
   Renders:
   - contact info cards
   - contact form steps
   ========================================================== */

(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on contact page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initContactPage);

    function initContactPage() {
        renderContactCards();
        renderContactSteps();
    }

    /* ========================================================
       Contact Cards
       ======================================================== */

    function renderContactCards() {
        const mount = document.querySelector("[data-contact-cards]");
        if (!mount) return;

        const cards = [
            {
                title: "Call",
                value: config.phone,
                href: config.phoneHref,
                icon: "phone",
                attr: "data-phone-link data-phone-text"
            },
            {
                title: "Email",
                value: config.email,
                href: `mailto:${config.email}`,
                icon: "mail",
                attr: "data-email-link data-email-text"
            },
            {
                title: "Address",
                value: config.address.full,
                href: "",
                icon: "map",
                attr: "data-address-text"
            },
            {
                title: "Service Area",
                value: config.serviceArea,
                href: "",
                icon: "area",
                attr: "data-service-area"
            }
        ];

        mount.innerHTML = cards
            .map((card) => {
                const valueMarkup = card.href
                    ? `<a href="${escapeAttr(card.href)}" ${card.attr}>${escapeHtml(card.value)}</a>`
                    : `<span ${card.attr}>${escapeHtml(card.value)}</span>`;

                return `
          <article class="contact-info-card">
            <span class="icon-box" aria-hidden="true">
              ${icon(card.icon)}
            </span>

            <span>
              <strong>${escapeHtml(card.title)}</strong>
              ${valueMarkup}
            </span>
          </article>
        `;
            })
            .join("");
    }

    /* ========================================================
       Contact Form Steps
       ======================================================== */

    function renderContactSteps() {
        const mount = document.querySelector("[data-contact-steps]");
        if (!mount) return;

        const steps = [
            {
                number: "01",
                title: "Choose the window category",
                text: "Select installation, replacement, repair, or energy-efficient windows."
            },
            {
                number: "02",
                title: "Share your ZIP code",
                text: "Provider availability may vary by service area and project scope."
            },
            {
                number: "03",
                title: "Compare directly",
                text: "Review independent provider options, credentials, quotes, timelines, and warranty terms."
            }
        ];

        mount.innerHTML = steps
            .map((step) => {
                return `
          <article class="contact-form-step">
            <span>${escapeHtml(step.number)}</span>

            <div>
              <strong>${escapeHtml(step.title)}</strong>
              <small>${escapeHtml(step.text)}</small>
            </div>
          </article>
        `;
            })
            .join("");
    }

    /* ========================================================
       Icons
       ======================================================== */

    function icon(name) {
        const icons = {
            phone: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.45 19.45 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.79a2 2 0 0 1-.45 2.11L8.05 9.89a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.89.31 1.83.53 2.79.66A2 2 0 0 1 22 16.92Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            mail: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="m22 7-10 6L2 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            map: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      `,
            area: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `
        };

        return icons[name] || icons.area;
    }

    /* ========================================================
       Helpers
       ======================================================== */

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function escapeAttr(value) {
        return escapeHtml(value);
    }
})();