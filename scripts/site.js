document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const scriptEl =
    document.querySelector('script[src$="scripts/site.js"]') ||
    document.querySelector('script[src$="/scripts/site.js"]');

  const scriptSrc = scriptEl?.getAttribute("src") || "";
  const getRelativePrefix = () => {
    const depth = Math.max(
      0,
      window.location.pathname.replace(/index\.html$/, "").split("/").filter(Boolean).length - 1
    );
    return depth === 0 ? "" : "../".repeat(depth);
  };

  let assetBasePrefix = `${getRelativePrefix()}images/branding/`;

  if (scriptSrc) {
    try {
      const scriptUrl = new URL(scriptSrc, window.location.href);
      const assetUrl = new URL("../images/branding/", scriptUrl);
      assetBasePrefix = assetUrl.href;
    } catch {
      assetBasePrefix = `${getRelativePrefix()}images/branding/`;
    }
  }

  const faviconPath = `${assetBasePrefix}favicon.png`;

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    document.head.appendChild(favicon);
  }
  favicon.href = faviconPath;

  const normalizeHrefPath = (href) => {
    try {
      const url = new URL(href, window.location.href);
      let pathname = url.pathname.replace(/\/index\.html$/, "/");
      if (pathname !== "/" && !pathname.endsWith("/")) pathname = `${pathname}/`;
      return pathname;
    } catch {
      return href;
    }
  };

  let currentPath = window.location.pathname.replace(/\/index\.html$/, "/");
  if (currentPath !== "/" && !currentPath.endsWith("/")) currentPath = `${currentPath}/`;

  if (nav) {
    const navItems = nav.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      const links = item.querySelectorAll("a[href]");
      let isCurrent = false;
      links.forEach((link) => {
        const matchesCurrent = normalizeHrefPath(link.href) === currentPath;
        if (matchesCurrent) {
          link.setAttribute("aria-current", "page");
          isCurrent = true;
        } else {
          link.removeAttribute("aria-current");
        }
      });
      item.classList.toggle("is-current", isCurrent);
    });

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

  const heroMapVideo = document.querySelector(".hero-map-video");
  const heroMapStage = document.querySelector(".hero-map-stage-video");
  if (heroMapVideo && heroMapStage) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncHeroMotion = () => {
      if (prefersReducedMotion.matches) {
        heroMapStage.classList.add("is-static");
        heroMapVideo.pause();
        heroMapVideo.removeAttribute("autoplay");
      } else {
        heroMapStage.classList.remove("is-static");
        heroMapVideo.setAttribute("autoplay", "");
        const playback = heroMapVideo.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(() => {});
        }
      }
    };

    syncHeroMotion();
    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", syncHeroMotion);
    } else if (typeof prefersReducedMotion.addListener === "function") {
      prefersReducedMotion.addListener(syncHeroMotion);
    }
  }

  const footprintRoot = document.querySelector("[data-footprint-map]");
  if (footprintRoot) {
    const searchInput = footprintRoot.querySelector("[data-footprint-search]");
    const regionSelect = footprintRoot.querySelector("[data-footprint-region]");
    const focusSelect = footprintRoot.querySelector("[data-footprint-focus]");
    const resetButton = footprintRoot.querySelector("[data-footprint-reset]");
    const markerLayer = footprintRoot.querySelector("[data-footprint-markers]");
    const panel = footprintRoot.querySelector("[data-footprint-panel]");
    const footprintData = Array.isArray(window.levelupFootprint) ? window.levelupFootprint : [];

    const uniqueValues = (items, key) =>
      [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    const createOption = (value, label) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      return option;
    };

    uniqueValues(footprintData, "region").forEach((region) => {
      regionSelect?.appendChild(createOption(region, region));
    });

    uniqueValues(footprintData, "focus").forEach((focus) => {
      const label = focus === "accelerators"
        ? "Accelerators"
        : focus.charAt(0).toUpperCase() + focus.slice(1);
      focusSelect?.appendChild(createOption(focus, label));
    });

    const projectPoint = ({ lat, lng }) => ({
      left: `${((lng + 180) / 360) * 100}%`,
      top: `${((90 - lat) / 180) * 100}%`
    });

    const renderPanel = (item, count) => {
      if (!panel) return;

      if (!item) {
        panel.innerHTML = `
          <div class="label">Filtered view</div>
          <h3>${count} location${count === 1 ? "" : "s"} visible</h3>
          <p class="footprint-empty">Choose a marker to inspect the city, region, and focus area.</p>
        `;
        return;
      }

      panel.innerHTML = `
        <div class="label">${item.region} / ${item.focus === "accelerators" ? "Accelerators" : item.focus}</div>
        <h3>${item.city}, ${item.country}</h3>
        <p>${item.summary}</p>
        <ul>${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}</ul>
      `;
    };

    const applyFilters = () => {
      const searchValue = (searchInput?.value || "").trim().toLowerCase();
      const regionValue = regionSelect?.value || "all";
      const focusValue = focusSelect?.value || "all";

      const visibleMarkers = [];

      markerLayer?.querySelectorAll(".footprint-marker").forEach((marker) => {
        const city = marker.getAttribute("data-city") || "";
        const country = marker.getAttribute("data-country") || "";
        const region = marker.getAttribute("data-region") || "";
        const focus = marker.getAttribute("data-focus") || "";

        const matchesSearch =
          !searchValue ||
          city.toLowerCase().includes(searchValue) ||
          country.toLowerCase().includes(searchValue);
        const matchesRegion = regionValue === "all" || region === regionValue;
        const matchesFocus = focusValue === "all" || focus === focusValue;
        const isVisible = matchesSearch && matchesRegion && matchesFocus;

        marker.hidden = !isVisible;
        marker.classList.remove("is-active");
        if (isVisible) visibleMarkers.push(marker);
      });

      renderPanel(null, visibleMarkers.length);
    };

    footprintData.forEach((item, index) => {
      const marker = document.createElement("button");
      const position = projectPoint(item);
      marker.type = "button";
      marker.className = "footprint-marker";
      marker.style.left = position.left;
      marker.style.top = position.top;
      marker.setAttribute("data-city", item.city);
      marker.setAttribute("data-country", item.country);
      marker.setAttribute("data-region", item.region);
      marker.setAttribute("data-focus", item.focus);
      marker.setAttribute("aria-label", `${item.city}, ${item.country}`);
      marker.setAttribute("title", `${item.city}, ${item.country}`);
      marker.style.zIndex = String(10 + index);

      marker.addEventListener("click", () => {
        markerLayer?.querySelectorAll(".footprint-marker").forEach((entry) => {
          entry.classList.remove("is-active");
        });
        marker.classList.add("is-active");
        renderPanel(item, 1);
      });

      markerLayer?.appendChild(marker);
    });

    searchInput?.addEventListener("input", applyFilters);
    regionSelect?.addEventListener("change", applyFilters);
    focusSelect?.addEventListener("change", applyFilters);
    resetButton?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (regionSelect) regionSelect.value = "all";
      if (focusSelect) focusSelect.value = "all";
      applyFilters();
    });

    applyFilters();
  }
});
