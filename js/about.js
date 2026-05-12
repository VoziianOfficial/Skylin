"use strict";

/* ==========================================================
   Skylin — About Page Script
   Renders:
   - process steps
   - provider comparison lens
   ========================================================== */

(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on about page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initAboutPage);

    function initAboutPage() {
        renderAboutProcess();
        renderAboutLens();
    }

    function renderAboutProcess() {
        const mount = document.querySelector("[data-about-process]");

        if (!mount || !Array.isArray(config.processSteps)) return;

        mount.innerHTML = config.processSteps
            .map((step) => {
                return `
                    <article class="process-step">
                        <span class="process-step-number">${escapeHtml(step.number)}</span>
                        <h3>${escapeHtml(step.title)}</h3>
                        <p>${escapeHtml(step.text)}</p>
                    </article>
                `;
            })
            .join("");
    }

    function renderAboutLens() {
        const mount = document.querySelector("[data-about-lens]");

        if (!mount || !Array.isArray(config.comparisonFactors)) return;

        const icons = [
            "window",
            "shield",
            "materials",
            "pricing",
            "calendar",
            "warranty"
        ];

        mount.innerHTML = config.comparisonFactors
            .map((item, index) => {
                return `
                    <article class="about-lens-item">
                        <span class="about-lens-item-icon" aria-hidden="true">
                            ${getAboutIcon(icons[index] || "window")}
                        </span>

                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.text)}</p>
                    </article>
                `;
            })
            .join("");
    }

    function escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getAboutIcon(name) {
        const icons = {
            window: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 3H20V21H4V3Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M12 3V21" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M4 12H20" stroke="currentColor" stroke-width="1.7"/>
                </svg>
            `,

            shield: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L19 6V11.5C19 16.1 16.2 19.4 12 21C7.8 19.4 5 16.1 5 11.5V6L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.8 12L11 14.2L15.4 9.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            materials: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 5H20V19H4V5Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 5V19" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M16 5V19" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M4 12H20" stroke="currentColor" stroke-width="1.7"/>
                </svg>
            `,

            pricing: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3V21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M16.5 7.5C15.6 6.6 14.1 6 12.4 6C9.9 6 8 7.1 8 9C8 13 16.5 11.2 16.5 15.8C16.5 17.8 14.4 19 11.9 19C10.1 19 8.4 18.4 7.4 17.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            calendar: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 5H19V20H5V5Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 3V7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M16 3V7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M5 10H19" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 14H11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M13 14H16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            warranty: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L14.2 5.1L17.2 4.8L18 7.8L20.6 9.4L19.4 12L20.6 14.6L18 16.2L17.2 19.2L14.2 18.9L12 21L9.8 18.9L6.8 19.2L6 16.2L3.4 14.6L4.6 12L3.4 9.4L6 7.8L6.8 4.8L9.8 5.1L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.8 12L11 14.2L15.4 9.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `
        };

        return icons[name] || icons.window;
    }
})();