// layout.js — single source of truth for navbar + footer
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

  document.addEventListener("DOMContentLoaded", function () {
    const navMount = document.getElementById("site-nav");
    const footerMount = document.getElementById("site-footer");

    if (navMount) navMount.innerHTML = NAVBAR_HTML;
    if (footerMount) footerMount.innerHTML = FOOTER_HTML;

    initNavbar();
  });

  function initNavbar() {
    // Put your single clean navbar toggle, submenu accordion, and active-page logic here
  }
})();
