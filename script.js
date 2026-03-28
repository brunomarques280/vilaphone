const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const header = document.querySelector(".site-header");
const yearElement = document.getElementById("year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const closeMobileMenu = () => {
  if (!nav || !menuToggle) {
    return;
  }

  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("click", (event) => {
  if (!nav || !menuToggle) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const clickedInsideNav = nav.contains(target);
  const clickedToggle = menuToggle.contains(target);

  if (!clickedInsideNav && !clickedToggle && nav.classList.contains("open")) {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 960) {
    closeMobileMenu();
  }
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

// Adds staggered reveal animation to key cards and sections.
const revealItemSelectors = [
  ".proof-card",
  ".service-card",
  ".experience-card",
  ".gallery-item",
  ".testimonial-card",
  ".location-card",
  ".map-card",
  ".final-cta-content"
];

revealItemSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((item) => item.classList.add("reveal-item"));
});

const revealTargets = document.querySelectorAll(".reveal, .reveal-item");

if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealTargets.forEach((target, index) => {
    const delay = Math.min(index * 45, 420);
    target.style.setProperty("--reveal-delay", `${delay}ms`);
    revealObserver.observe(target);
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryItems = document.querySelectorAll(".gallery-item");

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    const image = item.dataset.image;
    const caption = item.dataset.caption || "";
    const previewImage = item.querySelector("img");

    if (!(previewImage instanceof HTMLImageElement)) {
      return;
    }

    lightboxImage.src = image || previewImage.src;
    lightboxImage.alt = previewImage.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
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
