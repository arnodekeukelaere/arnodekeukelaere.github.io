// Navigation menu toggle functionality
document.addEventListener("DOMContentLoaded", function () {
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
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(isOpen));
    }
  }

  if (navMenu) {
    if (hamburger) {
      hamburger.addEventListener("click", toggleMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
    }

    if (overlay) {
      overlay.addEventListener("click", closeMenu);
    }

    // Close menu when clicking on a navigation link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when pressing Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        closeMenu();
      }
    });
  }

  // Expand/collapse submenus when clicking the toggle button
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
        const nextOpenState = !parentItem.classList.contains("open");
        setSubmenuState(parentItem, nextOpenState);
      }
    });
  });

  // Mark the current page with .active and expand its parent submenu if nested
  const cleanPathname = decodeURIComponent(
    window.location.pathname.split(/[?#]/)[0],
  );
  const rawPage = cleanPathname.split("/").pop() || "home.html";
  let currentPage = (
    rawPage === "index.html" ? "home.html" : rawPage
  ).toLowerCase();

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
    ) {
      return;
    }

    const cleanHref = decodeURIComponent(href.split(/[?#]/)[0]);
    const rawLinkPage = cleanHref.split("/").pop() || "home.html";
    const linkPage = (
      rawLinkPage === "index.html" ? "home.html" : rawLinkPage
    ).toLowerCase();

    if (linkPage === currentPage) {
      link.classList.add("active");
      const row = link.closest(".menu-row");
      if (row) row.classList.add("has-active-link");

      const parentSubmenu = link.closest(".has-submenu");
      if (parentSubmenu) {
        setSubmenuState(parentSubmenu, true);
      }
    }
  });
});
