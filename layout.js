(function () {
  const NAVBAR_HTML = `
  <!-- Navigation Bar -->
  <nav class="navbar">
    <button class="hamburger-menu" id="hamburgerMenu" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <a href="home.html" class="navbar-brand">Arno's game dev portfolio</a>
  </nav>

  <!-- Navigation Menu -->
  <div class="overlay" id="overlay"></div>
  <nav class="nav-menu" id="navMenu">
    <button class="close-btn" id="closeBtn" aria-label="Close menu">×</button>
    <ul>
      <li>
        <div class="menu-row">
          <span class="submenu-spacer" aria-hidden="true"></span>
          <a href="home.html">🏠 Home</a>
        </div>
      </li>

      <li>
        <div class="menu-row">
          <span class="submenu-spacer" aria-hidden="true"></span>
          <a href="project-browser.html">🔍 Project Browser</a>
        </div>
      </li>

      <li class="has-submenu">
        <div class="menu-row">
          <button type="button" class="submenu-toggle" aria-label="Expand Professional Work">
            <span class="chevron">▸</span>
          </button>
          <a href="professional-work.html">💼 Professional Work</a>
        </div>
        <ul class="submenu">
          <li><a href="project-a.html">Project A</a></li>
          <li><a href="project-b.html">Project B</a></li>
        </ul>
      </li>

      <li class="has-submenu">
        <div class="menu-row">
          <button type="button" class="submenu-toggle" aria-label="Expand Personal Projects">
            <span class="chevron">▸</span>
          </button>
          <a href="personal-projects.html">💖 Personal Projects</a>
        </div>
        <ul class="submenu">
          <li><a href="personal-1.html">Personal Game 1</a></li>
        </ul>
      </li>

      <li class="has-submenu">
        <div class="menu-row">
          <button type="button" class="submenu-toggle" aria-label="Expand School Projects">
            <span class="chevron">▸</span>
          </button>
          <a href="school-projects.html">🎓 School Projects</a>
        </div>
        <ul class="submenu">
          <li><a href="school-1.html">Capstone Project</a></li>
        </ul>
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

  function appendDriveDebugLink(imgEl, driveViewerUrl) {
    const parent = imgEl.parentNode;
    if (!parent || parent.querySelector(".drive-debug") || !driveViewerUrl)
      return;
    const dbg = document.createElement("div");
    dbg.className = "drive-debug";
    dbg.innerHTML = `<a href="${driveViewerUrl}" target="_blank" rel="noopener">Open image in Drive (check sharing)</a>`;
    parent.appendChild(dbg);
  }

  function removeDriveDebugLink(imgEl) {
    const parent = imgEl.parentNode;
    if (!parent) return;
    const dbg = parent.querySelector(".drive-debug");
    if (dbg) dbg.remove();
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
        appendDriveDebugLink(imgEl, driveViewerUrl);
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
        removeDriveDebugLink(imgEl);
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

  // ---------- Shared Dark Mode Helpers ----------
  function getSavedDarkMode() {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyDarkMode(isDark) {
    const footer = document.querySelector(".site-footer");
    const darkFooter = document.querySelector(".dark-mode-footer");
    const toggleBtn = document.getElementById("darkModeToggle");

    if (isDark) {
      document.body.style.backgroundColor = "#181A1B";
      document.body.style.color = "#E8E6E3";
      if (footer) footer.style.backgroundColor = "#181A1B";
      if (darkFooter) darkFooter.style.backgroundColor = "#181A1B";
      document.body.setAttribute("data-theme", "dark");
      if (toggleBtn) toggleBtn.innerHTML = "☀️";
    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      if (footer) footer.style.backgroundColor = "white";
      if (darkFooter) darkFooter.style.backgroundColor = "white";
      document.body.setAttribute("data-theme", "light");
      if (toggleBtn) toggleBtn.innerHTML = "🌙";
    }

    localStorage.setItem("darkMode", String(isDark));
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { isDark } }),
    );
  }

  function initDarkMode() {
    const toggleBtn = document.getElementById("darkModeToggle");
    applyDarkMode(getSavedDarkMode());

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        const currentIsDark = localStorage.getItem("darkMode") === "true";
        applyDarkMode(!currentIsDark);
      });
    }
  }

  // ---------- Shared Navbar Helpers ----------
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

    function setSubmenuState(parentItem, isOpen) {
      if (!parentItem) return;
      parentItem.classList.toggle("open", isOpen);
      const toggle = parentItem.querySelector(".submenu-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", String(isOpen));
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

    const rawPage = window.location.pathname.split("/").pop() || "home.html";
    let currentPage =
      decodeURIComponent(rawPage.split(/[?#]/)[0]) || "home.html";
    if (currentPage === "index.html") currentPage = "home.html";

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;

      let linkPage = decodeURIComponent(href.split("/").pop().split(/[?#]/)[0]);
      if (linkPage === "index.html") linkPage = "home.html";

      if (linkPage === currentPage) {
        link.classList.add("active");
        const parentSubmenu = link.closest(".has-submenu");
        if (parentSubmenu) setSubmenuState(parentSubmenu, true);
      }
    });
  }

  // Expose callable helpers to individual pages
  window.SiteUtils = {
    initNavbar,
    initDarkMode,
    applyDarkMode,
    isDarkMode: () => document.body.getAttribute("data-theme") === "dark",
    extractDriveId,
    loadImageWithFallback,
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
