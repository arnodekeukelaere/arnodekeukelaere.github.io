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
        <img class="shared-lightbox__img" id="sharedLightboxImg" src="" alt="">
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

  let currentIndex = 0;
  let isZoomed = false;

  function setZoom(zoomed) {
    isZoomed = zoomed;
    lightboxImg.classList.toggle("is-zoomed", isZoomed);
    lightbox.classList.toggle("is-zoomed", isZoomed);
  }

  function render(index) {
    const imgs = getGalleryImgs();
    if (!imgs.length) return;

    setZoom(false);
    currentIndex = ((index % imgs.length) + imgs.length) % imgs.length;
    const sourceImg = imgs[currentIndex];
    lightboxImg.src = sourceImg.currentSrc || sourceImg.src;
    lightboxImg.alt = sourceImg.alt || `Image ${currentIndex + 1}`;
    lightboxCaption.textContent = `${currentIndex + 1} / ${imgs.length} — ${lightboxImg.alt} (Click image to zoom)`;
  }

  function open(index) {
    render(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    setZoom(false);
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

  // Toggle zoom when clicking the enlarged image itself
  lightboxImg.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(!isZoomed);
  });

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
    if (e.target === lightbox || (e.target === stage && !isZoomed)) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      if (isZoomed) setZoom(false);
      else close();
    }
    if (e.key === "ArrowLeft") render(currentIndex - 1);
    if (e.key === "ArrowRight") render(currentIndex + 1);
  });
})();
