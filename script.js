const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const header = document.querySelector(".site-header");
const yearElement = document.getElementById("year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const closeMenu = () => {
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
  link.addEventListener("click", closeMenu);
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
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 960) {
    closeMenu();
  }
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const revealItemSelectors = [
  ".proof-card",
  ".service-card",
  ".differential-card",
  ".gallery-item",
  ".testimonial-card",
  ".location-card",
  ".map-card",
  ".final-cta-box"
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
