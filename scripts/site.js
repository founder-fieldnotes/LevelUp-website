document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const yearTarget = document.querySelector("[data-current-year]");
  const headerActions = document.querySelector(".header-actions");
  const scriptEl =
    document.querySelector('script[src$="scripts/site.js"]') ||
    document.querySelector('script[src$="/scripts/site.js"]');

  const directoryGroups = [
    {
      title: "About",
      color: "gold",
      links: [
        ["About", "about/"],
        ["Our Approach", "approach/"],
        ["Partners and Funders", "partners-funders/"]
      ]
    },
    {
      title: "What We Do",
      color: "green",
      links: [
        ["What We Do", "what-we-do/"],
        ["Build Talent Systems", "build-talent-systems/"],
        ["Support Venture Creation", "support-venture-creation/"],
        ["Align Capital", "align-capital/"],
        ["Enabling Policy and Institutions", "enabling-policy-institutions/"],
        ["Design Innovation Ecosystems", "design-innovation-ecosystems/"],
        ["Programs", "programs/"]
      ]
    },
    {
      title: "Initiatives",
      color: "blue",
      links: [
        ["Initiatives", "initiatives/"],
        ["AI.SPIRE", "ai-spire/"],
        ["FSF", "fsf/"],
        ["Darb.Tech", "darb-tech/"]
      ]
    },
    {
      title: "Insights",
      color: "clay",
      links: [
        ["Insights", "insights/"],
        ["Case Studies", "case-studies/"],
        ["Research and Frameworks", "research-frameworks/"],
        ["News", "news/"],
        ["Events", "events/"],
        ["Questions from the Field", "questions-from-the-field.html"]
      ]
    },
    {
      title: "Get Involved",
      color: "green",
      links: [
        ["Get Involved", "contact/"],
        ["Partner With Us", "partner-with-us/"],
        ["Fund This Work", "fund-this-work/"],
        ["Subscribe", "subscribe/"]
      ]
    }
  ];

  const scriptSrc = scriptEl?.getAttribute("src") || "";
  let siteRootPrefix = "";
  let assetBasePrefix = "";

  if (scriptSrc) {
    try {
      const scriptUrl = new URL(scriptSrc, window.location.href);
      const siteRootUrl = new URL("../", scriptUrl);
      const assetUrl = new URL("../images/branding/", scriptUrl);
      siteRootPrefix = siteRootUrl.href;
      assetBasePrefix = assetUrl.href;
    } catch {
      const depth = Math.max(
        0,
        window.location.pathname.replace(/index\.html$/, "").split("/").filter(Boolean).length - 1
      );
      siteRootPrefix = depth === 0 ? "" : "../".repeat(depth);
      assetBasePrefix = `${siteRootPrefix}images/branding/`;
    }
  } else {
    const depth = Math.max(
      0,
      window.location.pathname.replace(/index\.html$/, "").split("/").filter(Boolean).length - 1
    );
    siteRootPrefix = depth === 0 ? "" : "../".repeat(depth);
    assetBasePrefix = `${siteRootPrefix}images/branding/`;
  }

  const brandLogoPath = `${assetBasePrefix}logo-black.png`;
  const footerLogoPath = `${assetBasePrefix}logo-black.png`;
  const faviconPath = `${assetBasePrefix}favicon.png`;

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    document.head.appendChild(favicon);
  }
  favicon.href = faviconPath;

  const brandTitle = document.querySelector(".brand-title");
  if (brandTitle) {
    brandTitle.innerHTML = `<img src="${brandLogoPath}" alt="LevelUp Economy" />`;
  }

  const resolveHref = (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    if (/^https?:/.test(siteRootPrefix)) {
      return new URL(href, siteRootPrefix).href;
    }
    return `${siteRootPrefix}${href}`;
  };

  const footerGrid = document.querySelector(".footer-grid");
  if (footerGrid) {
    footerGrid.innerHTML = `
      <div>
        <div class="footer-title"><img class="footer-logo" src="${footerLogoPath}" alt="LevelUp Economy" /></div>
        <p>LevelUp designs holistic systems that connect talent, innovation, capital, and institutions.</p>
        <ul class="footer-links">
          <li><a href="${resolveHref("about/")}">About</a></li>
          <li><a href="${resolveHref("approach/")}">Our Approach</a></li>
          <li><a href="${resolveHref("what-we-do/")}">What We Do</a></li>
          <li><a href="${resolveHref("levhub/")}">LevHub</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-title">Programs & Initiatives</div>
        <ul class="footer-links">
          <li><a href="${resolveHref("initiatives/")}">Initiatives</a></li>
          <li><a href="${resolveHref("ai-spire/")}">AI.SPIRE</a></li>
          <li><a href="${resolveHref("programs/")}">Programs</a></li>
          <li><a href="${resolveHref("insights/")}">Insights</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-title">Connect</div>
        <ul class="footer-links">
          <li><a href="${resolveHref("partner-with-us/")}">Partner With Us</a></li>
          <li><a href="${resolveHref("fund-this-work/")}">Fund This Work</a></li>
          <li><a href="${resolveHref("subscribe/")}">Subscribe</a></li>
          <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>
    `;
  }

  const footerMeta = document.querySelector(".footer-meta-row");
  if (footerMeta) {
    footerMeta.innerHTML = `<span>&copy; <span data-current-year></span> LevelUp Economy</span>`;
  }

  const normalizeHrefPath = (href) => {
    const resolved = resolveHref(href);
    try {
      const url = new URL(resolved, window.location.href);
      let pathname = url.pathname.replace(/\/index\.html$/, "/");
      if (pathname !== "/" && !pathname.endsWith("/")) pathname = `${pathname}/`;
      return pathname;
    } catch {
      return resolved;
    }
  };

  let currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  if (currentPath !== "/" && !currentPath.endsWith("/")) currentPath = `${currentPath}/`;

  if (nav) {
    nav.innerHTML = directoryGroups
      .map((group, index) => {
        const topHref = resolveHref(group.links[0][1]);
        const groupIsCurrent = group.links.some(([, href]) => normalizeHrefPath(href) === currentPath);
        const submenuId = `nav-submenu-${index}`;
        const submenuLinks = group.links.slice(1);
        const linksMarkup = submenuLinks
          .map(([label, href]) => {
            const resolvedHref = resolveHref(href);
            const currentAttr = normalizeHrefPath(href) === currentPath ? ' aria-current="page"' : "";
            return `<li><a href="${resolvedHref}"${currentAttr}>${label}</a></li>`;
          })
          .join("");

        if (!submenuLinks.length) {
          return `
            <div class="nav-item${groupIsCurrent ? " is-current" : ""}" data-nav-color="${group.color}">
              <a class="nav-link nav-trigger" href="${topHref}">
                <span>${group.title}</span>
              </a>
            </div>
          `;
        }

        return `
          <div class="nav-item${groupIsCurrent ? " is-current" : ""}" data-nav-color="${group.color}">
            <a class="nav-link nav-trigger" href="${topHref}" aria-expanded="false" aria-controls="${submenuId}" data-nav-trigger>
              <span>${group.title}</span>
              <span class="nav-caret" aria-hidden="true"></span>
            </a>
            <div class="nav-submenu" id="${submenuId}">
              <ul class="nav-submenu-links">${linksMarkup}</ul>
            </div>
          </div>
        `;
      })
      .join("");

    const navItems = nav.querySelectorAll(".nav-item");
    const closeAllMenus = () => {
      navItems.forEach((item) => {
        item.dataset.open = "false";
        const trigger = item.querySelector("[data-nav-trigger]");
        if (trigger) trigger.setAttribute("aria-expanded", item.dataset.open === "true" ? "true" : "false");
      });
    };

    navItems.forEach((item) => {
      const trigger = item.querySelector("[data-nav-trigger]");
      item.dataset.open = "false";

      item.addEventListener("mouseenter", () => {
        if (window.innerWidth <= 820) return;
        navItems.forEach((other) => {
          other.dataset.open = "false";
          const otherTrigger = other.querySelector("[data-nav-trigger]");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });
        item.dataset.open = "true";
        if (trigger) trigger.setAttribute("aria-expanded", "true");
      });

      item.addEventListener("focusin", () => {
        if (window.innerWidth <= 820) return;
        navItems.forEach((other) => {
          other.dataset.open = "false";
          const otherTrigger = other.querySelector("[data-nav-trigger]");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });
        item.dataset.open = "true";
        if (trigger) trigger.setAttribute("aria-expanded", "true");
      });

      item.addEventListener("mouseleave", () => {
        if (window.innerWidth <= 820) return;
        item.dataset.open = "false";
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });

      item.addEventListener("focusout", (event) => {
        if (window.innerWidth <= 820) return;
        if (item.contains(event.relatedTarget)) return;
        item.dataset.open = "false";
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    });

    nav.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 820) return;
      closeAllMenus();
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        closeAllMenus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  const currentYearTargets = document.querySelectorAll("[data-current-year]");
  if (currentYearTargets.length) {
    currentYearTargets.forEach((target) => {
      target.textContent = String(new Date().getFullYear());
    });
  }

  const mailtoForms = document.querySelectorAll("[data-mailto-form]");
  mailtoForms.forEach((form) => {
    const destination = form.getAttribute("data-mailto-to") || "info@levelupeconomy.com";
    const fallbackSubject = form.getAttribute("data-mailto-subject") || "LevelUp Economy inquiry";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const subject = formData.get("subject") || fallbackSubject;
      const lines = [];

      formData.forEach((value, key) => {
        if (key === "subject") return;
        const normalized = String(value).trim();
        if (!normalized) return;
        const label = key
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
        lines.push(`${label}: ${normalized}`);
      });

      const body = lines.length
        ? lines.join("\n\n")
        : "Hello LevelUp Economy,\n\nI would like to start a conversation.";

      window.location.href = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });

  if (header) {
    const syncHeaderScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    syncHeaderScrollState();
    window.addEventListener("scroll", syncHeaderScrollState, { passive: true });
  }
});
