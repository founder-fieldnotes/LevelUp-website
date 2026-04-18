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
      title: "Who We Are",
      links: [
        ["About", "about/"],
        ["Our Approach", "approach/"],
        ["Leadership", "leadership/"],
        ["Team", "team/"],
        ["Partners and Funders", "partners-funders/"],
        ["Careers", "careers/"]
      ]
    },
    {
      title: "What We Do",
      links: [
        ["What We Do", "what-we-do/"],
        ["Build Talent Systems", "build-talent-systems/"],
        ["Support Venture Creation", "support-venture-creation/"],
        ["Align Capital", "align-capital/"],
        ["Enabling Policy and Institutions", "enabling-policy-institutions/"],
        ["Design Innovation Ecosystems", "design-innovation-ecosystems/"]
      ]
    },
    {
      title: "Initiatives",
      links: [
        ["Initiatives", "initiatives/"],
        ["AI.SPIRE", "ai-spire/"],
        ["FSF", "fsf/"],
        ["Darb.Tech", "darb-tech/"]
      ]
    },
    {
      title: "Insights",
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
      title: "Programs and Platform",
      links: [
        ["Programs", "programs/"],
        ["LevHub", "levhub/"]
      ]
    },
    {
      title: "Get Involved",
      links: [
        ["Get Involved", "contact/"],
        ["Legal and Policies", "legal/"],
        ["Partner With Us", "partner-with-us/"],
        ["Fund This Work", "fund-this-work/"],
        ["Subscribe", "subscribe/"]
      ]
    }
  ];

  const normalizeBase = (path) => {
    const cleaned = path.replace(/index\.html$/, "");
    const parts = cleaned.split("/").filter(Boolean);
    const level = parts.length;
    return level === 0 ? "" : "../".repeat(level);
  };

  const basePrefix = normalizeBase(window.location.pathname);
  const scriptSrc = scriptEl?.getAttribute("src") || "";
  let assetBasePrefix = basePrefix;

  if (scriptSrc) {
    try {
      const scriptUrl = new URL(scriptSrc, window.location.href);
      const assetUrl = new URL("../images/branding/", scriptUrl);
      assetBasePrefix = assetUrl.href;
    } catch {
      assetBasePrefix = `${basePrefix}images/branding/`;
    }
  } else {
    assetBasePrefix = `${basePrefix}images/branding/`;
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

  const footerTitle = document.querySelector(".footer-grid > div:first-child .footer-title");
  if (footerTitle) {
    footerTitle.innerHTML = `<img class="footer-logo" src="${footerLogoPath}" alt="LevelUp Economy" />`;
  }

  const resolveHref = (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    return `${basePrefix}${href}`;
  };

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

  document.querySelectorAll(".site-nav .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && normalizeHrefPath(href) === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (headerActions) {
    const shell = document.createElement("div");
    shell.className = "directory-shell";
    shell.dataset.open = "false";

    const directoryId = "site-directory-panel";
    shell.innerHTML = `
      <button class="button secondary directory-toggle" type="button" aria-expanded="false" aria-controls="${directoryId}">Browse</button>
      <div class="directory-panel" id="${directoryId}">
        <div class="directory-head">
          <div>
            <div class="label">Site Directory</div>
            <h3>Explore the institutional architecture.</h3>
          </div>
          <p>Browse the site by strategic area, public proof, and future platform layers.</p>
        </div>
        <div class="directory-grid"></div>
      </div>
    `;

    const grid = shell.querySelector(".directory-grid");
    directoryGroups.forEach((group) => {
      const article = document.createElement("article");
      article.className = "directory-group";
      const linksMarkup = group.links
        .map(([label, href]) => {
          const resolvedHref = resolveHref(href);
          const currentAttr = normalizeHrefPath(href) === currentPath ? ' aria-current="page"' : "";
          return `<li><a href="${resolvedHref}"${currentAttr}>${label}</a></li>`;
        })
        .join("");
      article.innerHTML = `<div class="directory-title">${group.title}</div><ul class="directory-links">${linksMarkup}</ul>`;
      grid.appendChild(article);
    });

    headerActions.prepend(shell);

    const directoryToggle = shell.querySelector(".directory-toggle");
    const closeDirectory = () => {
      shell.dataset.open = "false";
      directoryToggle.setAttribute("aria-expanded", "false");
    };
    const openDirectory = () => {
      shell.dataset.open = "true";
      directoryToggle.setAttribute("aria-expanded", "true");
    };

    directoryToggle.addEventListener("click", () => {
      const open = shell.dataset.open === "true";
      if (open) {
        closeDirectory();
      } else {
        openDirectory();
      }
    });

    document.addEventListener("click", (event) => {
      if (!shell.contains(event.target)) {
        closeDirectory();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDirectory();
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

  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  if (header) {
    const syncHeaderScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    syncHeaderScrollState();
    window.addEventListener("scroll", syncHeaderScrollState, { passive: true });
  }
});
