(function () {
  const NAVBAR_HTML = `
  <!-- Navigation Bar -->
  <nav class="navbar">
    <button class="hamburger-menu" id="hamburgerMenu" aria-label="Toggle menu">
    <svg
      class="hamburger-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 7h18"></path>
      <path d="M3 12h18"></path>
      <path d="M3 17h18"></path>
    </svg>
    </button>
    <a href="/home.html" class="navbar-brand">Arno's game dev portfolio</a>
  </nav>

  <!-- Navigation Menu -->
  <div class="overlay" id="overlay"></div>
  <nav class="nav-menu" id="navMenu">
    <button class="close-btn" id="closeBtn" aria-label="Close menu">×</button>
    <ul>
      <li>
        <div class="menu-row">
          <span class="submenu-spacer" aria-hidden="true"></span>
          <a href="/home.html">🏠 Home</a>
        </div>
      </li>

      <li>
        <div class="menu-row">
          <span class="submenu-spacer" aria-hidden="true"></span>
          <a href="/project-browser.html">🔍 Project Browser</a>
        </div>
      </li>
            
        <li class="has-submenu">
        <div class="menu-row">
            <button type="button" class="submenu-toggle" aria-label="Expand Professional Work" aria-expanded="false">
            <svg class="chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
            </button>
            <a href="/professional-work.html">💼 Professional Work</a>
        </div>
        <ul class="submenu" data-category="Professional"></ul>
        </li>

        <li class="has-submenu">
        <div class="menu-row">
            <button type="button" class="submenu-toggle" aria-label="Expand Personal Projects" aria-expanded="false">
            <svg class="chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
            </button>
            <a href="/personal-projects.html">💖 Personal Projects</a>
        </div>
        <ul class="submenu" data-category="Personal"></ul>
        </li>

        <li class="has-submenu">
        <div class="menu-row">
            <button type="button" class="submenu-toggle" aria-label="Expand School Projects" aria-expanded="false">
            <svg class="chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
            </button>
            <a href="/school-projects.html">🎓 School Projects</a>
        </div>
        <ul class="submenu" data-category="School"></ul>
        </li>

      <li>
        <div class="menu-row">
          <span class="submenu-spacer" aria-hidden="true"></span>
          <a href="https://www.linkedin.com/in/arno-de-keukelaere/" target="_blank" rel="noopener">
            <img src="https://drive.google.com/thumbnail?id=1wdxRxAruFFHWv3JZPi40702IOtYZCxHg&sz=w100" alt="" width="18"
              style="vertical-align: middle; margin-right: 6px;">
            My LinkedIn
          </a>
        </div>
      </li>
    </ul>
  </nav>
  `;

  const FOOTER_HTML = `
  <!-- Footer with social links -->
  <footer class="dark-mode-footer">
    <button class="dark-mode-toggle" id="darkModeToggle" aria-label="Toggle dark mode">
      🌙
    </button>
  </footer>

  <footer class="site-footer">
    <div class="social-links">
      <a href="http://www.linkedin.com/in/arno-de-keukelaere" target="_blank" rel="noopener" aria-label="LinkedIn">
        <img src="https://drive.google.com/thumbnail?id=1wdxRxAruFFHWv3JZPi40702IOtYZCxHg&sz=w100" alt="LinkedIn"
          width="24" height="24">
      </a>
      <a href="https://arnodk.itch.io/" target="_blank" rel="noopener" aria-label="Itch.io">
        <img src="https://drive.google.com/thumbnail?id=1jkQBDXg4FjHMQY3CrHJ9wc7husFkJBwA&sz=w100" alt="Itch.io"
          width="24" height="24">
      </a>
      <a href="https://sbox.game/clubthirtythree/~packages?type=game" target="_blank" rel="noopener"
        aria-label="Sandbox">
        <img src="https://drive.google.com/thumbnail?id=1gDT_V8Hc5DUCX50qw0yaqtdIxZ3O35ae&sz=w100" alt="Sandbox"
          width="24" height="24">
      </a>
      <a href="https://www.youtube.com/playlist?list=PL-5o8zOni7f-ntX9gvucEsez4_Bsc1_W_" target="_blank" rel="noopener"
        aria-label="YouTube">
        <img src="https://drive.google.com/thumbnail?id=1pHN4MVrh-FuQW4E0RbDda4_AheYODE_p&sz=w100" alt="YouTube"
          width="24" height="24">
      </a>
    </div>
  </footer>
  `;

  // ---------- Shared Drive Image Helpers ----------
  function extractDriveId(url) {
    if (!url) return null;
    let m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return m[1];
    m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return m[1];
    if (/^[a-zA-Z0-9_-]{10,}$/.test(url)) return url;
    return null;
  }

  function makeDriveCandidates(fileId) {
    if (!fileId) return [];
    return [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
      `https://lh3.googleusercontent.com/d/${fileId}`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}`,
    ];
  }

  function toggleDriveDebugLink(imgEl, driveViewerUrl, show) {
    const parent = imgEl.parentNode;
    if (!parent) return;
    const existing = parent.querySelector(".drive-debug");

    if (!show) {
      if (existing) existing.remove();
      return;
    }

    if (existing || !driveViewerUrl) return;
    const dbg = document.createElement("div");
    dbg.className = "drive-debug";
    dbg.innerHTML = `<a href="${driveViewerUrl}" target="_blank" rel="noopener">Open image in Drive (check sharing)</a>`;
    parent.appendChild(dbg);
  }

  function loadImageWithFallback(imgEl, originalUrl, driveViewerUrl) {
    const candidates = [];
    if (originalUrl) candidates.push(originalUrl);
    const driveId = extractDriveId(originalUrl || driveViewerUrl);
    if (driveId) {
      makeDriveCandidates(driveId).forEach((c) => {
        if (!candidates.includes(c)) candidates.push(c);
      });
    }
    const placeholder =
      "https://via.placeholder.com/200?text=Image+unavailable";
    if (!candidates.includes(placeholder)) candidates.push(placeholder);

    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        toggleDriveDebugLink(imgEl, driveViewerUrl, true);
        return;
      }
      const url = candidates[idx++];
      let settled = false;
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        tryNext();
      }, 5000);

      imgEl.onload = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        toggleDriveDebugLink(imgEl, driveViewerUrl, false);
      };
      imgEl.onerror = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        tryNext();
      };
      imgEl.src = url;
    };
    tryNext();
  }

  // ---------- Shared Project Card & Data Helpers ----------
  const jsonCache = new Map();

  function fetchJson(url) {
    if (!jsonCache.has(url)) {
      const request = fetch(url).then((response) => {
        if (!response.ok) {
          jsonCache.delete(url);
          throw new Error(`Failed to load ${url}`);
        }
        return response.json();
      });
      jsonCache.set(url, request);
    }
    return jsonCache.get(url);
  }

  function createProjectCard(project, options = {}) {
    const {
      showCategory = false,
      showRelease = true,
      showTags = false,
    } = options;

    const rawUrl = (project.url || "#").trim();
    const a = document.createElement("a");
    a.href = project.url || "#";
    a.className = "project";

    const isExternal = (() => {
      if (!rawUrl || rawUrl.startsWith("#")) return false;
      if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
        return false;
      }
      try {
        return new URL(a.href).hostname !== window.location.hostname;
      } catch {
        return true;
      }
    })();

    if (isExternal) {
      // only _blank when project leads outside of website
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const thumb = document.createElement("img");
    thumb.className = "thumbnail";
    thumb.alt = project.title || "Project thumbnail";
    thumb.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    a.appendChild(thumb);
    loadImageWithFallback(thumb, project.thumbnail, project.driveViewer);

    const info = document.createElement("div");
    info.className = "project-info";

    if (showCategory && project.tags && project.tags.length > 0) {
      const categoryLabels = {
        Professional: "Professional work:",
        Personal: "Personal project:",
        School: "School project:",
      };
      const category = document.createElement("p");
      category.style.fontWeight = "bold";
      category.style.margin = "0 0 5px 0";
      category.style.color = "#000";

      const matchedTag = project.tags.find((tag) => categoryLabels[tag]);
      category.textContent = matchedTag
        ? categoryLabels[matchedTag]
        : "Project:";
      info.appendChild(category);
    }

    const title = document.createElement("h2");
    title.textContent = project.title;
    info.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = project.description;
    info.appendChild(desc);

    if (showRelease && project.release) {
      const date = document.createElement("p");
      date.textContent = "Release date: " + project.release;
      date.className = "release-date";
      info.appendChild(date);
    }

    if (showTags) {
      const tagsDiv = document.createElement("div");
      tagsDiv.className = "tags";

      [...(project.tags || []), ...(project.platforms || [])].forEach(
        (label) => {
          const span = document.createElement("span");
          span.className = "tag";
          span.textContent = label;
          tagsDiv.appendChild(span);
        },
      );

      info.appendChild(tagsDiv);
    }

    a.appendChild(info);
    return a;
  }

  // ---------- Shared Dark Mode Helpers ----------
  function getSavedDarkMode() {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyDarkMode(isDark) {
    const effectiveDark = Boolean(isDark);

    const header = document.querySelector(".site-nav");
    const navBar = document.querySelector(".navbar");
    const navBarBrand = document.querySelector(".navbar-brand");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    const navMenu = document.querySelector(".nav-menu");
    const closeBtn = document.querySelector(".close-btn");
    const submenuToggles = document.querySelectorAll(".submenu-toggle");
    const menuRows = document.querySelectorAll(".menu-row");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const footer = document.querySelector(".site-footer");
    const darkFooter = document.querySelector(".dark-mode-footer");
    const toggleBtn = document.getElementById("darkModeToggle");

    const bg = effectiveDark ? "#181A1B" : "white";
    const navbarBg = effectiveDark ? "#181A1B" : "white";
    const navbarFg = effectiveDark ? "white" : "#181A1B";
    const brandFg = effectiveDark ? "white" : "black";
    const brandHoverFg = effectiveDark ? "#4da6ff" : "darkblue";
    const hamburgerFg = effectiveDark ? "white" : "black";
    const menuBg = effectiveDark ? "#181A1B" : "white";
    const closeBtnFg = effectiveDark ? "white" : "black";
    const rowHoverBg = effectiveDark
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(0, 0, 0, 0.05)";
    const toggleFg = effectiveDark ? "#cecece" : "#333";
    const toggleHoverBg = effectiveDark
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.08)";
    const toggleHoverFg = effectiveDark ? "white" : "black";
    const linkFg = effectiveDark ? "white" : "black";
    const linkHoverFg = effectiveDark ? "lightsteelblue" : "darkblue";
    const activeIndicatorBg = effectiveDark ? "#ffffff" : "#000000";
    const submenuBg = effectiveDark
      ? "rgba(255, 255, 255, 0.015)"
      : "rgba(0, 0, 0, 0.03)";
    const submenuHoverBg = effectiveDark
      ? "rgba(255, 255, 255, 0.015)"
      : "rgba(0, 0, 0, 0.05)";

    // Drives .menu-row:has(a.active)::before and .submenu li:has(a.active)::before
    document.documentElement.style.setProperty(
      "--active-indicator-bg",
      activeIndicatorBg,
    );
    document.documentElement.style.setProperty("--nav-link-fg", linkFg);
    document.documentElement.style.setProperty(
      "--nav-link-hover-fg",
      linkHoverFg,
    );
    document.documentElement.style.setProperty("--submenu-bg", submenuBg);
    document.documentElement.style.setProperty(
      "--submenu-hover-bg",
      submenuHoverBg,
    );

    if (header) {
      header.style.backgroundColor = navbarBg;
      header.style.color = navbarFg;
    }

    if (navBar) {
      navBar.style.backgroundColor = navbarBg;
      navBar.style.color = navbarFg;
    }

    if (navBarBrand) {
      navBarBrand.style.color = brandFg;
      navBarBrand.onmouseenter = () => {
        navBarBrand.style.color = brandHoverFg;
      };
      navBarBrand.onmouseleave = () => {
        navBarBrand.style.color = brandFg;
      };
    }

    if (hamburgerMenu) {
      hamburgerMenu.style.color = hamburgerFg;
    }
    if (hamburgerIcon) {
      hamburgerIcon.style.color = hamburgerFg;
    }

    if (navMenu) {
      navMenu.style.backgroundColor = menuBg;
      navMenu.style.color = linkFg;
    }

    if (closeBtn) {
      closeBtn.style.color = closeBtnFg;
    }

    menuRows.forEach((row) => {
      row.style.backgroundColor = "";
      row.onmouseenter = () => {
        row.style.backgroundColor = rowHoverBg;
      };
      row.onmouseleave = () => {
        row.style.backgroundColor = "";
      };
    });

    submenuToggles.forEach((btn) => {
      btn.style.color = toggleFg;
      btn.style.backgroundColor = "";
      btn.onmouseenter = () => {
        btn.style.backgroundColor = toggleHoverBg;
        btn.style.color = toggleHoverFg;
      };
      btn.onmouseleave = () => {
        btn.style.backgroundColor = "";
        btn.style.color = toggleFg;
      };
    });

    navLinks.forEach((link) => {
      link.style.color = linkFg;
      link.onmouseenter = () => {
        link.style.color = linkHoverFg;
      };
      link.onmouseleave = () => {
        link.style.color = linkFg;
      };
    });

    // if (footer) {
    //   footer.style.backgroundColor = bg;
    // }
    // if (darkFooter) {
    //   darkFooter.style.backgroundColor = bg;
    // }

    document.documentElement.setAttribute(
      "data-theme",
      effectiveDark ? "dark" : "light",
    );
    document.body.setAttribute("data-theme", effectiveDark ? "dark" : "light");
    if (toggleBtn) toggleBtn.innerHTML = effectiveDark ? "☀️" : "🌙";

    localStorage.setItem("darkMode", String(effectiveDark));
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { isDark: effectiveDark } }),
    );
  }

  function isDarkMode() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function initDarkMode() {
    const toggleBtn = document.getElementById("darkModeToggle");
    applyDarkMode(getSavedDarkMode());

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        applyDarkMode(!isDarkMode());
      });
    }
  }

  // ---------- Shared Navbar Helpers ----------
  function normalizePageName(path) {
    const raw = (path || "").split("/").pop().split(/[?#]/)[0];
    const decoded = decodeURIComponent(raw) || "home.html";
    return decoded === "index.html" ? "home.html" : decoded;
  }

  function setSubmenuState(parentItem, isOpen) {
    if (!parentItem) return;
    parentItem.classList.toggle("open", isOpen);
    const toggle = parentItem.querySelector(".submenu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", String(isOpen));
  }

  function highlightActiveNavLinks() {
    const currentPage = normalizePageName(window.location.pathname);

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;

      if (normalizePageName(href) === currentPage) {
        link.classList.add("active");
        const parentSubmenu = link.closest(".has-submenu");
        if (parentSubmenu) setSubmenuState(parentSubmenu, true);
      }
    });
  }

  async function populateNavbarSubmenus(closeMenu) {
    try {
      const projects = await fetchJson("/projects.json");

      document
        .querySelectorAll(".nav-menu .submenu[data-category]")
        .forEach((submenu) => {
          const category = submenu.getAttribute("data-category");
          const matchingProjects = projects
            .filter((p) => p.tags && p.tags.includes(category))
            .sort((a, b) => (b.release || 0) - (a.release || 0));

          submenu.innerHTML = "";

          // If a category has no sub-projects, swap the toggle button for a spacer
          const parentItem = submenu.closest(".has-submenu");
          if (matchingProjects.length === 0 && parentItem) {
            const toggle = parentItem.querySelector(".submenu-toggle");
            if (toggle) {
              const spacer = document.createElement("span");
              spacer.className = "submenu-spacer";
              spacer.setAttribute("aria-hidden", "true");
              toggle.replaceWith(spacer);
            }
            return;
          }

          matchingProjects.forEach((project) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            const rawHref = (project.url || "#").trim();

            let href = rawHref;
            if (
              rawHref &&
              !rawHref.startsWith("http://") &&
              !rawHref.startsWith("https://") &&
              !rawHref.startsWith("#") &&
              !rawHref.startsWith("/")
            ) {
              // Prefix with "/" so it resolves from the site root instead of the current subfolder
              href = `/${rawHref.replace(/^\.?\//, "")}`;
            }

            a.href = href;
            a.textContent = project.title;

            if (href.startsWith("http")) {
              a.target = "_blank";
              a.rel = "noopener";
            }

            a.addEventListener("click", closeMenu);
            li.appendChild(a);
            submenu.appendChild(li);
          });
        });

      // Re-run active link highlighting so injected sub-pages get .active & auto-expand
      highlightActiveNavLinks();
      // Re-apply current theme so newly injected submenu links match the active theme
      applyDarkMode(getSavedDarkMode());
    } catch (error) {
      console.error("Error populating navbar submenus:", error);
    }
  }

  function initNavbar() {
    const hamburger = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".nav-menu");
    const overlay = document.querySelector(".overlay");
    const closeBtn = document.querySelector(".close-btn");

    function setMenuState(isOpen) {
      if (hamburger) hamburger.classList.toggle("active", isOpen);
      if (navMenu) navMenu.classList.toggle("active", isOpen);
      if (overlay) overlay.classList.toggle("active", isOpen);
    }

    function closeMenu() {
      setMenuState(false);
    }

    function toggleMenu() {
      const isOpen = navMenu ? !navMenu.classList.contains("active") : false;
      setMenuState(isOpen);
    }

    if (navMenu) {
      if (hamburger) hamburger.addEventListener("click", toggleMenu);
      if (closeBtn) closeBtn.addEventListener("click", closeMenu);
      if (overlay) overlay.addEventListener("click", closeMenu);

      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navMenu.classList.contains("active")) {
          closeMenu();
        }
      });
    }

    document.querySelectorAll(".submenu-toggle").forEach((toggle) => {
      const parentItem = toggle.closest(".has-submenu");
      toggle.setAttribute(
        "aria-expanded",
        String(parentItem ? parentItem.classList.contains("open") : false),
      );

      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (parentItem) {
          setSubmenuState(parentItem, !parentItem.classList.contains("open"));
        }
      });
    });

    highlightActiveNavLinks();
    populateNavbarSubmenus(closeMenu);
  }

  // Expose callable helpers to individual pages
  window.SiteUtils = {
    initNavbar,
    initDarkMode,
    applyDarkMode,
    isDarkMode: () => document.body.getAttribute("data-theme") === "dark",
    extractDriveId,
    loadImageWithFallback,
    createProjectCard,
    fetchJson,
  };

  // Run automatically on every page
  document.addEventListener("DOMContentLoaded", function () {
    const navMount = document.getElementById("site-nav");
    const footerMount = document.getElementById("site-footer");

    if (navMount) navMount.innerHTML = NAVBAR_HTML;
    if (footerMount) footerMount.innerHTML = FOOTER_HTML;

    initNavbar();
    initDarkMode();
  });
})();
