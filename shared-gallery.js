(() => {
  const getGalleryImgs = () =>
    Array.from(
      document.querySelectorAll(".image-gallery .gallery-item img"),
    ).filter((img) => {
      const src = img.getAttribute("src");
      return src && src.trim() !== "";
    });

  let lightbox = document.getElementById("sharedLightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "sharedLightbox";
    lightbox.className = "shared-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-label", "Image viewer");
    lightbox.innerHTML = `
      <button type="button" class="shared-lightbox__close" id="sharedLightboxClose" aria-label="Close image viewer">X</button>
      <button type="button" class="shared-lightbox__btn shared-lightbox__prev" id="sharedLightboxPrev" aria-label="Previous image">‹</button>
      <div class="shared-lightbox__stage" id="sharedLightboxStage">
        <img class="shared-lightbox__img" id="sharedLightboxImg" src="" alt="" draggable="false">
        <div class="shared-lightbox__caption" id="sharedLightboxCaption"></div>
      </div>
      <button type="button" class="shared-lightbox__btn shared-lightbox__next" id="sharedLightboxNext" aria-label="Next image">›</button>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = document.getElementById("sharedLightboxImg");
  const lightboxCaption = document.getElementById("sharedLightboxCaption");
  const stage = document.getElementById("sharedLightboxStage");
  const btnClose = document.getElementById("sharedLightboxClose");
  const btnPrev = document.getElementById("sharedLightboxPrev");
  const btnNext = document.getElementById("sharedLightboxNext");

  // Zoom steps up to 3x: 1x -> 1.75x -> 2.4x -> 3x -> back to 1x
  const ZOOM_LEVELS = [1, 1.75, 2.4, 3];
  const DRAG_THRESHOLD = 5;

  let currentIndex = 0;
  let zoomIndex = 0;
  let panX = 0;
  let panY = 0;

  let isDragging = false;
  let hasDragged = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let panStartX = 0;
  let panStartY = 0;
  let suppressNextClick = false;

  function clampPan() {
    const scale = ZOOM_LEVELS[zoomIndex];

    if (scale <= 1) {
      panX = 0;
      panY = 0;
      return;
    }

    const maxPanX = Math.max(0, (lightboxImg.offsetWidth * (scale - 1)) / 2);
    const maxPanY = Math.max(0, (lightboxImg.offsetHeight * (scale - 1)) / 2);

    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
  }

  function updateCaption() {
    const imgs = getGalleryImgs();
    if (!imgs.length) return;

    const scale = ZOOM_LEVELS[zoomIndex];
    let zoomHint = "Click image to zoom";

    if (zoomIndex > 0 && zoomIndex < ZOOM_LEVELS.length - 1) {
      zoomHint = `${scale}x zoom — Drag to pan, click to zoom in`;
    } else if (zoomIndex === ZOOM_LEVELS.length - 1) {
      zoomHint = `${scale}x max zoom — Drag to pan, click to reset`;
    }

    lightboxCaption.textContent = `${currentIndex + 1} / ${imgs.length} — ${lightboxImg.alt} (${zoomHint})`;
  }

  function applyTransform() {
    const scale = ZOOM_LEVELS[zoomIndex];
    const isZoomed = scale > 1;

    clampPan();

    lightboxImg.style.transform = isZoomed
      ? `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`
      : "";
    lightboxImg.style.cursor =
      zoomIndex === ZOOM_LEVELS.length - 1
        ? "zoom-out"
        : isZoomed
          ? "grab"
          : "zoom-in";

    lightboxImg.classList.toggle("is-zoomed", isZoomed);
    lightbox.classList.toggle("is-zoomed", isZoomed);
    updateCaption();
  }

  function setZoom(zoomedOrIndex) {
    if (typeof zoomedOrIndex === "boolean") {
      zoomIndex = zoomedOrIndex ? 1 : 0;
    } else {
      zoomIndex = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, zoomedOrIndex));
    }

    if (zoomIndex === 0) {
      panX = 0;
      panY = 0;
    }

    applyTransform();
  }

  function cycleZoom() {
    const nextIndex = (zoomIndex + 1) % ZOOM_LEVELS.length;
    setZoom(nextIndex);
  }

  function render(index) {
    const imgs = getGalleryImgs();
    if (!imgs.length) return;

    currentIndex = ((index % imgs.length) + imgs.length) % imgs.length;
    const sourceImg = imgs[currentIndex];
    lightboxImg.src = sourceImg.currentSrc || sourceImg.src;
    lightboxImg.alt = sourceImg.alt || `Image ${currentIndex + 1}`;
    setZoom(0);
  }

  function open(index) {
    render(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    setZoom(0);
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Event delegation works even if gallery items are populated after page load
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".image-gallery .gallery-item");
    if (!item) return;

    const imgs = getGalleryImgs();
    const img = item.querySelector("img");
    const idx = imgs.indexOf(img);

    if (idx !== -1) {
      open(idx);
    }
  });

  // Start drag tracking when pressing down on a zoomed image
  lightboxImg.addEventListener("pointerdown", (e) => {
    if ((e.button !== 0 && e.pointerType === "mouse") || zoomIndex === 0)
      return;
    e.preventDefault();
    e.stopPropagation();

    isDragging = true;
    hasDragged = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    panStartX = panX;
    panStartY = panY;
    lightboxImg.setPointerCapture(e.pointerId);
    lightboxImg.classList.add("is-dragging");
  });

  lightboxImg.addEventListener("pointermove", (e) => {
    if (!isDragging || zoomIndex === 0) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (!hasDragged && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      hasDragged = true;
    }

    if (hasDragged) {
      panX = panStartX + dx;
      panY = panStartY + dy;
      applyTransform();
    }
  });

  function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;
    lightboxImg.classList.remove("is-dragging");

    if (e && lightboxImg.hasPointerCapture(e.pointerId)) {
      lightboxImg.releasePointerCapture(e.pointerId);
    }

    if (hasDragged) {
      suppressNextClick = true;
      setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }
  }

  lightboxImg.addEventListener("pointerup", stopDragging);
  lightboxImg.addEventListener("pointercancel", stopDragging);

  // Click to zoom further up to 3x, then reset to 1x
  lightboxImg.addEventListener("click", (e) => {
    e.stopPropagation();

    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    cycleZoom();
  });

  // Mouse wheel zoom up to 3x
  lightboxImg.addEventListener(
    "wheel",
    (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      e.preventDefault();

      if (e.deltaY < 0 && zoomIndex < ZOOM_LEVELS.length - 1) {
        setZoom(zoomIndex + 1);
      } else if (e.deltaY > 0 && zoomIndex > 0) {
        setZoom(zoomIndex - 1);
      }
    },
    { passive: false },
  );

  btnClose.addEventListener("click", close);

  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    render(currentIndex - 1);
  });

  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    render(currentIndex + 1);
  });

  // Click dark backdrop outside image/caption to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || (e.target === stage && zoomIndex === 0)) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      if (zoomIndex > 0) setZoom(0);
      else close();
    }

    if (e.key === "ArrowLeft") render(currentIndex - 1);
    if (e.key === "ArrowRight") render(currentIndex + 1);
  });
})();
