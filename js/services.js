"use strict";



(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on services page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initServicesPage);

    function initServicesPage() {
        renderServicesMosaic();
        renderWindowFrameGrid();
        renderServicesLens();
    }



    function renderServicesMosaic() {
        const mount = document.querySelector("[data-services-mosaic]");
        if (!mount || !Array.isArray(config.services)) return;

        mount.innerHTML = config.services
            .map((service, index) => {
                return `
          <a class="services-mosaic-card" href="${escapeAttr(service.href)}" style="--service-image: url('${escapeAttr(service.image)}');">
            <span class="services-mosaic-top">
              <span class="icon-box" aria-hidden="true">${serviceIcon(service.icon)}</span>
              <span class="services-mosaic-index">${String(index + 1).padStart(2, "0")}</span>
            </span>

            <span class="services-mosaic-content">
              <span class="photo-card-kicker">${escapeHtml(service.kicker || "Window Option")}</span>
              <h3>${escapeHtml(service.title)}</h3>
              <p>${escapeHtml(service.summary || service.cardText || "")}</p>
              <span class="text-link">Explore category</span>
            </span>
          </a>
        `;
            })
            .join("");
    }

  

    function renderWindowFrameGrid() {
        const mount = document.querySelector("[data-window-frame-grid]");
        if (!mount || !Array.isArray(config.services)) return;

        const classMap = {
            "window-installation": "install large",
            "window-replacement": "replace",
            "window-repair": "repair",
            "energy-efficient-windows": "energy wide"
        };

        mount.innerHTML = config.services
            .map((service, index) => {
                return `
          <a class="window-frame-cell photo ${escapeAttr(classMap[service.id] || "")}" href="${escapeAttr(service.href)}">
            <span class="window-frame-cell-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="icon-box" aria-hidden="true">${serviceIcon(service.icon)}</span>

            <h3>${escapeHtml(service.shortTitle || service.title)}</h3>
            <p>${escapeHtml(service.cardText || service.summary || "")}</p>
            <span class="text-link">View details</span>
          </a>
        `;
            })
            .join("");
    }



    function renderServicesLens() {
        const mount = document.querySelector("[data-services-lens]");
        if (!mount || !Array.isArray(config.comparisonFactors)) return;

        mount.innerHTML = config.comparisonFactors
            .slice(0, 6)
            .map((factor) => {
                return `
          <article class="services-lens-card">
            <span class="icon-box" aria-hidden="true">${factorIcon(factor.icon)}</span>
            <h3>${escapeHtml(factor.label)}</h3>
            <p>${escapeHtml(factor.text)}</p>
          </article>
        `;
            })
            .join("");
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

    function escapeAttr(value) {
        return escapeHtml(value);
    }
})();