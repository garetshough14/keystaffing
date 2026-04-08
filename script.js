const navToggle = document.querySelector(".nav-toggle");
const body = document.body;
const nav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");

const progressBar = document.createElement("div");
progressBar.className = "site-progress";
body.prepend(progressBar);

let targetProgress = 0;
let renderedProgress = 0;
let progressFrame = null;

const renderProgress = () => {
  renderedProgress += (targetProgress - renderedProgress) * 0.14;

  if (Math.abs(targetProgress - renderedProgress) < 0.0015) {
    renderedProgress = targetProgress;
  }

  progressBar.style.transform = `scaleX(${renderedProgress})`;

  if (renderedProgress !== targetProgress) {
    progressFrame = window.requestAnimationFrame(renderProgress);
  } else {
    progressFrame = null;
  }
};

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

  targetProgress = Math.min(Math.max(progress, 0), 1);

  if (!progressFrame) {
    progressFrame = window.requestAnimationFrame(renderProgress);
  }

  if (header) {
    header.classList.toggle("is-scrolled", scrollTop > 16);
  }
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const revealItems = document.querySelectorAll(".reveal");
const countUpItems = document.querySelectorAll(".count-up");

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
});

const animateCount = (node) => {
  if (node.dataset.counted === "true") {
    return;
  }

  const target = Number(node.dataset.count || "0");
  const suffix = node.dataset.suffix || "";

  if (!Number.isFinite(target) || target <= 0) {
    node.dataset.counted = "true";
    return;
  }

  node.dataset.counted = "true";

  const duration = 1450;
  const startTime = performance.now();

  const tick = (time) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = Math.round(target * eased);

    node.textContent = `${value}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    } else {
      node.textContent = `${target}${suffix}`;
    }
  };

  window.requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".count-up").forEach(animateCount);

          if (entry.target.classList.contains("count-up")) {
            animateCount(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -24px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  countUpItems.forEach(animateCount);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();
