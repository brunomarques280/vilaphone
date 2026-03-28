const nav = document.querySelector(".nav");
const toggleButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");
const yearElement = document.getElementById("year");
const header = document.querySelector(".header");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fallbackImageMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f6e7df"/>
      <stop offset="100%" stop-color="#e9ccd6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" fill="url(#bg)"/>
  <g fill="#7a3c51" opacity="0.75">
    <circle cx="220" cy="250" r="90"/>
    <circle cx="980" cy="1320" r="120"/>
  </g>
  <text x="50%" y="48%" text-anchor="middle" fill="#5a2c3c" font-size="62" font-family="Arial, sans-serif" font-weight="700">
    Espaco Kenne
  </text>
  <text x="50%" y="54%" text-anchor="middle" fill="#5a2c3c" font-size="38" font-family="Arial, sans-serif">
    Imagem em atualizacao
  </text>
</svg>`;
const fallbackImageDataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackImageMarkup)}`;

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (toggleButton && nav) {
  toggleButton.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggleButton?.setAttribute("aria-expanded", "false");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!nav || !toggleButton) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const clickedInsideNav = nav.contains(target);
  const clickedToggle = toggleButton.contains(target);

  if (!clickedInsideNav && !clickedToggle && nav.classList.contains("open")) {
    nav.classList.remove("open");
    toggleButton.setAttribute("aria-expanded", "false");
  }
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }
  header.classList.toggle("scrolled", window.scrollY > 10);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const softRevealElements = document.querySelectorAll(
  ".service-card, .price-card, .gallery-item, .testimonial-card, .location-info, .map-wrap"
);
softRevealElements.forEach((item) => item.classList.add("reveal-soft"));

const revealItems = document.querySelectorAll(".reveal, .reveal-soft");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  const delay = Math.min(index * 60, 420);
  item.style.setProperty("--reveal-delay", `${delay}ms`);
  observer.observe(item);
});

const applyImageFallback = (imageElement) => {
  if (!(imageElement instanceof HTMLImageElement)) {
    return;
  }

  const fallbackSrc = imageElement.dataset.fallbackSrc;
  const hasTriedFallback = imageElement.dataset.fallbackTried === "true";
  const hasPlaceholder = imageElement.dataset.placeholderSet === "true";

  if (fallbackSrc && !hasTriedFallback) {
    imageElement.dataset.fallbackTried = "true";
    imageElement.src = fallbackSrc;
    return;
  }

  if (!hasPlaceholder) {
    imageElement.dataset.placeholderSet = "true";
    imageElement.classList.add("image-fallback");
    imageElement.src = fallbackImageDataUri;
  }
};

const imagesWithFallback = document.querySelectorAll("img[data-fallback-src]");
imagesWithFallback.forEach((imageElement) => {
  imageElement.addEventListener("error", () => applyImageFallback(imageElement));
});

const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const track = carousel.querySelector(".testimonial-track");
  const cards = Array.from(track.querySelectorAll(".testimonial-card"));
  const prevButton = carousel.querySelector(".carousel-btn.prev");
  const nextButton = carousel.querySelector(".carousel-btn.next");

  let currentIndex = 0;
  let cardsPerView = 1;
  let autoSlide;

  const getCardsPerView = () => {
    if (window.innerWidth >= 980) {
      return 3;
    }
    if (window.innerWidth >= 640) {
      return 2;
    }
    return 1;
  };

  const updateCarousel = () => {
    cardsPerView = getCardsPerView();
    carousel.style.setProperty("--cards-per-view", String(cardsPerView));

    const maxIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    const translate = (currentIndex * 100) / cardsPerView;
    track.style.transform = `translateX(-${translate}%)`;
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= maxIndex;
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  };

  prevButton?.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  });

  nextButton?.addEventListener("click", () => {
    goToNext();
  });

  const startAutoSlide = () => {
    if (prefersReducedMotion) {
      return;
    }
    clearInterval(autoSlide);
    autoSlide = setInterval(goToNext, 6500);
  };

  updateCarousel();
  startAutoSlide();

  window.addEventListener("resize", updateCarousel);
  carousel.addEventListener("mouseenter", () => clearInterval(autoSlide));
  carousel.addEventListener("mouseleave", startAutoSlide);
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryItems = document.querySelectorAll(".gallery-item");

const closeLightbox = () => {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.dataset.image;
    const caption = item.dataset.caption || "";
    const preview = item.querySelector("img");

    if (!lightbox || !lightboxImage || !preview) {
      return;
    }

    lightboxImage.classList.remove("image-fallback");
    lightboxImage.dataset.fallbackTried = "false";
    lightboxImage.dataset.placeholderSet = "false";
    lightboxImage.dataset.fallbackSrc = preview.dataset.fallbackSrc || preview.src;
    lightboxImage.src = image || preview.src;
    lightboxImage.alt = preview.alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

lightboxImage?.addEventListener("error", () => {
  if (!lightboxImage) {
    return;
  }
  applyImageFallback(lightboxImage);
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
