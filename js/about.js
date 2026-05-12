"use strict";



(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on about page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initAboutPage);

    function initAboutPage() {
        renderAboutProcess();
        renderAboutChecklist();
    }

 

    function renderAboutProcess() {
        const mount = document.querySelector("[data-about-process]");
        if (!mount || !Array.isArray(config.processSteps)) return;

        mount.innerHTML = config.processSteps
            .map((step) => {
                return `
          <article class="process-step">
            <span class="process-step-number">${escapeHtml(step.number)}</span>

            <span class="process-step-icon" aria-hidden="true">
              ${processIcon(step.icon)}
            </span>

            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.text)}</p>
          </article>
        `;
            })
            .join("");
    }

  

    function renderAboutChecklist() {
        const mount = document.querySelector("[data-about-checklist]");
        if (!mount || !Array.isArray(config.comparisonFactors)) return;

        mount.innerHTML = config.comparisonFactors
            .slice(0, 6)
            .map((factor) => {
                return `
          <article class="about-checklist-item">
            <span class="icon-box" aria-hidden="true">
              ${factorIcon(factor.icon)}
            </span>

            <h3>${escapeHtml(factor.label)}</h3>
            <p>${escapeHtml(factor.text)}</p>
          </article>
        `;
            })
            .join("");
    }


    function processIcon(type) {
        const icons = {
            clipboard: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 4h6l1 2h3v15H5V6h3l1-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M9 12h6M9 16h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `,
            layout: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16v14H4V5Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M4 10h16M10 10v9" fill="none" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      `,
            network: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="6" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="18" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="12" cy="17" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="m8.2 8.5 2.5 6M15.8 8.5l-2.5 6" fill="none" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      `,
            compare: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h12M5 17h12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="m15 4 4 3-4 3M9 14l-4 3 4 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
        };

        return icons[type] || icons.clipboard;
    }

    function factorIcon(type) {
        const icons = {
            badge: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 4h8l3 5-7 11L5 9l3-5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="m9.5 11 1.8 1.8L15 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            layers: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 3 9 5-9 5-9-5 9-5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="m3 12 9 5 9-5M3 16l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      `,
            calendar: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h14v16H5V4Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 2v4M16 2v4M5 9h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `,
            shield: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="m9 12 2 2 4-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            file: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3h7l4 4v14H7V3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M14 3v5h5M9 13h6M9 17h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `,
            star: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      `
        };

        return icons[type] || icons.shield;
    }


    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
})();