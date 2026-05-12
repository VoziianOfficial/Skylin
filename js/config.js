"use strict";

/* ==========================================================
   Skylin — Global Website Config
   All reusable brand, contact, service, FAQ, legal, form,
   meta, and UI copy must be controlled from this file.
   ========================================================== */

window.SITE_CONFIG = {
    companyName: "Skylin",
    companyId: "Skylin Provider Matching LLC",

    brand: {
        shortName: "Skylin",
        tagline: "Compare local window provider options with clarity.",
        logoLabel: "Skylin home",
        logoText: "Skylin",
        themeName: "Obsidian Glass + Deep Teal + Neon Sky"
    },

    phone: "(833) 456-7890",
    phoneHref: "tel:+18334567890",
    phoneLabel: "Call Skylin at (833) 456-7890",
    phoneButtonText: "(833) 456-7890",

    email: "hello@skylinmatch.com",

    address: {
        line1: "1234 Market St, Suite 500",
        city: "Denver",
        state: "CO",
        zip: "80202",
        country: "USA",
        full: "1234 Market St, Suite 500, Denver, CO 80202, USA"
    },

    serviceArea: "Serving homeowners across the USA",

    footerText:
        "Skylin helps homeowners compare independent local window provider options and organize request details with more clarity.",

    disclaimer:
        "Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.",

    legalNotice:
        "Skylin is an independent provider-matching platform. Skylin does not perform window installation, replacement, repair, inspection, or energy-efficiency work directly. Provider availability, qualifications, quotes, timelines, warranties, and service terms must be reviewed directly with each independent provider.",

    navigation: [
        {
            label: "Home",
            href: "index.html"
        },
        {
            label: "Window Options",
            href: "services.html",
            children: [
                {
                    label: "Window Installation",
                    href: "window-installation.html"
                },
                {
                    label: "Window Replacement",
                    href: "window-replacement.html"
                },
                {
                    label: "Window Repair",
                    href: "window-repair.html"
                },
                {
                    label: "Energy-Efficient Windows",
                    href: "energy-efficient-windows.html"
                }
            ]
        },
        {
            label: "How Skylin Works",
            href: "index.html#how-it-works"
        },
        {
            label: "Platform",
            href: "about.html"
        },
        {
            label: "Contact",
            href: "contact.html"
        }
    ],

    legalLinks: [
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
    ],

    services: [
        {
            id: "window-installation",
            title: "Window Installation",
            shortTitle: "Installation",
            href: "window-installation.html",
            icon: "window",
            image: "./assets/images/service-installation.jpg",
            heroImage: "./assets/images/hero-service-installation.jpg",
            kicker: "New Window Projects",
            summary:
                "Explore local provider options for new window installation requests, project details, and quote conversations.",
            cardText:
                "Compare independent providers for new window installation planning.",
            heroTitle: "Compare Window Installation Provider Options",
            heroText:
                "Skylin helps organize your project request so you can compare independent local providers directly.",
            pageIntro:
                "Window installation projects can involve frame conditions, opening sizes, glass choices, timelines, materials, and budget expectations. Skylin helps homeowners prepare request details before speaking with independent providers.",
            evaluationPoints: [
                "Window opening and frame conditions",
                "Material, glass, and style preferences",
                "Quote clarity and project timeline",
                "Provider licensing, insurance, and warranty details"
            ],
            ctaTitle: "Start a window installation matching request",
            ctaText:
                "Share a few project details and compare provider options directly."
        },
        {
            id: "window-replacement",
            title: "Window Replacement",
            shortTitle: "Replacement",
            href: "window-replacement.html",
            icon: "replace",
            image: "./assets/images/service-replacement.jpg",
            heroImage: "./assets/images/hero-service-replacement.jpg",
            kicker: "Replacement Planning",
            summary:
                "Compare local provider options for replacing outdated, damaged, drafty, or inefficient windows.",
            cardText:
                "Review provider options for window replacement conversations.",
            heroTitle: "Compare Window Replacement Provider Options",
            heroText:
                "Skylin helps homeowners organize window replacement requests before comparing independent local providers.",
            pageIntro:
                "Replacement projects may include old window removal, frame review, glass upgrades, efficiency goals, exterior finish details, and scheduling. Skylin helps make those details easier to compare.",
            evaluationPoints: [
                "Existing window condition",
                "Replacement style and material options",
                "Energy performance expectations",
                "Quote scope, timeline, and warranty terms"
            ],
            ctaTitle: "Compare replacement provider options",
            ctaText:
                "Organize your replacement request and connect with independent providers."
        },
        {
            id: "window-repair",
            title: "Window Repair",
            shortTitle: "Repair",
            href: "window-repair.html",
            icon: "repair",
            image: "./assets/images/service-repair.jpg",
            heroImage: "./assets/images/hero-service-repair.jpg",
            kicker: "Repair Requests",
            summary:
                "Explore provider options for window repair requests involving glass, frames, seals, hardware, or operation issues.",
            cardText:
                "Find provider options for repair-focused window requests.",
            heroTitle: "Compare Window Repair Provider Options",
            heroText:
                "Skylin helps homeowners describe repair concerns clearly before comparing independent local providers.",
            pageIntro:
                "Window repair conversations may involve stuck windows, cracked glass, seal issues, frame damage, drafts, condensation, or hardware concerns. Skylin helps organize the request so providers can better understand the situation.",
            evaluationPoints: [
                "Visible damage or operating issue",
                "Glass, seal, frame, or hardware concern",
                "Urgency and access details",
                "Provider experience and quote clarity"
            ],
            ctaTitle: "Request window repair provider matches",
            ctaText:
                "Share the repair concern and compare independent provider options."
        },
        {
            id: "energy-efficient-windows",
            title: "Energy-Efficient Windows",
            shortTitle: "Energy Windows",
            href: "energy-efficient-windows.html",
            icon: "energy",
            image: "./assets/images/service-energy.jpg",
            heroImage: "./assets/images/hero-service-energy.jpg",
            kicker: "Efficiency Options",
            summary:
                "Compare provider options for energy-efficient window upgrades, glass packages, and comfort-focused improvements.",
            cardText:
                "Explore provider options for energy-conscious window projects.",
            heroTitle: "Compare Energy-Efficient Window Provider Options",
            heroText:
                "Skylin helps homeowners organize efficiency-focused window requests before speaking with independent providers.",
            pageIntro:
                "Energy-efficient window projects can include glass packages, frame materials, insulation goals, comfort improvements, and long-term performance expectations. Skylin helps turn those goals into clearer provider conversations.",
            evaluationPoints: [
                "Comfort and efficiency priorities",
                "Glass package and frame material options",
                "Room-by-room project scope",
                "Provider warranty and product documentation"
            ],
            ctaTitle: "Compare energy-efficient window options",
            ctaText:
                "Prepare your upgrade request and review local provider options."
        }
    ],

    processSteps: [
        {
            number: "01",
            title: "Tell us about your project",
            text:
                "Share the window category, property details, timing, and basic request information.",
            icon: "clipboard"
        },
        {
            number: "02",
            title: "We organize your request",
            text:
                "Skylin structures your details so the project is easier to compare and discuss.",
            icon: "layout"
        },
        {
            number: "03",
            title: "You connect with providers",
            text:
                "Your request can be matched with independent local window provider options.",
            icon: "network"
        },
        {
            number: "04",
            title: "Compare directly",
            text:
                "Review quotes, credentials, timelines, warranty terms, and provider fit directly.",
            icon: "compare"
        }
    ],

    stats: [
        {
            value: 94,
            suffix: "%",
            label: "Request clarity",
            text: "Project details organized for easier provider conversations.",
            icon: "check"
        },
        {
            value: 91,
            suffix: "%",
            label: "Category fit",
            text: "Requests aligned with the right window service category.",
            icon: "target"
        },
        {
            value: 96,
            suffix: "%",
            label: "Response organization",
            text: "Structured information that helps reduce back-and-forth.",
            icon: "shield"
        },
        {
            value: 2,
            suffix: " min",
            label: "Avg. request start",
            text: "A compact form experience designed for speed and clarity.",
            icon: "clock"
        }
    ],

    comparisonFactors: [
        {
            label: "Licensing & Insurance",
            text:
                "Ask each provider for licensing and insurance details before agreeing to work.",
            icon: "badge"
        },
        {
            label: "Materials & Options",
            text:
                "Compare window materials, glass packages, frame types, and finish options.",
            icon: "layers"
        },
        {
            label: "Timeline & Availability",
            text:
                "Review scheduling expectations and availability directly with providers.",
            icon: "calendar"
        },
        {
            label: "Warranty & Support",
            text:
                "Confirm product, labor, and service warranty details before moving forward.",
            icon: "shield"
        },
        {
            label: "Quote Transparency",
            text:
                "Compare what is included, excluded, optional, or dependent on inspection.",
            icon: "file"
        },
        {
            label: "Reviews & Reputation",
            text:
                "Check provider reviews, references, and reputation in your local area.",
            icon: "star"
        }
    ],

    socialProof: {
        eyebrow: "Platform clarity",
        title: "Designed for better window provider conversations.",
        items: [
            {
                label: "Clearer requests",
                value: "01",
                text:
                    "Skylin helps turn scattered project details into a more structured request."
            },
            {
                label: "Independent options",
                value: "02",
                text:
                    "Homeowners can compare provider options without treating Skylin as the contractor."
            },
            {
                label: "Verification reminders",
                value: "03",
                text:
                    "The platform reminds users to verify licensing, insurance, quotes, and warranties."
            }
        ]
    },

    forms: {
        default: {
            title: "Tell us about your project",
            intro:
                "Share a few details and Skylin will help organize your provider-matching request.",
            nameLabel: "Full Name",
            emailLabel: "Email Address",
            phoneLabel: "Phone Number",
            zipLabel: "ZIP Code",
            serviceLabel: "Service Needed",
            messageLabel: "Tell us about your project",
            consentLabel:
                "I understand Skylin is a provider-matching platform and does not perform window work directly.",
            submitLabel: "Get Provider Matches",
            successTitle: "Request received.",
            successMessage:
                "Thanks. Your request details were captured. You can now compare provider options directly.",
            errorMessage:
                "Please complete the required fields before submitting your request."
        },
        contact: {
            title: "Start a Skylin request",
            intro:
                "Use the compact form to organize your window provider matching request.",
            submitLabel: "Request Provider Matches",
            successTitle: "Thanks — your details are ready.",
            successMessage:
                "Your request has been organized for provider matching conversations."
        }
    },

    cookieBanner: {
        storageKey: "skylin_policy_choice_v1",
        title: "Privacy & cookie preferences",
        text:
            "Skylin uses basic cookies and local storage to improve site experience and remember your preference. Review our policies for more information.",
        accept: "Accept",
        decline: "Decline",
        links: [
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
        ]
    },

    faq: {
        home: [
            {
                question: "Does Skylin perform window work directly?",
                answer:
                    "No. Skylin is an independent provider-matching platform. Skylin does not install, replace, repair, inspect, or service windows directly."
            },
            {
                question: "Are providers independent?",
                answer:
                    "Yes. Providers are independent. Homeowners should verify licensing, insurance, quote details, timelines, warranties, and credentials directly with any provider."
            },
            {
                question: "Are quotes from providers usually free?",
                answer:
                    "Quote policies vary by provider, service category, project scope, and location. Confirm any quote, visit, or inspection costs directly with the provider."
            },
            {
                question: "What should I ask before choosing a window provider?",
                answer:
                    "Ask about licensing, insurance, experience, materials, quote scope, payment terms, scheduling, warranties, and local references."
            }
        ],
        services: [
            {
                question: "Which window service categories can I compare?",
                answer:
                    "Skylin focuses on four categories: window installation, window replacement, window repair, and energy-efficient windows."
            },
            {
                question: "Can I compare more than one service category?",
                answer:
                    "Yes. You can describe your project needs and review which category best fits your request before speaking with independent providers."
            },
            {
                question: "Does Skylin recommend one specific provider?",
                answer:
                    "Skylin helps organize provider-matching requests. You should compare options directly and decide which provider best fits your needs."
            }
        ],
        contact: [
            {
                question: "How do I start a request?",
                answer:
                    "Use the contact form to share your service category, ZIP code, and project details. Skylin helps organize that information for provider matching."
            },
            {
                question: "Can I call instead of using the form?",
                answer:
                    "Yes. You can use the phone number listed on the site to start a conversation about your request."
            },
            {
                question: "Does availability vary by area?",
                answer:
                    "Yes. Provider availability can vary by ZIP code, service category, timing, and project scope."
            }
        ],
        legal: [
            {
                question: "What is Skylin?",
                answer:
                    "Skylin is an independent provider-matching platform for window-related service categories."
            },
            {
                question: "Does Skylin guarantee provider work?",
                answer:
                    "No. Skylin does not warrant or guarantee any work performed by independent providers."
            },
            {
                question: "Who verifies provider credentials?",
                answer:
                    "Homeowners are responsible for verifying licensing, insurance, credentials, quotes, timelines, and warranty terms directly with providers."
            }
        ]
    },

    pageMeta: {
        "index.html": {
            title: "Skylin | Compare Local Window Provider Options",
            description:
                "Skylin helps homeowners compare independent local window provider options for installation, replacement, repair, and energy-efficient window projects."
        },
        "services.html": {
            title: "Window Options | Skylin",
            description:
                "Explore Skylin window service categories and compare independent provider options for installation, replacement, repair, and energy-efficient windows."
        },
        "about.html": {
            title: "About Skylin | Window Provider Matching Platform",
            description:
                "Learn how Skylin helps homeowners organize window project requests and compare independent local provider options."
        },
        "contact.html": {
            title: "Contact Skylin | Request Window Provider Matches",
            description:
                "Contact Skylin to start a window provider matching request for installation, replacement, repair, or energy-efficient window options."
        },
        "window-installation.html": {
            title: "Window Installation Provider Options | Skylin",
            description:
                "Compare independent local provider options for window installation requests with Skylin."
        },
        "window-replacement.html": {
            title: "Window Replacement Provider Options | Skylin",
            description:
                "Compare local window replacement provider options and organize your replacement request with Skylin."
        },
        "window-repair.html": {
            title: "Window Repair Provider Options | Skylin",
            description:
                "Explore provider options for window repair requests involving glass, frames, seals, hardware, and operation issues."
        },
        "energy-efficient-windows.html": {
            title: "Energy-Efficient Window Provider Options | Skylin",
            description:
                "Compare provider options for energy-efficient window upgrades, comfort improvements, and performance-focused projects."
        },
        "privacy-policy.html": {
            title: "Privacy Policy | Skylin",
            description:
                "Review the Skylin Privacy Policy for information about how the provider-matching platform handles privacy-related practices."
        },
        "cookie-policy.html": {
            title: "Cookie Policy | Skylin",
            description:
                "Review the Skylin Cookie Policy for information about cookies, local storage, and preference choices."
        },
        "terms-of-service.html": {
            title: "Terms of Service | Skylin",
            description:
                "Review the Skylin Terms of Service for platform use, provider matching, and homeowner responsibility information."
        }
    },

    assets: {
        logo: "./assets/icons/logo-window.svg",
        favicon: "./assets/icons/favicon.svg",
        images: {
            heroHome: "./assets/images/hero-home.jpg",
            heroServices: "./assets/images/hero-services.jpg",
            heroAbout: "./assets/images/hero-about.jpg",
            heroContact: "./assets/images/hero-contact.jpg",
            interiorOne: "./assets/images/interior-window-01.jpg",
            interiorTwo: "./assets/images/interior-window-02.jpg",
            interiorThree: "./assets/images/interior-window-03.jpg",
            frameDetail: "./assets/images/window-frame-detail.jpg",
            glassDetail: "./assets/images/glass-detail.jpg",
            exteriorHome: "./assets/images/exterior-window-home.jpg",
            mapPanel: "./assets/images/map-panel.jpg",
            ctaPhoto: "./assets/images/cta-window-night.jpg"
        }
    }
};