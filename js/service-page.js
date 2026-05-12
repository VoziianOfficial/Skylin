"use strict";



(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on service detail page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initServicePage);

    function initServicePage() {
        const service = getCurrentService();

        if (!service) {
            console.error("Service not found. Check body[data-service-id] and config.services.");
            return;
        }

        applyServiceImages(service);
        injectServiceContent(service);
        renderEvaluationPoints(service);
        renderEditorialChecklist(service);
        renderRelatedServices(service);
    }


    function getCurrentService() {
        const bodyServiceId = document.body.getAttribute("data-service-id");

        if (bodyServiceId) {
            return config.services.find((service) => service.id === bodyServiceId);
        }

        const page = window.location.pathname.split("/").pop() || "index.html";
        return config.services.find((service) => {
            return normalizePage(service.href) === page;
        });
    }

    function normalizePage(value) {
        return String(value || "").split("#")[0].split("?")[0].split("/").pop();
    }


    function applyServiceImages(service) {
        const hero = document.querySelector("[data-service-hero]");
        const intro = document.querySelector("[data-service-intro]");
        const editorial = document.querySelector("[data-service-editorial]");

        if (hero) {
            hero.style.setProperty("--service-hero-image", `url("${service.heroImage || service.image}")`);
        }

        if (intro) {
            intro.style.setProperty("--service-main-image", `url("${service.image}")`);
        }

        if (editorial) {
            editorial.style.setProperty("--service-editorial-image", `url("${service.image}")`);
        }
    }



    function injectServiceContent(service) {
        setText("[data-service-title]", service.title);
        setText("[data-service-short-title]", service.shortTitle || service.title);
        setText("[data-service-kicker]", service.kicker || "Window Option");
        setText("[data-service-summary]", service.summary);
        setText("[data-service-card-text]", service.cardText || service.summary);
        setText("[data-service-hero-title]", service.heroTitle || service.title);
        setText("[data-service-hero-text]", service.heroText || service.summary);
        setText("[data-service-page-intro]", service.pageIntro || service.summary);
        setText("[data-service-cta-title]", service.ctaTitle || `Compare ${service.title} provider options`);
        setText("[data-service-cta-text]", service.ctaText || service.summary);

        document.querySelectorAll("[data-current-service-link]").forEach((link) => {
            link.setAttribute("href", service.href);
        });
    }

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = value || "";
        });
    }



    function renderEvaluationPoints(service) {
        const mount = document.querySelector("[data-service-evaluation]");
        if (!mount) return;

        const points = Array.isArray(service.evaluationPoints) ? service.evaluationPoints : [];

        mount.innerHTML = points
            .map((point, index) => {
                return `
          <article class="service-detail-evaluation-card">
            <span class="service-detail-evaluation-index">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(point)}</h3>
            <p>${escapeHtml(getEvaluationText(index, service))}</p>
          </article>
        `;
            })
            .join("");
    }

    function getEvaluationText(index, service) {
        const fallback = [
            "Review this detail directly with each independent provider before moving forward.",
            "Ask providers to explain options, limitations, scope, and project-specific considerations.",
            "Compare quote clarity, timeline expectations, materials, and documentation carefully.",
            "Confirm licensing, insurance, warranty terms, and provider credentials directly."
        ];

        const serviceSpecific = {
            "window-installation": [
                "Share opening details, property context, and installation goals before comparing provider options.",
                "Discuss frame materials, glass preferences, finish details, and measurements directly with providers.",
                "Compare scheduling expectations, project scope, included work, and quote assumptions.",
                "Verify licensing, insurance, installation warranty, and product documentation directly."
            ],
            "window-replacement": [
                "Describe the current window condition, age, draft concerns, and replacement priorities.",
                "Compare material options, glass packages, style changes, and removal-related details.",
                "Review what is included in the replacement quote and what may require additional assessment.",
                "Confirm product warranty, labor warranty, insurance, licensing, and provider credentials."
            ],
            "window-repair": [
                "Explain the visible issue clearly, including glass, seal, frame, hardware, or operation concerns.",
                "Ask providers whether repair, adjustment, glass replacement, or a larger scope may be needed.",
                "Compare urgency, access needs, diagnostic costs, and quote clarity before choosing a provider.",
                "Verify provider experience, insurance, licensing, and any repair-related warranty terms."
            ],
            "energy-efficient-windows": [
                "Clarify comfort goals, room conditions, draft concerns, and desired efficiency improvements.",
                "Compare glass packages, frame materials, insulation details, and performance documentation.",
                "Review installation scope, product specifications, projected timeline, and quote assumptions.",
                "Confirm warranty terms, product documentation, licensing, insurance, and provider credentials."
            ]
        };

        const selected = serviceSpecific[service.id] || fallback;
        return selected[index] || fallback[index] || fallback[0];
    }



    function renderEditorialChecklist(service) {
        const mount = document.querySelector("[data-service-editorial-checklist]");
        if (!mount) return;

        const items = [
            `Confirm whether ${service.title.toLowerCase()} is the right category for your project.`,
            "Ask each provider what is included, excluded, optional, or dependent on inspection.",
            "Review licensing, insurance, credentials, timelines, quote scope, and warranty terms directly.",
            "Compare providers yourself before approving any window-related work."
        ];

        mount.innerHTML = items
            .map((item) => {
                return `<li>${escapeHtml(item)}</li>`;
            })
            .join("");
    }



    function renderRelatedServices(service) {
        const mount = document.querySelector("[data-related-services]");
        if (!mount) return;

        const related = config.services.filter((item) => item.id !== service.id).slice(0, 3);

        mount.innerHTML = related
            .map((item, index) => {
                return `
          <a class="service-card" href="${escapeAttr(item.href)}" style="--service-image: url('${escapeAttr(item.image)}');">
            <span class="service-card-top">
              <span class="icon-box" aria-hidden="true">${serviceIcon(item.icon)}</span>
              <span class="service-card-index">${String(index + 1).padStart(2, "0")}</span>
            </span>

            <span class="service-card-inner">
              <span class="photo-card-kicker">${escapeHtml(item.kicker || "Window Option")}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.cardText || item.summary || "")}</p>
              <span class="text-link">Explore</span>
            </span>
          </a>
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