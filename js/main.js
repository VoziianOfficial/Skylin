"use strict";

/* ==========================================================
   Skylin — Global Main Script
   Shared dynamic content, header, footer, mobile menu,
   FAQ, forms, cookie banner, counters, meta injection.
   ========================================================== */

(function () {
    const config = window.SITE_CONFIG;

    if (!config) {
        console.error("SITE_CONFIG is missing. Make sure /js/config.js loads before /js/main.js.");
        return;
    }

    document.addEventListener("DOMContentLoaded", initSite);

    function initSite() {
        applyPageMeta();
        renderHeader();
        renderFooter();
        injectDynamicContent();
        renderServiceCards();
        renderServiceLists();
        renderFaqBlocks();
        renderFaqSchema();
        renderPolicyBanner();
        renderFormModules();
        initMobileMenu();
        initHeaderScroll();
        initFaqAccordions();
        initForms();
        initCounters();
        preventEmptyLinks();
        document.documentElement.classList.add("site-ready");
    }

    /* ========================================================
       Page Meta
       ======================================================== */

    function applyPageMeta() {
        const page = getCurrentPage();
        const meta = config.pageMeta && config.pageMeta[page];

        if (!meta) return;

        if (meta.title) {
            document.title = meta.title;
        }

        if (meta.description) {
            let description = document.querySelector('meta[name="description"]');

            if (!description) {
                description = document.createElement("meta");
                description.setAttribute("name", "description");
                document.head.appendChild(description);
            }

            description.setAttribute("content", meta.description);
        }
    }

    /* ========================================================
       Header
       ======================================================== */

    function renderHeader() {
        const mounts = document.querySelectorAll("[data-site-header]");
        if (!mounts.length) return;

        mounts.forEach((mount) => {
            mount.innerHTML = `
        <header class="site-header" data-header>
          <div class="container-wide site-header-inner">
            <a class="site-logo" href="index.html" aria-label="${escapeHtml(config.brand.logoLabel || config.companyName)}">
              ${renderLogoMark()}
              <span class="site-logo-text" data-logo-text>${escapeHtml(config.brand.logoText || config.companyName)}</span>
            </a>

            <nav class="desktop-nav" aria-label="Primary navigation">
              ${renderDesktopNav()}
            </nav>

            <div class="header-actions">
              <a class="header-phone" href="${escapeAttr(config.phoneHref)}" aria-label="${escapeAttr(config.phoneLabel)}" data-phone-link>
                ${icon("phone")}
                <span data-phone-text>${escapeHtml(config.phoneButtonText || config.phone)}</span>
              </a>

              <a class="btn header-contact" href="contact.html">
                Contact <span data-company-name>${escapeHtml(config.companyName)}</span>
              </a>

              <button class="mobile-toggle" type="button" aria-label="Open menu" aria-controls="mobileMenu" aria-expanded="false" data-mobile-open>
                <span class="mobile-toggle-lines" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </header>

        <div class="mobile-menu-backdrop" data-mobile-backdrop></div>

        <aside class="mobile-menu" id="mobileMenu" data-mobile-menu inert>
          <div class="mobile-menu-header">
            <a class="site-logo" href="index.html" aria-label="${escapeHtml(config.brand.logoLabel || config.companyName)}">
              ${renderLogoMark()}
              <span class="site-logo-text" data-logo-text>${escapeHtml(config.brand.logoText || config.companyName)}</span>
            </a>

            <button class="mobile-menu-close" type="button" aria-label="Close menu" data-mobile-close>
              ${icon("x")}
            </button>
          </div>

          <div class="mobile-menu-body">
            <nav class="mobile-nav" aria-label="Mobile navigation">
              ${renderMobileNav()}
            </nav>
          </div>

          <div class="mobile-menu-footer">
            <a class="btn" href="contact.html">
              Request Provider Matches <span class="arrow">→</span>
            </a>

            <div class="mobile-contact-lines">
              <a href="${escapeAttr(config.phoneHref)}" data-phone-link data-phone-text>${escapeHtml(config.phone)}</a>
              <a href="mailto:${escapeAttr(config.email)}" data-email-link data-email-text>${escapeHtml(config.email)}</a>
              <span data-service-area>${escapeHtml(config.serviceArea)}</span>
            </div>
          </div>
        </aside>
      `;
        });

        markActiveNav();
    }

    function renderDesktopNav() {
        if (!Array.isArray(config.navigation)) return "";

        return config.navigation
            .map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length;

                if (!hasChildren) {
                    return `
            <div class="nav-item">
              <a class="nav-link" href="${escapeAttr(item.href)}" data-nav-link="${escapeAttr(normalizePageRef(item.href))}">
                ${escapeHtml(item.label)}
              </a>
            </div>
          `;
                }

                return `
          <div class="nav-item">
            <a class="nav-link" href="${escapeAttr(item.href)}" data-nav-link="${escapeAttr(normalizePageRef(item.href))}">
              ${escapeHtml(item.label)}
              ${chevronDown()}
            </a>

            <div class="nav-dropdown">
              ${item.children
                        .map((child) => {
                            return `
                    <a href="${escapeAttr(child.href)}" data-nav-link="${escapeAttr(normalizePageRef(child.href))}">
                      ${escapeHtml(child.label)}
                    </a>
                  `;
                        })
                        .join("")}
            </div>
          </div>
        `;
            })
            .join("");
    }

    function renderMobileNav() {
        if (!Array.isArray(config.navigation)) return "";

        return config.navigation
            .map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length;

                return `
          <div class="mobile-nav-group">
            <a class="mobile-nav-link" href="${escapeAttr(item.href)}" data-mobile-link data-nav-link="${escapeAttr(normalizePageRef(item.href))}">
              <span>${escapeHtml(item.label)}</span>
            </a>

            ${hasChildren
                        ? `
                  <div class="mobile-subnav" data-mobile-services-list>
                    ${item.children
                            .map((child) => {
                                return `
                          <a class="mobile-subnav-link" href="${escapeAttr(child.href)}" data-mobile-link data-nav-link="${escapeAttr(normalizePageRef(child.href))}">
                            <span>${escapeHtml(child.label)}</span>
                          </a>
                        `;
                            })
                            .join("")}
                  </div>
                `
                        : ""
                    }
          </div>
        `;
            })
            .join("");
    }

    function markActiveNav() {
        const page = getCurrentPage();

        document.querySelectorAll("[data-nav-link]").forEach((link) => {
            const target = normalizePageRef(link.getAttribute("data-nav-link") || link.getAttribute("href") || "");

            if (target === page) {
                link.classList.add("is-active");
            }

            if (page !== "index.html" && target === "services.html" && isServicePage(page)) {
                link.classList.add("is-active");
            }
        });
    }

    /* ========================================================
       Footer
       ======================================================== */

    function renderFooter() {
        const mounts = document.querySelectorAll("[data-site-footer]");
        if (!mounts.length) return;

        mounts.forEach((mount) => {
            mount.innerHTML = `
        <footer class="site-footer">
          <div class="footer-inner container-wide">
            <div class="footer-main">
              <div class="footer-brand">
                <a class="site-logo" href="index.html" aria-label="${escapeHtml(config.brand.logoLabel || config.companyName)}">
                  ${renderLogoMark()}
                  <span class="site-logo-text" data-logo-text>${escapeHtml(config.brand.logoText || config.companyName)}</span>
                </a>

                <p data-footer-text>${escapeHtml(config.footerText)}</p>

                <div class="footer-contact">
                  <div class="contact-line">
                    ${icon("phone")}
                    <a href="${escapeAttr(config.phoneHref)}" data-phone-link data-phone-text>${escapeHtml(config.phone)}</a>
                  </div>

                  <div class="contact-line">
                    ${icon("mail")}
                    <a href="mailto:${escapeAttr(config.email)}" data-email-link data-email-text>${escapeHtml(config.email)}</a>
                  </div>

                  <div class="contact-line">
                    ${icon("map")}
                    <span data-address-text>${escapeHtml(config.address.full)}</span>
                  </div>
                </div>
              </div>

              <div class="footer-column">
                <h3>Window Options</h3>
                <div class="footer-links">
                  ${config.services
                    .map((service) => {
                        return `<a href="${escapeAttr(service.href)}">${escapeHtml(service.title)}</a>`;
                    })
                    .join("")}
                </div>
              </div>

              <div class="footer-column">
                <h3>Platform</h3>
                <div class="footer-links">
                  <a href="index.html#how-it-works">How It Works</a>
                  <a href="about.html">About Platform</a>
                  <a href="services.html">Window Options</a>
                  <a href="contact.html">Contact</a>
                </div>
              </div>

              <div class="footer-column">
                <h3>Legal</h3>
                <div class="footer-links">
                  ${config.legalLinks
                    .map((link) => {
                        return `<a href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`;
                    })
                    .join("")}
                </div>
              </div>

              <div class="footer-column">
                <h3>Company</h3>
                <div class="footer-links">
                  <span data-company-id>${escapeHtml(config.companyId)}</span>
                  <span data-service-area>${escapeHtml(config.serviceArea)}</span>
                </div>
              </div>
            </div>

            <div class="footer-bottom">
              <p class="footer-disclaimer" data-disclaimer>${escapeHtml(config.disclaimer)}</p>

              <div class="footer-meta">
                <span>© <span data-current-year>${new Date().getFullYear()}</span> <span data-company-name>${escapeHtml(config.companyName)}</span>. All rights reserved.</span>
                <span data-legal-notice>${escapeHtml(config.legalNotice)}</span>
              </div>
            </div>
          </div>
        </footer>
      `;
        });
    }

    /* ========================================================
       Dynamic Content Injection
       ======================================================== */

    function injectDynamicContent() {
        setText("[data-company-name]", config.companyName);
        setText("[data-company-id]", config.companyId);
        setText("[data-brand-name]", config.brand.shortName || config.companyName);
        setText("[data-logo-text]", config.brand.logoText || config.companyName);
        setText("[data-phone-text]", config.phone);
        setText("[data-phone-label]", config.phoneLabel);
        setText("[data-email-text]", config.email);
        setText("[data-address-text]", config.address.full);
        setText("[data-service-area]", config.serviceArea);
        setText("[data-footer-text]", config.footerText);
        setText("[data-disclaimer]", config.disclaimer);
        setText("[data-legal-notice]", config.legalNotice);
        setText("[data-current-year]", String(new Date().getFullYear()));

        document.querySelectorAll("[data-phone-link]").forEach((link) => {
            link.setAttribute("href", config.phoneHref);
            if (config.phoneLabel) {
                link.setAttribute("aria-label", config.phoneLabel);
            }
        });

        document.querySelectorAll("[data-email-link]").forEach((link) => {
            link.setAttribute("href", `mailto:${config.email}`);
        });

        document.querySelectorAll("[data-company-logo]").forEach((img) => {
            if (config.assets && config.assets.logo) {
                img.setAttribute("src", config.assets.logo);
                img.setAttribute("alt", `${config.companyName} logo`);
            }
        });
    }

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = value || "";
        });
    }

    /* ========================================================
       Services
       ======================================================== */

    function renderServiceCards() {
        document.querySelectorAll("[data-service-cards]").forEach((mount) => {
            const variant = mount.getAttribute("data-service-cards") || "default";
            const services = getServicesForMount(mount);

            mount.innerHTML = services
                .map((service, index) => renderServiceCard(service, index, variant))
                .join("");
        });
    }

    function renderServiceCard(service, index, variant) {
        const image = service.image || "";
        const text = service.cardText || service.summary || "";
        const title = service.title || "";
        const href = service.href || "#";

        return `
      <a class="service-card service-card-${escapeAttr(variant)}" href="${escapeAttr(href)}" style="--service-image: url('${escapeAttr(image)}');">
        <span class="service-card-top">
          <span class="icon-box" aria-hidden="true">${serviceIcon(service.icon)}</span>
          <span class="service-card-index">${String(index + 1).padStart(2, "0")}</span>
        </span>

        <span class="service-card-inner">
          <span class="photo-card-kicker">${escapeHtml(service.kicker || "Window Option")}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(text)}</p>
          <span class="text-link">Explore</span>
        </span>
      </a>
    `;
    }

    function renderServiceLists() {
        document.querySelectorAll("[data-service-list]").forEach((mount) => {
            const layout = mount.getAttribute("data-service-list") || "links";

            if (layout === "compact") {
                mount.innerHTML = config.services
                    .map((service) => {
                        return `
              <a class="service-list-compact-link" href="${escapeAttr(service.href)}">
                <span class="icon-box">${serviceIcon(service.icon)}</span>
                <span>
                  <strong>${escapeHtml(service.title)}</strong>
                  <small>${escapeHtml(service.summary)}</small>
                </span>
              </a>
            `;
                    })
                    .join("");
                return;
            }

            mount.innerHTML = config.services
                .map((service) => {
                    return `<a href="${escapeAttr(service.href)}">${escapeHtml(service.title)}</a>`;
                })
                .join("");
        });
    }

    function getServicesForMount(mount) {
        const filter = mount.getAttribute("data-service-filter");
        if (!filter) return config.services || [];

        const ids = filter
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        return (config.services || []).filter((service) => ids.includes(service.id));
    }

    function getServiceByPage() {
        const page = getCurrentPage();
        return (config.services || []).find((service) => normalizePageRef(service.href) === page);
    }

    function isServicePage(page) {
        return (config.services || []).some((service) => normalizePageRef(service.href) === page);
    }

    /* ========================================================
       FAQ
       ======================================================== */

    function renderFaqBlocks() {
        document.querySelectorAll("[data-faq-list]").forEach((mount) => {
            const key = mount.getAttribute("data-faq-list") || "home";
            const items = getFaqItems(key);

            mount.innerHTML = items
                .map((item, index) => {
                    const id = `faq-${key}-${index + 1}`;

                    return `
            <article class="faq-item">
              <button class="faq-button" type="button" aria-expanded="false" aria-controls="${escapeAttr(id)}">
                <span>${escapeHtml(item.question)}</span>
                <span class="faq-icon" aria-hidden="true"></span>
              </button>

              <div class="faq-panel" id="${escapeAttr(id)}">
                <div class="faq-panel-inner">
                  <p>${escapeHtml(item.answer)}</p>
                </div>
              </div>
            </article>
          `;
                })
                .join("");
        });
    }

    function initFaqAccordions() {
        document.querySelectorAll(".faq-item").forEach((item) => {
            const button = item.querySelector(".faq-button");
            if (!button) return;

            button.addEventListener("click", () => {
                const isOpen = item.classList.contains("is-open");

                item.classList.toggle("is-open", !isOpen);
                button.setAttribute("aria-expanded", String(!isOpen));
            });
        });
    }

    function renderFaqSchema() {
        document.querySelectorAll("[data-faq-schema]").forEach((mount) => {
            const key = mount.getAttribute("data-faq-schema") || mount.getAttribute("data-faq-list") || "home";
            const items = getFaqItems(key);

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

            let script = document.querySelector(`script[data-generated-faq-schema="${key}"]`);

            if (!script) {
                script = document.createElement("script");
                script.type = "application/ld+json";
                script.setAttribute("data-generated-faq-schema", key);
                document.head.appendChild(script);
            }

            script.textContent = JSON.stringify(schema);
            mount.setAttribute("aria-hidden", "true");
        });
    }

    function getFaqItems(key) {
        const service = getServiceByPage();

        if (key === "service" && service) {
            return [
                {
                    question: `Does ${config.companyName} provide ${service.title.toLowerCase()} directly?`,
                    answer:
                        `${config.companyName} does not perform window work directly. The platform helps homeowners organize requests and compare independent provider options.`
                },
                {
                    question: "What should I verify with a provider?",
                    answer:
                        "Verify licensing, insurance, quote details, project timeline, warranty terms, materials, product documentation, and provider credentials directly."
                },
                {
                    question: "Does provider availability vary?",
                    answer:
                        "Yes. Availability can vary by ZIP code, service category, provider schedule, and project scope."
                },
                {
                    question: "Can I compare more than one option?",
                    answer:
                        "Yes. Skylin is designed to help homeowners compare independent provider options before deciding how to move forward."
                }
            ];
        }

        if (config.faq && Array.isArray(config.faq[key])) {
            return config.faq[key];
        }

        return (config.faq && config.faq.home) || [];
    }

    /* ========================================================
       Forms
       ======================================================== */

    function renderFormModules() {
        document.querySelectorAll("[data-form-module]").forEach((mount) => {
            const key = mount.getAttribute("data-form-module") || "default";
            const formConfig = getFormConfig(key);

            mount.innerHTML = `
        <div class="form-module">
          <div class="form-inner">
            <div class="form-heading">
              <span class="section-kicker">Provider Matching</span>
              <h2>${escapeHtml(formConfig.title)}</h2>
              <p>${escapeHtml(formConfig.intro)}</p>
            </div>

            ${renderRequestForm(key)}
          </div>
        </div>
      `;
        });
    }

    function renderRequestForm(key) {
        const formConfig = getFormConfig(key);

        return `
      <form class="request-form" data-request-form novalidate>
        <div class="form-grid">
          <div class="form-field">
            <label for="${escapeAttr(key)}-name">${escapeHtml(formConfig.nameLabel)}</label>
            <input id="${escapeAttr(key)}-name" name="name" type="text" autocomplete="name" required>
          </div>

          <div class="form-field">
            <label for="${escapeAttr(key)}-email">${escapeHtml(formConfig.emailLabel)}</label>
            <input id="${escapeAttr(key)}-email" name="email" type="email" autocomplete="email" required>
          </div>

          <div class="form-field">
            <label for="${escapeAttr(key)}-phone">${escapeHtml(formConfig.phoneLabel)}</label>
            <input id="${escapeAttr(key)}-phone" name="phone" type="tel" autocomplete="tel" required>
          </div>

          <div class="form-field">
            <label for="${escapeAttr(key)}-zip">${escapeHtml(formConfig.zipLabel)}</label>
            <input id="${escapeAttr(key)}-zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" required>
          </div>

          <div class="form-field full">
            <label for="${escapeAttr(key)}-service">${escapeHtml(formConfig.serviceLabel)}</label>
            <select id="${escapeAttr(key)}-service" name="service" required>
              <option value="">Select a window option</option>
              ${config.services
                .map((service) => {
                    return `<option value="${escapeAttr(service.id)}">${escapeHtml(service.title)}</option>`;
                })
                .join("")}
            </select>
          </div>

          <div class="form-field full">
            <label for="${escapeAttr(key)}-message">${escapeHtml(formConfig.messageLabel)}</label>
            <textarea id="${escapeAttr(key)}-message" name="message" rows="4"></textarea>
          </div>
        </div>

        <label class="checkbox-field">
          <input type="checkbox" name="consent" required>
          <span class="checkbox-visual" aria-hidden="true"></span>
          <span>${escapeHtml(formConfig.consentLabel)}</span>
        </label>

        <button class="btn form-submit" type="submit">
          ${escapeHtml(formConfig.submitLabel)}
          <span class="arrow">→</span>
        </button>

        <div class="form-message" role="status" aria-live="polite"></div>
      </form>
    `;
    }

    function initForms() {
        document.querySelectorAll("[data-request-form]").forEach((form) => {
            const message = form.querySelector(".form-message");
            const formConfig = getFormConfig(form.closest("[data-form-module]")?.getAttribute("data-form-module") || "default");

            form.addEventListener("submit", (event) => {
                event.preventDefault();

                const requiredFields = Array.from(form.querySelectorAll("[required]"));
                const invalidField = requiredFields.find((field) => {
                    if (field.type === "checkbox") return !field.checked;
                    return !String(field.value || "").trim();
                });

                if (invalidField) {
                    showFormMessage(message, formConfig.errorMessage, true);
                    invalidField.focus();
                    return;
                }

                const emailField = form.querySelector('input[type="email"]');
                if (emailField && emailField.value && !isValidEmail(emailField.value)) {
                    showFormMessage(message, "Please enter a valid email address.", true);
                    emailField.focus();
                    return;
                }

                form.reset();
                showFormMessage(message, `${formConfig.successTitle} ${formConfig.successMessage}`, false);
            });
        });
    }

    function showFormMessage(message, text, isError) {
        if (!message) return;

        message.textContent = text;
        message.classList.add("is-visible");
        message.classList.toggle("is-error", Boolean(isError));
    }

    function getFormConfig(key) {
        const defaults = config.forms.default || {};
        const selected = config.forms[key] || {};

        return {
            ...defaults,
            ...selected
        };
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    }

    /* ========================================================
       Cookie / Policy Banner
       ======================================================== */

    function renderPolicyBanner() {
        const mounts = document.querySelectorAll("[data-policy-banner]");
        if (!mounts.length || !config.cookieBanner) return;

        mounts.forEach((mount) => {
            mount.innerHTML = `
        <section class="policy-banner" data-policy-banner-panel aria-label="Privacy and cookie preferences">
          <div class="policy-banner-content">
            <h2>${escapeHtml(config.cookieBanner.title)}</h2>
            <p>${escapeHtml(config.cookieBanner.text)}</p>

            <div class="policy-banner-links">
              ${config.cookieBanner.links
                    .map((link) => {
                        return `<a href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`;
                    })
                    .join("")}
            </div>
          </div>

          <div class="policy-banner-actions">
            <button class="btn btn-secondary" type="button" data-policy-decline>
              ${escapeHtml(config.cookieBanner.decline)}
            </button>

            <button class="btn" type="button" data-policy-accept>
              ${escapeHtml(config.cookieBanner.accept)}
            </button>
          </div>
        </section>
      `;
        });

        initPolicyBanner();
    }

    function initPolicyBanner() {
        const key = config.cookieBanner.storageKey || "site_policy_choice";
        const banner = document.querySelector("[data-policy-banner-panel]");
        if (!banner) return;

        const stored = localStorage.getItem(key);

        if (!stored) {
            banner.classList.add("is-visible");
        }

        document.querySelectorAll("[data-policy-accept], [data-policy-decline]").forEach((button) => {
            button.addEventListener("click", () => {
                const value = button.hasAttribute("data-policy-accept") ? "accepted" : "declined";
                localStorage.setItem(key, value);
                banner.classList.remove("is-visible");
            });
        });
    }

    /* ========================================================
       Mobile Menu
       ======================================================== */

    function initMobileMenu() {
        const menu = document.querySelector("[data-mobile-menu]");
        const backdrop = document.querySelector("[data-mobile-backdrop]");
        const openButton = document.querySelector("[data-mobile-open]");
        const closeButton = document.querySelector("[data-mobile-close]");
        const links = document.querySelectorAll("[data-mobile-link]");

        if (!menu || !backdrop || !openButton || !closeButton) return;

        function openMenu() {
            document.body.classList.add("menu-open");
            menu.classList.add("is-open");
            backdrop.classList.add("is-open");
            menu.removeAttribute("inert");
            openButton.setAttribute("aria-expanded", "true");

            window.setTimeout(() => {
                closeButton.focus();
            }, 80);
        }

        function closeMenu() {
            document.body.classList.remove("menu-open");
            menu.classList.remove("is-open");
            backdrop.classList.remove("is-open");
            menu.setAttribute("inert", "");
            openButton.setAttribute("aria-expanded", "false");
            openButton.focus();
        }

        openButton.addEventListener("click", openMenu);
        closeButton.addEventListener("click", closeMenu);
        backdrop.addEventListener("click", closeMenu);

        links.forEach((link) => {
            link.addEventListener("click", () => {
                if (menu.classList.contains("is-open")) {
                    closeMenu();
                }
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menu.classList.contains("is-open")) {
                closeMenu();
            }
        });
    }

    /* ========================================================
       Header Scroll
       ======================================================== */

    function initHeaderScroll() {
        const header = document.querySelector("[data-header]");
        if (!header) return;

        function updateHeader() {
            header.classList.toggle("is-scrolled", window.scrollY > 12);
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    /* ========================================================
       Counters
       ======================================================== */

    function initCounters() {
        const counters = document.querySelectorAll("[data-counter]");
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                });
            },
            {
                threshold: 0.35
            }
        );

        counters.forEach((counter) => observer.observe(counter));
    }

    function animateCounter(element) {
        const end = Number(element.getAttribute("data-counter") || "0");
        const duration = 1100;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(end * eased);

            element.textContent = String(value);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = String(end);
            }
        }

        requestAnimationFrame(update);
    }

    /* ========================================================
       Helpers
       ======================================================== */

    function getCurrentPage() {
        const path = window.location.pathname.split("/").pop();
        return path || "index.html";
    }

    function normalizePageRef(value) {
        if (!value) return "index.html";

        const clean = String(value).split("#")[0].split("?")[0];
        const page = clean.split("/").pop();

        return page || "index.html";
    }

    function preventEmptyLinks() {
        document.querySelectorAll('a[href="#"]').forEach((link) => {
            link.addEventListener("click", (event) => event.preventDefault());
        });
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

    function chevronDown() {
        return `
      <svg class="nav-chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    }

    function renderLogoMark() {
        return `
      <span class="site-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
          <path class="logo-line" d="M8 15L25 8V56L8 49V15Z" fill="none" stroke="#00C2FF" stroke-width="2.4" stroke-linejoin="round"/>
          <path class="logo-line" d="M56 15L39 8V56L56 49V15Z" fill="none" stroke="#00C2FF" stroke-width="2.4" stroke-linejoin="round"/>
          <path class="logo-accent" d="M25 13L32 17L39 13" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
          <path class="logo-accent" d="M25 51L32 47L39 51" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
          <path class="logo-line" d="M32 17V47" fill="none" stroke="#00C2FF" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
    `;
    }

    function serviceIcon(type) {
        const map = {
            window: icon("window"),
            replace: icon("refresh"),
            repair: icon("tool"),
            energy: icon("spark")
        };

        return map[type] || icon("window");
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
            x: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `,
            window: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4h16v16H4V4Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      `,
            refresh: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11a8 8 0 0 0-14.2-4.9L4 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 13a8 8 0 0 0 14.2 4.9L20 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 20v-4h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
            tool: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.7-8.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 4 20 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      `,
            spark: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      `,
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
      `,
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
      `,
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

        return icons[name] || icons.check;
    }
})();