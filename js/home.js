"use strict";



(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on home page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initHomePage);

    function initHomePage() {
        renderHeroServiceStrip();
        renderHomeProcess();
        renderBlueprintIcons();
        renderHomeStats();
        renderHomeComparison();
    }



    function renderHeroServiceStrip() {
        const mount = document.querySelector("[data-hero-services]");
        if (!mount || !Array.isArray(config.services)) return;

        mount.innerHTML = config.services
            .map((service) => {
                return `
          <a class="hero-service-link" href="${escapeAttr(service.href)}">
            <span class="icon-box" aria-hidden="true">${serviceIcon(service.icon)}</span>
            <strong>${escapeHtml(service.title)}</strong>
          </a>
        `;
            })
            .join("");
    }


    function renderHomeProcess() {
        const mount = document.querySelector("[data-home-process]");
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


    function renderBlueprintIcons() {
        const mount = document.querySelector("[data-blueprint-icons]");
        if (!mount || !Array.isArray(config.comparisonFactors)) return;

        mount.innerHTML = config.comparisonFactors
            .slice(0, 6)
            .map((factor) => {
                return `
          <article class="blueprint-icon-card">
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



    function renderHomeStats() {
        const mount = document.querySelector("[data-home-stats]");
        if (!mount || !Array.isArray(config.stats)) return;

        mount.innerHTML = config.stats
            .map((stat) => {
                const numericValue = Number(stat.value) || 0;
                const progress = Math.max(18, Math.min(numericValue, 100));

                return `
          <article class="stat-card" style="--stat-progress: ${progress}%;">
            <div class="stat-top">
              <div>
                <span class="stat-value">
                  <span data-counter="${escapeAttr(numericValue)}">0</span><span class="stat-suffix">${escapeHtml(stat.suffix || "")}</span>
                </span>
              </div>

              <span class="icon-box" aria-hidden="true">
                ${statIcon(stat.icon)}
              </span>
            </div>

            <h3>${escapeHtml(stat.label)}</h3>
            <p>${escapeHtml(stat.text)}</p>
          </article>
        `;
            })
            .join("");
    }



    function renderHomeComparison() {
        const mount = document.querySelector("[data-home-comparison]");
        if (!mount || !Array.isArray(config.comparisonFactors)) return;

        const factors = config.comparisonFactors.slice(0, 6);

        mount.innerHTML = `
      <div class="comparison-row comparison-head">
        <div class="comparison-cell factor">Provider comparison</div>
        ${factors
                .map((factor) => {
                    return `
              <div class="comparison-cell">
                <span>${escapeHtml(factor.label)}</span>
              </div>
            `;
                })
                .join("")}
      </div>

      ${["Provider A", "Provider B", "Provider C"]
                .map((provider, rowIndex) => {
                    return `
            <div class="comparison-row">
              <div class="comparison-cell factor">${escapeHtml(provider)}</div>
              ${factors
                            .map((factor, factorIndex) => {
                                const filled = (rowIndex + factorIndex) % 3 !== 1;

                                return `
                    <div class="comparison-cell">
                      <span class="comparison-check ${filled ? "is-filled" : ""}" aria-label="${filled ? "Included" : "Review"}">
                        ${filled ? checkIcon() : ""}
                      </span>
                    </div>
                  `;
                            })
                            .join("")}
            </div>
          `;
                })
                .join("")}
    `;
    }

 

    function serviceIcon(type) {
        const icons = {
            window: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4h16v16H4V4Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      `,
            replace: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11a8 8 0 0 0-14.2-4.9L4 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 13a8 8 0 0 0 14.2 4.9L20 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 20v-4h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            repair: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.7-8.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 4 20 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `,
            energy: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      `
        };

        return icons[type] || icons.window;
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

    function statIcon(type) {
        const icons = {
            check: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            target: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `,
            shield: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="m9 12 2 2 4-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            clock: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `
        };

        return icons[type] || icons.check;
    }

    function checkIcon() {
        return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 12 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    }



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