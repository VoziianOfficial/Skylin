"use strict";

/* ==========================================================
   Skylin — Home Page Script
   Renders:
   - process steps
   - animated stats
   - provider comparison factors
   ========================================================== */

(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on home page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initHomePage);

    function initHomePage() {
        renderHomeProcess();
        renderHomeStats();
        renderHomeComparison();
    }

    function renderHomeProcess() {
        const mount = document.querySelector("[data-home-process]");

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

    function renderHomeStats() {
        const mount = document.querySelector("[data-home-stats]");

        if (!mount || !Array.isArray(config.stats)) return;

        mount.innerHTML = config.stats
            .map((item) => {
                const decimals = String(item.value).includes(".") ? 1 : 0;

                return `
                    <article class="stat-item">
                        <span class="stat-icon" aria-hidden="true">
                            ${getHomeIcon(item.icon)}
                        </span>

                        <div class="stat-value">
                            <span
                                data-count-to="${escapeHtml(item.value)}"
                                data-count-decimals="${decimals}"
                                data-count-duration="1400"
                            >0</span>
                            <span class="stat-suffix">${escapeHtml(item.suffix)}</span>
                        </div>

                        <p class="stat-label">${escapeHtml(item.label)}</p>
                    </article>
                `;
            })
            .join("");

        initHomeCounters();
    }

    function renderHomeComparison() {
        const mount = document.querySelector("[data-home-comparison]");

        if (!mount || !Array.isArray(config.comparisonFactors)) return;

        mount.innerHTML = config.comparisonFactors
            .map((item, index) => {
                const iconNames = [
                    "services",
                    "shield",
                    "materials",
                    "pricing",
                    "timeline",
                    "support"
                ];

                return `
                    <article class="comparison-item">
                        <span class="comparison-item-icon" aria-hidden="true">
                            ${getHomeIcon(iconNames[index] || "services")}
                        </span>

                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.text)}</p>
                    </article>
                `;
            })
            .join("");
    }

    function initHomeCounters() {
        const counters = Array.from(document.querySelectorAll("[data-home-stats] [data-count-to]"));

        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.35
            }
        );

        counters.forEach((counter) => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseFloat(element.getAttribute("data-count-to") || "0");
        const decimals = Number(element.getAttribute("data-count-decimals") || "0");
        const duration = Number(element.getAttribute("data-count-duration") || "1300");
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;

            element.textContent = value.toFixed(decimals);

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                element.textContent = target.toFixed(decimals);
            }
        }

        requestAnimationFrame(frame);
    }

    function escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getHomeIcon(name) {
        const icons = {
            services: `
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

            timeline: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 5H19V20H5V5Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 3V7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M16 3V7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M5 10H19" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M8 14H11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M13 14H16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            support: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L14.2 5.1L17.2 4.8L18 7.8L20.6 9.4L19.4 12L20.6 14.6L18 16.2L17.2 19.2L14.2 18.9L12 21L9.8 18.9L6.8 19.2L6 16.2L3.4 14.6L4.6 12L3.4 9.4L6 7.8L6.8 4.8L9.8 5.1L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.8 12L11 14.2L15.4 9.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            timer: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21C16.4 21 20 17.4 20 13C20 8.6 16.4 5 12 5C7.6 5 4 8.6 4 13C4 17.4 7.6 21 12 21Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M9 2.8H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M12 9V13L15 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            "clipboard-check": `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 4H16L17 6H20V21H4V6H7L8 4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.5 13L11 15.5L15.8 10.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            target: `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21C17 21 21 17 21 12C21 7 17 3 12 3C7 3 3 7 3 12C3 17 7 21 12 21Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M12 12H21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            "badge-check": `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L14.2 5.1L17.2 4.8L18 7.8L20.6 9.4L19.4 12L20.6 14.6L18 16.2L17.2 19.2L14.2 18.9L12 21L9.8 18.9L6.8 19.2L6 16.2L3.4 14.6L4.6 12L3.4 9.4L6 7.8L6.8 4.8L9.8 5.1L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.8 12L11 14.2L15.4 9.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `
        };

        return icons[name] || icons.services;
    }
})();