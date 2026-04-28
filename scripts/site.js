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

      if (trigger) {
        trigger.addEventListener("click", (event) => {
          if (window.innerWidth > 820) return;

          const submenu = item.querySelector(".nav-submenu");
          if (!submenu) return;

          event.preventDefault();
          const willOpen = item.dataset.open !== "true";
          navItems.forEach((other) => {
            other.dataset.open = "false";
            const otherTrigger = other.querySelector("[data-nav-trigger]");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          });
          item.dataset.open = String(willOpen);
          trigger.setAttribute("aria-expanded", String(willOpen));
        });
      }

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

  const diagramMediaNames = new Set([
    "levelup-build-cycle.png",
    "levelup-builder-economy.png",
    "levelup-building-strong-economies.png",
    "levelup-city-illustration.png",
    "levelup-foundation-framework.png",
    "levelup-five-pillar-systems.png",
    "levelup-homepage-diagram.png",
    "levelup-homepage-model-video.mp4",
    "levelup-homepage-systems-map.png",
    "levelup-partnership-table.png",
    "levhub-platform-concept-v2.png",
    "world-map-ghost.svg"
  ]);

  const panelMediaSelectors = [
    ".hero-visual-panel",
    ".home-systems-visual",
    ".home-initiative-visual"
  ].join(", ");

  const getMediaFilename = (element) => {
    if (!element) return "";

    const candidate =
      element.getAttribute("src") ||
      element.currentSrc ||
      element.querySelector("source")?.getAttribute("src") ||
      "";

    if (!candidate) return "";

    try {
      const url = new URL(candidate, window.location.href);
      return url.pathname.split("/").pop() || "";
    } catch {
      return candidate.split("/").pop() || "";
    }
  };

  document.querySelectorAll(panelMediaSelectors).forEach((panel) => {
    const media = panel.querySelector("img, video");
    const filename = getMediaFilename(media);
    const explicitFit = panel.dataset.mediaFit || "";

    panel.classList.remove("is-photo", "is-diagram", "is-diagram-tight");

    if (explicitFit === "cover") {
      panel.classList.add("is-photo");
      return;
    }

    if (explicitFit === "contain") {
      panel.classList.add("is-diagram");
      return;
    }

    if (explicitFit === "contain-tight") {
      panel.classList.add("is-diagram", "is-diagram-tight");
      return;
    }

    if (!filename) return;

    const isDiagram = diagramMediaNames.has(filename);
    panel.classList.toggle("is-diagram", isDiagram);
    panel.classList.toggle("is-photo", !isDiagram);
  });

  const footprintRoot = document.querySelector("[data-footprint-map]");
  if (footprintRoot) {
    const searchInput = footprintRoot.querySelector("[data-footprint-search]");
    const regionSelect = footprintRoot.querySelector("[data-footprint-region]");
    const focusSelect = footprintRoot.querySelector("[data-footprint-focus]");
    const resetButton = footprintRoot.querySelector("[data-footprint-reset]");
    const mapElement = footprintRoot.querySelector("[data-footprint-leaflet-map]");
    const panel = footprintRoot.querySelector("[data-footprint-panel]");
    const visibleLocationCount = footprintRoot.querySelector("[data-footprint-visible-locations]");
    const visibleProjectCount = footprintRoot.querySelector("[data-footprint-visible-projects]");
    const activeProjectCount = footprintRoot.querySelector("[data-footprint-active-projects]");
    const footprintData = Array.isArray(window.levelupFootprint) ? window.levelupFootprint : [];
    let activeItem = null;
    let activeLocation = null;
    const leafletMarkers = [];
    const leafletRoutes = [];

    const uniqueValues = (items, key) =>
      [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    const focusLabel = (focus) => {
      if (focus === "accelerators") return "Accelerators";
      return focus.charAt(0).toUpperCase() + focus.slice(1);
    };

    const markerTheme = (item) => {
      if (item.status === "active") return "clay";
      if (item.focus === "capital" || item.focus === "accelerators") return "gold";
      if (item.focus === "institutions" || item.focus === "ecosystems") return "green";
      if (item.focus === "employers") return "blue";
      return "blue";
    };

    const themeColor = (theme) => {
      if (theme === "clay") return "#ff624a";
      if (theme === "gold") return "#fdd837";
      if (theme === "green") return "#05c145";
      return "#29baee";
    };

    const groupedLocations = Array.from(
      footprintData.reduce((map, item) => {
        const key = `${item.city}__${item.country}`;
        if (!map.has(key)) {
          map.set(key, {
            city: item.city,
            country: item.country,
            region: item.region,
            lat: item.lat,
            lng: item.lng,
            projects: []
          });
        }
        map.get(key).projects.push(item);
        return map;
      }, new Map()).values()
    ).map((location) => ({
      ...location,
      focuses: [...new Set(location.projects.map((project) => project.focus))],
      statuses: [...new Set(location.projects.map((project) => project.status || "past"))],
      markerTheme: location.projects.some((project) => (project.status || "past") === "active")
        ? "clay"
        : markerTheme(location.projects[0])
    }));

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
      focusSelect?.appendChild(createOption(focus, focusLabel(focus)));
    });

    const updateCounts = (items) => {
      const projectCount = items.reduce((sum, item) => sum + item.projects.length, 0);
      const activeCount = items.filter((item) => item.statuses.includes("active")).length;
      if (visibleLocationCount) visibleLocationCount.textContent = String(items.length);
      if (visibleProjectCount) visibleProjectCount.textContent = String(projectCount);
      if (activeProjectCount) activeProjectCount.textContent = String(activeCount);
    };

    const renderPanel = (item, count) => {
      if (!panel) return;

      if (!item) {
        panel.innerHTML = `
          <div class="label">Filtered view</div>
          <h3>${count} location${count === 1 ? "" : "s"} visible</h3>
          <p class="footprint-empty">Choose a marker, search, or filter to inspect the city, region, and focus area.</p>
        `;
        return;
      }

      const locationLabel = item.focuses.length === 1
        ? focusLabel(item.focuses[0])
        : `${item.focuses.length} focus areas`;
      const locationStatus = item.statuses.includes("active") ? "Active" : "Past";
      const projectsMarkup = item.projects.map((project) => `
        <li>
          <strong>${project.projectTitle}</strong>
          <span>${focusLabel(project.focus)} / ${project.status === "active" ? "Active" : "Past"}</span>
          <a class="button secondary" href="${project.projectUrl}">View project</a>
        </li>
      `).join("");

      panel.innerHTML = `
        <div class="label">${item.region} / ${locationLabel} / ${locationStatus}</div>
        <h3>${item.city}, ${item.country}</h3>
        <p class="footprint-project-title">${item.projects.length} project${item.projects.length === 1 ? "" : "s"} in this city</p>
        <ul>${item.projects[0].highlights.map((highlight) => `<li>${highlight}</li>`).join("")}</ul>
        <div class="footprint-project-list">
          <div class="label">Projects</div>
          <ul>${projectsMarkup}</ul>
        </div>
      `;
    };

    const mapIsAvailable = mapElement && window.L;
    if (!mapIsAvailable) return;

    const map = window.L.map(mapElement, {
      center: [18, 12],
      zoom: 2,
      minZoom: 1,
      maxZoom: 7,
      maxBounds: [[-82, -180], [84, 180]],
      maxBoundsViscosity: 0.9,
      worldCopyJump: false,
      scrollWheelZoom: false,
      zoomControl: false
    });

    window.L.control.zoom({ position: "bottomright" }).addTo(map);

    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 20,
      noWrap: true
    }).addTo(map);

    const routeLayer = window.L.layerGroup().addTo(map);
    const markerLayer = window.L.layerGroup().addTo(map);
    const seattleLatLng = window.L.latLng(47.6062, -122.3321);

    const makeMarkerIcon = (item, isActive = false) => window.L.divIcon({
      className: `leaflet-footprint-marker${isActive ? " is-active" : ""}`,
      html: `<span style="--marker-color: ${themeColor(item.markerTheme)}"></span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -14]
    });

    const popupMarkup = (item) => {
      const projectLinks = item.projects.map((project) => `
        <li><a href="${project.projectUrl}">${project.projectTitle}</a></li>
      `).join("");
      return `
        <div class="footprint-popup-kicker">${item.region}</div>
        <h3>${item.city}</h3>
        <p>${item.projects.length} project${item.projects.length === 1 ? "" : "s"}</p>
        <ul>${projectLinks}</ul>
      `;
    };

    const setActiveLocation = (item, marker) => {
      activeItem = item;
      activeLocation = marker;
      leafletMarkers.forEach((entry) => {
        entry.marker.setIcon(makeMarkerIcon(entry.item, entry.marker === marker));
      });
      leafletRoutes.forEach((entry) => {
        entry.route.setStyle({
          opacity: entry.item === item ? 0.78 : 0.26,
          weight: entry.item === item ? 2.8 : 1.4
        });
      });
      renderPanel(item, 1);
      marker.openPopup();
      map.flyTo([item.lat, item.lng], Math.max(map.getZoom(), 4), { duration: 0.65 });
    };

    const applyFilters = () => {
      const searchValue = (searchInput?.value || "").trim().toLowerCase();
      const regionValue = regionSelect?.value || "all";
      const focusValue = focusSelect?.value || "all";

      const visibleItems = [];

      leafletMarkers.forEach(({ item, marker }) => {
        const matchesSearch =
          !searchValue ||
          item.city.toLowerCase().includes(searchValue) ||
          item.country.toLowerCase().includes(searchValue);
        const matchesRegion = regionValue === "all" || item.region === regionValue;
        const matchesFocus = focusValue === "all" || item.focuses.includes(focusValue);
        const isVisible = matchesSearch && matchesRegion && matchesFocus;

        if (isVisible) {
          marker.addTo(markerLayer);
          visibleItems.push(item);
        } else {
          marker.removeFrom(markerLayer);
        }

        if (!isVisible && marker === activeLocation) {
          activeItem = null;
          activeLocation = null;
        }
      });

      leafletRoutes.forEach(({ item, route }) => {
        const isVisible = Boolean(item && visibleItems.includes(item));
        if (isVisible) {
          route.addTo(routeLayer);
          route.setStyle({
            opacity: activeItem && item === activeItem ? 0.78 : 0.26,
            weight: activeItem && item === activeItem ? 2.8 : 1.4
          });
        } else {
          route.removeFrom(routeLayer);
        }
      });

      updateCounts(visibleItems);

      if (activeItem && activeLocation && visibleItems.includes(activeItem)) {
        renderPanel(activeItem, visibleItems.length);
      } else {
        map.closePopup();
        renderPanel(null, visibleItems.length);
      }

      if (visibleItems.length) {
        const bounds = window.L.latLngBounds(visibleItems.map((item) => [item.lat, item.lng]));
        map.fitBounds(bounds.pad(0.18), { animate: true, duration: 0.45, maxZoom: 4 });
      }
    };

    groupedLocations.forEach((item) => {
      const marker = window.L.marker([item.lat, item.lng], {
        icon: makeMarkerIcon(item),
        keyboard: true,
        title: `${item.city}, ${item.country}`,
        alt: `${item.city}, ${item.country}`
      }).bindPopup(popupMarkup(item), {
        closeButton: true,
        autoPan: true,
        maxWidth: 320
      });

      marker.on("click", () => {
        setActiveLocation(item, marker);
      });

      marker.addTo(markerLayer);
      leafletMarkers.push({ item, marker });

      if (item.city !== "Seattle") {
        const route = window.L.polyline([seattleLatLng, [item.lat, item.lng]], {
          color: "#111111",
          opacity: 0.26,
          weight: 1.4,
          dashArray: "6 8",
          interactive: false
        }).addTo(routeLayer);
        leafletRoutes.push({ item, route });
      }
    });

    searchInput?.addEventListener("input", applyFilters);
    regionSelect?.addEventListener("change", applyFilters);
    focusSelect?.addEventListener("change", applyFilters);
    resetButton?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (regionSelect) regionSelect.value = "all";
      if (focusSelect) focusSelect.value = "all";
      activeItem = null;
      activeLocation = null;
      leafletMarkers.forEach((entry) => entry.marker.setIcon(makeMarkerIcon(entry.item)));
      map.closePopup();
      applyFilters();
    });

    footprintRoot.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        activeItem = null;
        activeLocation = null;
        leafletMarkers.forEach((entry) => entry.marker.setIcon(makeMarkerIcon(entry.item)));
        map.closePopup();
        applyFilters();
      }
    });

    setTimeout(() => map.invalidateSize(), 100);
    applyFilters();
  }
});
