"use strict";

/* ==========================================================
   SKylin — Main Shared Script
   Handles:
   - SITE_CONFIG validation
   - Dynamic text/link injection
   - Shared header/footer rendering
   - Mobile menu
   - Active navigation state
   - Service cards/lists
   - FAQ accordion + FAQ JSON-LD
   - Cookie/policy banner
   - Form validation
   - Animated counters
   - Basic responsive safety
   ========================================================== */

(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing. Make sure /js/config.js loads before /js/main.js.");
        return;
    }

    const state = {
        mobileMenuOpen: false,
        lastFocusedElement: null
    };

    const selectors = {
        headerMount: "[data-site-header]",
        footerMount: "[data-site-footer]",
        policyBanner: "[data-policy-banner]"
    };

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        applyPageMeta();
        renderHeader();
        renderFooter();
        injectGlobalContent();
        renderServiceCards();
        renderServiceLists();
        renderFaqBlocks();
        renderFaqSchemaBlocks();
        renderPolicyBanner();
        initMobileMenu();
        initFaqAccordions();
        initForms();
        initCounters();
        setHeaderOffset();
        watchResize();
        preventOverflowHelpers();
    }

    /* ======================================================
       Helpers
       ====================================================== */

    function getCurrentPage() {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf("/") + 1);
        return file || "index.html";
    }

    function escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function normalizeHref(href) {
        if (!href) return "";
        return href.split("#")[0];
    }

    function isCurrentHref(href) {
        const current = getCurrentPage();
        const cleanHref = normalizeHref(href);

        if (cleanHref === current) return true;

        if (current === "index.html" && (cleanHref === "/" || cleanHref === "./")) {
            return true;
        }

        return false;
    }

    function qs(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function qsa(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }

    function createElementFromHTML(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstElementChild;
    }

    function getServiceById(serviceId) {
        return config.services.find((service) => service.id === serviceId);
    }

    function getFaqGroup(groupName) {
        if (!groupName) return config.faq.general || [];
        return config.faq[groupName] || config.faq.general || [];
    }

    function getFocusableElements(container) {
        return qsa(
            [
                "a[href]",
                "button:not([disabled])",
                "textarea:not([disabled])",
                "input:not([disabled])",
                "select:not([disabled])",
                "[tabindex]:not([tabindex='-1'])"
            ].join(","),
            container
        ).filter((element) => {
            const style = window.getComputedStyle(element);
            return style.display !== "none" && style.visibility !== "hidden";
        });
    }

    /* ======================================================
       Meta
       ====================================================== */

    function applyPageMeta() {
        const currentPage = getCurrentPage();
        const pageMeta = config.pageMeta && config.pageMeta[currentPage];

        if (!pageMeta) {
            console.warn(`No pageMeta found for ${currentPage}.`);
            return;
        }

        if (pageMeta.title) {
            document.title = pageMeta.title;
        }

        let metaDescription = qs("meta[name='description']");

        if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.setAttribute("name", "description");
            document.head.appendChild(metaDescription);
        }

        metaDescription.setAttribute("content", pageMeta.description || "");
    }

    /* ======================================================
       Header
       ====================================================== */

    function renderHeader() {
        const headerMounts = qsa(selectors.headerMount);

        if (!headerMounts.length) return;

        const navItems = config.navigation
            .map((item) => {
                const activeClass = isCurrentHref(item.href) ? " is-active" : "";

                return `
                    <a class="site-nav-link${activeClass}" href="${escapeHtml(item.href)}">
                        ${escapeHtml(item.label)}
                    </a>
                `;
            })
            .join("");

        const serviceLinks = config.services
            .map((service) => {
                const activeClass = isCurrentHref(service.href) ? " is-active" : "";

                return `
                    <a class="site-dropdown-link${activeClass}" href="${escapeHtml(service.href)}">
                        <span class="site-dropdown-icon" aria-hidden="true">${getIcon(service.icon)}</span>
                        <span>${escapeHtml(service.title)}</span>
                    </a>
                `;
            })
            .join("");

        const mobileServiceLinks = config.services
            .map((service) => {
                const activeClass = isCurrentHref(service.href) ? " is-active" : "";

                return `
                    <a class="mobile-service-link${activeClass}" href="${escapeHtml(service.href)}">
                        <span class="mobile-service-icon" aria-hidden="true">${getIcon(service.icon)}</span>
                        <span>${escapeHtml(service.title)}</span>
                    </a>
                `;
            })
            .join("");

        const legalLinks = `
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="cookie-policy.html">Cookie Policy</a>
            <a href="terms-of-service.html">Terms of Service</a>
        `;

        const headerHTML = `
            <header class="site-header" data-header>
                <a class="skip-link" href="#main">Skip to content</a>

                <div class="site-header-inner">
                    <a class="site-logo" href="index.html" aria-label="${escapeHtml(config.brand.logoLabel)}">
                        <span class="site-logo-mark" aria-hidden="true">
                            ${getIcon("logo-window")}
                        </span>
                        <span class="site-logo-text" data-logo-text>${escapeHtml(config.brand.logoText)}</span>
                    </a>

                    <nav class="site-nav" aria-label="Primary navigation">
                        ${navItems}

                        <div class="site-nav-dropdown">
                            <button class="site-nav-link site-nav-dropdown-button" type="button" aria-expanded="false">
                                Window Options
                                <span aria-hidden="true">${getIcon("chevron-down")}</span>
                            </button>

                            <div class="site-dropdown-panel">
                                ${serviceLinks}
                            </div>
                        </div>
                    </nav>

                    <div class="site-header-actions">
                        <a class="header-phone-link" href="${escapeHtml(config.phoneHref)}" aria-label="${escapeHtml(config.phoneLabel)}" data-phone-link>
                            <span aria-hidden="true">${getIcon("phone")}</span>
                            <span class="header-phone-text" data-phone-text>${escapeHtml(config.phone)}</span>
                        </a>

                        <a class="header-icon-link" href="contact.html" aria-label="Contact ${escapeHtml(config.companyName)}">
                            <span aria-hidden="true">${getIcon("mail")}</span>
                        </a>

                        <button class="mobile-menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                <div class="mobile-menu-backdrop" data-mobile-menu-backdrop hidden></div>

                <aside class="mobile-menu" id="mobileMenu" data-mobile-menu inert>
                    <div class="mobile-menu-shell">
                        <div class="mobile-menu-top">
                            <a class="site-logo mobile-menu-logo" href="index.html" aria-label="${escapeHtml(config.brand.logoLabel)}">
                                <span class="site-logo-mark" aria-hidden="true">
                                    ${getIcon("logo-window")}
                                </span>
                                <span class="site-logo-text">${escapeHtml(config.brand.logoText)}</span>
                            </a>

                            <button class="mobile-menu-close" type="button" aria-label="Close menu">
                                ${getIcon("close")}
                            </button>
                        </div>

                        <div class="mobile-menu-main">
                            <nav class="mobile-nav" aria-label="Mobile navigation">
                                ${config.navigation
                .map((item) => {
                    const activeClass = isCurrentHref(item.href) ? " is-active" : "";

                    return `
                                            <a class="mobile-nav-link${activeClass}" href="${escapeHtml(item.href)}">
                                                ${escapeHtml(item.label)}
                                            </a>
                                        `;
                })
                .join("")}
                            </nav>

                            <div class="mobile-menu-services">
                                <p class="mobile-menu-label">Window categories</p>
                                <div class="mobile-service-list" data-mobile-services-list>
                                    ${mobileServiceLinks}
                                </div>
                            </div>

                            <div class="mobile-menu-contact">
                                <a class="mobile-contact-card" href="${escapeHtml(config.phoneHref)}" data-phone-link>
                                    <span aria-hidden="true">${getIcon("phone")}</span>
                                    <span>
                                        <strong>Call</strong>
                                        <small data-phone-text>${escapeHtml(config.phone)}</small>
                                    </span>
                                </a>

                                <a class="mobile-contact-card" href="mailto:${escapeHtml(config.email)}" data-email-link>
                                    <span aria-hidden="true">${getIcon("mail")}</span>
                                    <span>
                                        <strong>Email</strong>
                                        <small data-email-text>${escapeHtml(config.email)}</small>
                                    </span>
                                </a>
                            </div>

                            <div class="mobile-menu-legal">
                                ${legalLinks}
                            </div>
                        </div>
                    </div>
                </aside>
            </header>
        `;

        headerMounts.forEach((mount) => {
            mount.innerHTML = headerHTML;
        });
    }

    /* ======================================================
       Footer
       ====================================================== */

    function renderFooter() {
        const footerMounts = qsa(selectors.footerMount);

        if (!footerMounts.length) return;

        const serviceLinks = config.services
            .map((service) => {
                return `
                    <li>
                        <a href="${escapeHtml(service.href)}">${escapeHtml(service.title)}</a>
                    </li>
                `;
            })
            .join("");

        const navLinks = config.navigation
            .map((item) => {
                return `
                    <li>
                        <a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>
                    </li>
                `;
            })
            .join("");

        const footerHTML = `
            <footer class="site-footer">
                <div class="container-wide">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <a class="site-logo footer-logo" href="index.html" aria-label="${escapeHtml(config.brand.logoLabel)}">
                                <span class="site-logo-mark" aria-hidden="true">
                                    ${getIcon("logo-window")}
                                </span>
                                <span class="site-logo-text" data-logo-text>${escapeHtml(config.brand.logoText)}</span>
                            </a>

                            <p data-footer-text>${escapeHtml(config.footerText)}</p>

                            <p class="footer-company-id">
                                Company ID:
                                <span data-company-id>${escapeHtml(config.companyId)}</span>
                            </p>
                        </div>

                        <div class="footer-column">
                            <h2>Services</h2>
                            <ul>
                                ${serviceLinks}
                            </ul>
                        </div>

                        <div class="footer-column">
                            <h2>Platform</h2>
                            <ul>
                                ${navLinks}
                                <li><a href="services.html#provider-comparison">Provider Comparison</a></li>
                                <li><a href="contact.html#faq">FAQ</a></li>
                            </ul>
                        </div>

                        <div class="footer-column">
                            <h2>Company</h2>
                            <ul>
                                <li><a href="about.html">About</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="cookie-policy.html">Cookie Policy</a></li>
                                <li><a href="terms-of-service.html">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div class="footer-column footer-contact">
                            <h2>Contact</h2>

                            <ul>
                                <li>
                                    <a href="${escapeHtml(config.phoneHref)}" data-phone-link>
                                        <span aria-hidden="true">${getIcon("phone")}</span>
                                        <span data-phone-text>${escapeHtml(config.phone)}</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="mailto:${escapeHtml(config.email)}" data-email-link>
                                        <span aria-hidden="true">${getIcon("mail")}</span>
                                        <span data-email-text>${escapeHtml(config.email)}</span>
                                    </a>
                                </li>

                                <li>
                                    <span aria-hidden="true">${getIcon("map-pin")}</span>
                                    <span data-address-text>${escapeHtml(config.address.full)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <p>
                            © <span data-current-year></span>
                            <span data-company-name>${escapeHtml(config.companyName)}</span>.
                            All rights reserved.
                        </p>

                        <p>
                            Service Area:
                            <span data-service-area>${escapeHtml(config.serviceArea)}</span>
                        </p>
                    </div>

                    <p class="footer-disclaimer" data-disclaimer>
                        ${escapeHtml(config.disclaimer)}
                    </p>
                </div>
            </footer>
        `;

        footerMounts.forEach((mount) => {
            mount.innerHTML = footerHTML;
        });

        qsa("[data-current-year]").forEach((element) => {
            element.textContent = new Date().getFullYear();
        });
    }

    /* ======================================================
       Global dynamic content injection
       ====================================================== */

    function injectGlobalContent() {
        const injections = [
            ["[data-company-name]", config.companyName],
            ["[data-company-id]", config.companyId],
            ["[data-brand-name]", config.brand.shortName],
            ["[data-logo-text]", config.brand.logoText],
            ["[data-phone-text]", config.phone],
            ["[data-phone-label]", config.phoneLabel],
            ["[data-email-text]", config.email],
            ["[data-address-text]", config.address.full],
            ["[data-service-area]", config.serviceArea],
            ["[data-footer-text]", config.footerText],
            ["[data-disclaimer]", config.disclaimer],
            ["[data-legal-notice]", config.legalNotice]
        ];

        injections.forEach(([selector, value]) => {
            qsa(selector).forEach((element) => {
                element.textContent = value;
            });
        });

        qsa("[data-phone-link]").forEach((element) => {
            element.setAttribute("href", config.phoneHref);
            element.setAttribute("aria-label", config.phoneLabel);
        });

        qsa("[data-email-link]").forEach((element) => {
            element.setAttribute("href", `mailto:${config.email}`);
            element.setAttribute("aria-label", `Email ${config.companyName}`);
        });

        qsa("[data-address-link]").forEach((element) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address.full)}`;
            element.setAttribute("href", mapsUrl);
            element.setAttribute("target", "_blank");
            element.setAttribute("rel", "noopener");
        });
    }

    /* ======================================================
       Services
       ====================================================== */

    function renderServiceCards() {
        qsa("[data-service-cards]").forEach((mount) => {
            const variant = mount.getAttribute("data-service-cards") || "default";

            mount.innerHTML = config.services
                .map((service) => {
                    if (variant === "compact") {
                        return createCompactServiceCard(service);
                    }

                    if (variant === "editorial") {
                        return createEditorialServiceCard(service);
                    }

                    return createPhotoServiceCard(service);
                })
                .join("");
        });
    }

    function createPhotoServiceCard(service) {
        return `
            <a class="service-photo-card" href="${escapeHtml(service.href)}" style="--service-image: url('${escapeHtml(service.image)}');">
                <span class="service-photo-card-icon" aria-hidden="true">
                    ${getIcon(service.icon)}
                </span>

                <span class="service-photo-card-content">
                    <strong>${escapeHtml(service.title)}</strong>
                    <small>${escapeHtml(service.cardText || service.summary)}</small>
                </span>

                <span class="service-photo-card-line" aria-hidden="true"></span>
            </a>
        `;
    }

    function createCompactServiceCard(service) {
        return `
            <a class="service-compact-card" href="${escapeHtml(service.href)}">
                <span class="service-compact-icon" aria-hidden="true">
                    ${getIcon(service.icon)}
                </span>

                <span>
                    <strong>${escapeHtml(service.title)}</strong>
                    <small>${escapeHtml(service.summary)}</small>
                </span>
            </a>
        `;
    }

    function createEditorialServiceCard(service) {
        return `
            <article class="service-editorial-card">
                <a class="service-editorial-image" href="${escapeHtml(service.href)}">
                    <img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title)} provider comparison" loading="lazy">
                </a>

                <div class="service-editorial-content">
                    <span class="eyebrow">Window category</span>
                    <h2>
                        <a href="${escapeHtml(service.href)}">${escapeHtml(service.title)}</a>
                    </h2>
                    <p>${escapeHtml(service.summary)}</p>
                    <a class="text-link" href="${escapeHtml(service.href)}">
                        Learn more
                        <span aria-hidden="true">→</span>
                    </a>
                </div>
            </article>
        `;
    }

    function renderServiceLists() {
        qsa("[data-service-list]").forEach((mount) => {
            const variant = mount.getAttribute("data-service-list") || "links";

            if (variant === "select") {
                mount.innerHTML = config.services
                    .map((service) => {
                        return `<option value="${escapeHtml(service.id)}">${escapeHtml(service.title)}</option>`;
                    })
                    .join("");
                return;
            }

            mount.innerHTML = config.services
                .map((service) => {
                    return `
                        <a class="service-list-link" href="${escapeHtml(service.href)}">
                            <span aria-hidden="true">${getIcon(service.icon)}</span>
                            <span>${escapeHtml(service.title)}</span>
                        </a>
                    `;
                })
                .join("");
        });
    }

    /* ======================================================
       FAQ
       ====================================================== */

    function renderFaqBlocks() {
        qsa("[data-faq-list]").forEach((mount) => {
            const groupName = mount.getAttribute("data-faq-list") || "general";
            const items = getFaqGroup(groupName);

            mount.innerHTML = items
                .map((item, index) => createFaqItem(item, index, groupName))
                .join("");
        });
    }

    function createFaqItem(item, index, groupName) {
        const buttonId = `faq-${groupName}-${index}-button`;
        const panelId = `faq-${groupName}-${index}-panel`;

        return `
            <div class="faq-item">
                <h3 class="faq-heading">
                    <button class="faq-button" id="${buttonId}" type="button" aria-expanded="false" aria-controls="${panelId}">
                        <span>${escapeHtml(item.question)}</span>
                        <span class="faq-icon" aria-hidden="true"></span>
                    </button>
                </h3>

                <div class="faq-panel" id="${panelId}" role="region" aria-labelledby="${buttonId}" hidden>
                    <div class="faq-panel-inner">
                        <p>${escapeHtml(item.answer)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function initFaqAccordions() {
        qsa(".faq-button").forEach((button) => {
            button.addEventListener("click", () => {
                const panelId = button.getAttribute("aria-controls");
                const panel = document.getElementById(panelId);

                if (!panel) return;

                const isOpen = button.getAttribute("aria-expanded") === "true";

                button.setAttribute("aria-expanded", String(!isOpen));
                panel.hidden = isOpen;

                if (!isOpen) {
                    panel.style.maxHeight = `${panel.scrollHeight}px`;
                } else {
                    panel.style.maxHeight = "0px";
                }
            });
        });
    }

    function renderFaqSchemaBlocks() {
        qsa("[data-faq-schema]").forEach((mount) => {
            const groupName = mount.getAttribute("data-faq-schema") || "general";
            const items = getFaqGroup(groupName);

            if (!items.length) return;

            const schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: items.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.answer
                    }
                }))
            };

            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(schema);

            mount.innerHTML = "";
            mount.appendChild(script);
        });
    }

    /* ======================================================
       Cookie / policy banner
       ====================================================== */

    function renderPolicyBanner() {
        const mount = qs(selectors.policyBanner);
        const bannerConfig = config.cookieBanner;

        if (!mount || !bannerConfig) return;

        const savedChoice = localStorage.getItem(bannerConfig.storageKey);

        if (savedChoice) {
            mount.remove();
            return;
        }

        const links = bannerConfig.links
            .map((link) => {
                return `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`;
            })
            .join("");

        mount.innerHTML = `
            <div class="policy-banner" role="dialog" aria-live="polite" aria-label="${escapeHtml(bannerConfig.title)}">
                <div class="policy-banner-content">
                    <strong>${escapeHtml(bannerConfig.title)}</strong>
                    <p>${escapeHtml(bannerConfig.text)}</p>
                    <div class="policy-banner-links">
                        ${links}
                    </div>
                </div>

                <div class="policy-banner-actions">
                    <button class="button button-secondary" type="button" data-policy-choice="decline">
                        ${escapeHtml(bannerConfig.decline)}
                    </button>

                    <button class="button button-primary" type="button" data-policy-choice="accept">
                        ${escapeHtml(bannerConfig.accept)}
                    </button>
                </div>
            </div>
        `;

        qsa("[data-policy-choice]", mount).forEach((button) => {
            button.addEventListener("click", () => {
                const choice = button.getAttribute("data-policy-choice");
                localStorage.setItem(bannerConfig.storageKey, choice || "selected");
                mount.remove();
            });
        });
    }

    /* ======================================================
       Mobile menu
       ====================================================== */

    function initMobileMenu() {
        const toggle = qs(".mobile-menu-toggle");
        const closeButton = qs(".mobile-menu-close");
        const menu = qs("[data-mobile-menu]");
        const backdrop = qs("[data-mobile-menu-backdrop]");

        if (!toggle || !menu || !backdrop) return;

        toggle.addEventListener("click", openMobileMenu);

        if (closeButton) {
            closeButton.addEventListener("click", closeMobileMenu);
        }

        backdrop.addEventListener("click", closeMobileMenu);

        qsa("a", menu).forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (!state.mobileMenuOpen) return;

            if (event.key === "Escape") {
                closeMobileMenu();
                return;
            }

            if (event.key === "Tab") {
                trapFocus(event, menu);
            }
        });
    }

    function openMobileMenu() {
        const toggle = qs(".mobile-menu-toggle");
        const menu = qs("[data-mobile-menu]");
        const backdrop = qs("[data-mobile-menu-backdrop]");
        const closeButton = qs(".mobile-menu-close");

        if (!toggle || !menu || !backdrop) return;

        state.lastFocusedElement = document.activeElement;
        state.mobileMenuOpen = true;

        document.body.classList.add("menu-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");

        backdrop.hidden = false;
        menu.removeAttribute("inert");

        requestAnimationFrame(() => {
            menu.classList.add("is-open");
            backdrop.classList.add("is-visible");
        });

        if (closeButton) {
            setTimeout(() => closeButton.focus(), 40);
        }
    }

    function closeMobileMenu() {
        const toggle = qs(".mobile-menu-toggle");
        const menu = qs("[data-mobile-menu]");
        const backdrop = qs("[data-mobile-menu-backdrop]");

        if (!toggle || !menu || !backdrop) return;

        state.mobileMenuOpen = false;

        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");

        menu.classList.remove("is-open");
        backdrop.classList.remove("is-visible");
        menu.setAttribute("inert", "");

        setTimeout(() => {
            if (!state.mobileMenuOpen) {
                backdrop.hidden = true;
            }
        }, 260);

        if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
            state.lastFocusedElement.focus();
        }
    }

    function trapFocus(event, container) {
        const focusable = getFocusableElements(container);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ======================================================
       Forms
       ====================================================== */

    function initForms() {
        qsa("[data-skylin-form]").forEach((form) => {
            form.setAttribute("novalidate", "");

            form.addEventListener("submit", (event) => {
                event.preventDefault();

                const isValid = validateForm(form);

                if (!isValid) return;

                showFormSuccess(form);
            });

            qsa("input, select, textarea", form).forEach((field) => {
                field.addEventListener("input", () => clearFieldError(field));
                field.addEventListener("change", () => clearFieldError(field));
            });
        });
    }

    function validateForm(form) {
        let isValid = true;

        qsa("[required]", form).forEach((field) => {
            const type = field.getAttribute("type");
            const value = String(field.value || "").trim();

            if (type === "checkbox") {
                if (!field.checked) {
                    setFieldError(field, "This field is required.");
                    isValid = false;
                }
                return;
            }

            if (!value) {
                setFieldError(field, "This field is required.");
                isValid = false;
                return;
            }

            if (type === "email" && !isValidEmail(value)) {
                setFieldError(field, "Please enter a valid email address.");
                isValid = false;
            }
        });

        const status = qs("[data-form-status]", form);

        if (status && !isValid) {
            status.textContent = config.forms.contact.errorMessage;
            status.classList.add("is-error");
            status.classList.remove("is-success");
        }

        return isValid;
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function setFieldError(field, message) {
        const wrapper = field.closest(".form-field") || field.closest(".checkbox-field");

        field.setAttribute("aria-invalid", "true");

        if (wrapper) {
            wrapper.classList.add("has-error");

            let error = qs(".field-error", wrapper);

            if (!error) {
                error = document.createElement("small");
                error.className = "field-error";
                wrapper.appendChild(error);
            }

            error.textContent = message;
        }
    }

    function clearFieldError(field) {
        const wrapper = field.closest(".form-field") || field.closest(".checkbox-field");

        field.removeAttribute("aria-invalid");

        if (wrapper) {
            wrapper.classList.remove("has-error");

            const error = qs(".field-error", wrapper);

            if (error) {
                error.textContent = "";
            }
        }

        const form = field.closest("form");
        const status = form ? qs("[data-form-status]", form) : null;

        if (status) {
            status.textContent = "";
            status.classList.remove("is-error", "is-success");
        }
    }

    function showFormSuccess(form) {
        const status = qs("[data-form-status]", form);

        if (status) {
            status.textContent = config.forms.contact.successMessage;
            status.classList.add("is-success");
            status.classList.remove("is-error");
        }

        form.reset();

        qsa("[aria-invalid]", form).forEach((field) => {
            field.removeAttribute("aria-invalid");
        });

        qsa(".has-error", form).forEach((element) => {
            element.classList.remove("has-error");
        });

        qsa(".field-error", form).forEach((element) => {
            element.textContent = "";
        });
    }

    /* ======================================================
       Counters
       ====================================================== */

    function initCounters() {
        const counters = qsa("[data-count-to]");

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
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;

            element.textContent = value.toFixed(decimals);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toFixed(decimals);
            }
        }

        requestAnimationFrame(update);
    }

    /* ======================================================
       Header offset / resize
       ====================================================== */

    function setHeaderOffset() {
        const header = qs("[data-header]");

        if (!header) return;

        const height = header.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
    }

    function watchResize() {
        window.addEventListener("resize", () => {
            setHeaderOffset();

            if (window.innerWidth >= 1024 && state.mobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    function preventOverflowHelpers() {
        document.documentElement.classList.add("js-ready");

        qsa("img").forEach((image) => {
            image.addEventListener("error", () => {
                image.classList.add("image-missing");
                console.warn("Missing image:", image.getAttribute("src"));
            });
        });
    }

    /* ======================================================
       Icons
       ====================================================== */

    function getIcon(name) {
        const icons = {
            "logo-window": `
                <svg viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2H18L22 6L26 2H42V30H26L22 26L18 30H2V2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M18 3V29" stroke="currentColor" stroke-width="1.6"/>
                    <path d="M26 3V29" stroke="currentColor" stroke-width="1.6"/>
                    <path d="M6 8H15" stroke="currentColor" stroke-width="1.4"/>
                    <path d="M29 8H38" stroke="currentColor" stroke-width="1.4"/>
                </svg>
            `,

            "window-frame": `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 3H20V21H4V3Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M12 3V21" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M4 12H20" stroke="currentColor" stroke-width="1.7"/>
                </svg>
            `,

            replace: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 4H14V14H4V4Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M10 10H20V20H10V10Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M16.5 4.5H19.5V7.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.5 4.5L15 9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            tool: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14.5 5.2C15.8 3.9 17.8 3.6 19.4 4.4L16.6 7.2L16.8 9.2L18.8 9.4L21.6 6.6C22.4 8.2 22.1 10.2 20.8 11.5C19.6 12.7 17.9 13.1 16.4 12.7L8.2 20.9C7.4 21.7 6.1 21.7 5.3 20.9L3.1 18.7C2.3 17.9 2.3 16.6 3.1 15.8L11.3 7.6C10.9 6.1 11.3 4.4 12.5 3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            "leaf-window": `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 3H14V13H4V3Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M9 3V13" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M4 8H14" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M16 20C20.2 18.8 21 15.1 20.8 11.2C17 11.2 14.2 12.8 13.5 16.1C13.1 18 14.1 19.4 16 20Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M13.8 19.8C15.2 17.5 17.1 15.8 20.2 14.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            phone: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8.1 4.5L10 8.8L8.7 10.1C9.7 12.2 11.8 14.3 13.9 15.3L15.2 14L19.5 15.9V19.2C19.5 20.1 18.8 20.8 17.9 20.8C9.8 20.8 3.2 14.2 3.2 6.1C3.2 5.2 3.9 4.5 4.8 4.5H8.1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            mail: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3.5 6.5H20.5V18H3.5V6.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M4 7L12 13L20 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            "map-pin": `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21C12 21 18 15.4 18 9.8C18 6.5 15.3 4 12 4C8.7 4 6 6.5 6 9.8C6 15.4 12 21 12 21Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M12 12.2C13.2 12.2 14.2 11.2 14.2 10C14.2 8.8 13.2 7.8 12 7.8C10.8 7.8 9.8 8.8 9.8 10C9.8 11.2 10.8 12.2 12 12.2Z" stroke="currentColor" stroke-width="1.7"/>
                </svg>
            `,

            timer: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21C16.4 21 20 17.4 20 13C20 8.6 16.4 5 12 5C7.6 5 4 8.6 4 13C4 17.4 7.6 21 12 21Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M9 2.8H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    <path d="M12 9V13L15 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            "clipboard-check": `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 4H16L17 6H20V21H4V6H7L8 4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.5 13L11 15.5L15.8 10.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            target: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21C17 21 21 17 21 12C21 7 17 3 12 3C7 3 3 7 3 12C3 17 7 21 12 21Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16Z" stroke="currentColor" stroke-width="1.7"/>
                    <path d="M12 12H21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
            `,

            "badge-check": `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3L14.2 5.1L17.2 4.8L18 7.8L20.6 9.4L19.4 12L20.6 14.6L18 16.2L17.2 19.2L14.2 18.9L12 21L9.8 18.9L6.8 19.2L6 16.2L3.4 14.6L4.6 12L3.4 9.4L6 7.8L6.8 4.8L9.8 5.1L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                    <path d="M8.8 12L11 14.2L15.4 9.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            "chevron-down": `
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,

            close: `
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            `
        };

        return icons[name] || icons["window-frame"];
    }
})();