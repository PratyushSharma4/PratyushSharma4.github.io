(function () {
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");
    const filterGroups = document.querySelectorAll("[data-filter-group]");
    const counterItems = document.querySelectorAll("[data-counter]");
    const spotlightCards = document.querySelectorAll("[data-tilt]");
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const themeKey = "ps-site-theme";
    const pageHasMath = body.dataset.hasMath === "true";

    function loadStylesheet(href) {
        return new Promise(function (resolve, reject) {
            const existing = document.querySelector('link[href="' + href + '"]');
            if (existing) {
                resolve(existing);
                return;
            }

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.crossOrigin = "anonymous";
            link.onload = function () {
                resolve(link);
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            const existing = document.querySelector('script[src="' + src + '"]');
            if (existing) {
                if (existing.dataset.loaded === "true") {
                    resolve(existing);
                    return;
                }

                existing.addEventListener("load", function () {
                    resolve(existing);
                }, { once: true });
                existing.addEventListener("error", reject, { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.defer = true;
            script.crossOrigin = "anonymous";
            script.addEventListener("load", function () {
                script.dataset.loaded = "true";
                resolve(script);
            }, { once: true });
            script.addEventListener("error", reject, { once: true });
            document.head.appendChild(script);
        });
    }

    function setupTheme() {
        const storedTheme = localStorage.getItem(themeKey);
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const startingTheme = storedTheme || (prefersDark ? "dark" : "light");

        const applyTheme = function (theme) {
            body.setAttribute("data-theme", theme);
            body.style.colorScheme = theme;

            if (themeToggle) {
                themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
                themeToggle.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
            }
        };

        applyTheme(startingTheme);

        if (!themeToggle) {
            return;
        }

        themeToggle.addEventListener("click", function () {
            const nextTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            localStorage.setItem(themeKey, nextTheme);
        });
    }

    function setupNavigation() {
        if (!navToggle || !siteNav) {
            return;
        }

        const closeNavigation = function () {
            navToggle.setAttribute("aria-expanded", "false");
            siteNav.classList.remove("is-open");
            body.classList.remove("nav-open");
        };

        navToggle.addEventListener("click", function () {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            siteNav.classList.toggle("is-open", !isOpen);
            body.classList.toggle("nav-open", !isOpen);
        });

        siteNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 760) {
                    closeNavigation();
                }
            });
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeNavigation();
            }
        });

        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeNavigation();
            }
        });
    }

    function setupFilters() {
        filterGroups.forEach(function (group) {
            const buttons = group.querySelectorAll("[data-filter]");
            const cards = group.parentElement.querySelectorAll("[data-category]");

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const filter = button.getAttribute("data-filter");

                    buttons.forEach(function (item) {
                        item.classList.toggle("is-active", item === button);
                    });

                    cards.forEach(function (card) {
                        const category = card.getAttribute("data-category");
                        const show = filter === "all" || category === filter;
                        card.classList.toggle("is-hidden", !show);
                    });
                });
            });
        });
    }

    function setupCounters() {
        if (!counterItems.length || !("IntersectionObserver" in window)) {
            return;
        }

        const animateCounter = function (counter) {
            const target = Number(counter.getAttribute("data-counter"));
            const duration = 1200;
            const start = performance.now();

            const step = function (timestamp) {
                const progress = Math.min((timestamp - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased).toString();

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.6
        });

        counterItems.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    function setupSpotlights() {
        spotlightCards.forEach(function (card) {
            card.addEventListener("pointermove", function (event) {
                const bounds = card.getBoundingClientRect();
                const x = ((event.clientX - bounds.left) / bounds.width) * 100;
                const y = ((event.clientY - bounds.top) / bounds.height) * 100;
                card.style.setProperty("--x", x + "%");
                card.style.setProperty("--y", y + "%");
            });
        });
    }

    function setupKaTeX() {
        if (!pageHasMath) {
            return;
        }

        loadStylesheet("https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css")
            .then(function () {
                return loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js");
            })
            .then(function () {
                return loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js");
            })
            .then(function () {
                if (typeof renderMathInElement !== "function") {
                    return;
                }

                renderMathInElement(document.body, {
                    delimiters: [
                        { left: "\\[", right: "\\]", display: true },
                        { left: "\\(", right: "\\)", display: false }
                    ],
                    throwOnError: false
                });
            })
            .catch(function () {
                // If the CDN is unavailable, the page should remain readable without failing visibly.
            });
    }

    setupTheme();
    setupNavigation();
    setupFilters();
    setupCounters();
    setupSpotlights();
    setupKaTeX();
}());
