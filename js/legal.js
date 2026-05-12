"use strict";



(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing on legal page.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initLegalPage);

    function initLegalPage() {
        renderLegalSidebarLinks();
        renderLegalContact();
        renderLegalCtaLinks();
        renderLegalServiceList();
        markActiveLegalLink();
        injectLegalMetaLabels();
    }



    function renderLegalSidebarLinks() {
        document.querySelectorAll("[data-legal-sidebar-links]").forEach((mount) => {
            mount.innerHTML = getLegalLinks()
                .map((link) => {
                    return `
            <a href="${escapeAttr(link.href)}" data-legal-link="${escapeAttr(link.href)}">
              ${escapeHtml(link.label)}
            </a>
          `;
                })
                .join("");
        });
    }

    function markActiveLegalLink() {
        const currentPage = getCurrentPage();

        document.querySelectorAll("[data-legal-link]").forEach((link) => {
            const target = normalizePage(link.getAttribute("data-legal-link") || link.getAttribute("href") || "");

            if (target === currentPage) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }
        });
    }


    function renderLegalContact() {
        document.querySelectorAll("[data-legal-contact]").forEach((mount) => {
            mount.innerHTML = `
        <div class="legal-contact-list">
          <div class="legal-contact-line">
            ${icon("phone")}
            <a href="${escapeAttr(config.phoneHref)}" data-phone-link data-phone-text>${escapeHtml(config.phone)}</a>
          </div>

          <div class="legal-contact-line">
            ${icon("mail")}
            <a href="mailto:${escapeAttr(config.email)}" data-email-link data-email-text>${escapeHtml(config.email)}</a>
          </div>

          <div class="legal-contact-line">
            ${icon("map")}
            <span data-address-text>${escapeHtml(config.address.full)}</span>
          </div>

          <div class="legal-contact-line">
            ${icon("company")}
            <span data-company-id>${escapeHtml(config.companyId)}</span>
          </div>
        </div>
      `;
        });
    }



    function renderLegalCtaLinks() {
        document.querySelectorAll("[data-legal-cta-links]").forEach((mount) => {
            mount.innerHTML = getLegalLinks()
                .map((link) => {
                    return `
            <a href="${escapeAttr(link.href)}" data-legal-link="${escapeAttr(link.href)}">
              ${escapeHtml(link.label)}
            </a>
          `;
                })
                .join("");
        });
    }


    function renderLegalServiceList() {
        document.querySelectorAll("[data-legal-service-list]").forEach((mount) => {
            if (!Array.isArray(config.services)) return;

            mount.innerHTML = config.services
                .map((service) => {
                    return `<li><a href="${escapeAttr(service.href)}">${escapeHtml(service.title)}</a></li>`;
                })
                .join("");
        });
    }



    function injectLegalMetaLabels() {
        const currentYear = String(new Date().getFullYear());

        document.querySelectorAll("[data-legal-updated]").forEach((element) => {
            if (!element.textContent.trim()) {
                element.textContent = `Last updated: ${currentYear}`;
            }
        });

        document.querySelectorAll("[data-legal-platform-name]").forEach((element) => {
            element.textContent = config.companyName;
        });

        document.querySelectorAll("[data-legal-company-id]").forEach((element) => {
            element.textContent = config.companyId;
        });
    }

    

    function getLegalLinks() {
        return Array.isArray(config.legalLinks)
            ? config.legalLinks
            : [
                {
                    label: "Privacy Policy",
                    href: "privacy-policy.html"
                },
                {
                    label: "Cookie Policy",
                    href: "cookie-policy.html"
                },
                {
                    label: "Terms of Service",
                    href: "terms-of-service.html"
                }
            ];
    }

    function getCurrentPage() {
        return window.location.pathname.split("/").pop() || "index.html";
    }

    function normalizePage(value) {
        const clean = String(value || "").split("#")[0].split("?")[0];
        return clean.split("/").pop() || "index.html";
    }

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
            company: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 21V5l8-3 8 3v16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M9 21v-7h6v7M8 8h.01M12 8h.01M16 8h.01M8 11h.01M12 11h.01M16 11h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
        };

        return icons[name] || icons.company;
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