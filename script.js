const navToggle = document.querySelector(".nav-toggle");
const body = document.body;
const nav = document.querySelector(".site-nav");
const contactBranches = [
  {
    name: "Bakersfield",
    address: "4900 California Ave, Suite 400A, Bakersfield, CA 93309",
    phone: "661-566-9333",
    phoneHref: "16615669333",
    email: "keystaffing@hirekeystaff.com",
  },
  {
    name: "Visalia",
    address: "1039 N Demaree St, Visalia, CA 93291",
    phone: "559-429-5520",
    phoneHref: "15594295520",
    email: "ksc-tk@hirekeystaff.com",
  },
];

const progressBar = document.createElement("div");
progressBar.className = "site-progress";
body.prepend(progressBar);

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a, button").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const buildContactModal = () => {
  const modal = document.createElement("div");
  modal.className = "contact-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="contact-modal__backdrop" data-contact-close></div>
    <section class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button class="contact-modal__close" type="button" data-contact-close aria-label="Close contact options">Close</button>
      <p class="eyebrow">Contact KSC</p>
      <h2 class="display-sm" id="contact-modal-title">Choose the branch you need.</h2>
      <p class="contact-modal__copy">Both numbers can receive calls and texts. Pick the location that best matches your need.</p>
      <div class="branch-grid">
        ${contactBranches.map((branch) => `
          <article class="branch-card">
            <p class="card-label">${branch.name}</p>
            <h3>${branch.address}</h3>
            <div class="branch-actions">
              <a class="button" href="tel:${branch.phoneHref}">Call ${branch.phone}</a>
              <a class="button button-ghost" href="sms:${branch.phoneHref}">Text ${branch.phone}</a>
              <a class="branch-email" href="mailto:${branch.email}">${branch.email}</a>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;

  body.append(modal);
  return modal;
};

const contactModal = buildContactModal();

const openContactModal = () => {
  contactModal.hidden = false;
  body.classList.add("modal-open");
  contactModal.querySelector(".contact-modal__close")?.focus();
};

const closeContactModal = () => {
  contactModal.hidden = true;
  body.classList.remove("modal-open");
};

document.querySelectorAll("[data-contact-open]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openContactModal();
  });
});

contactModal.querySelectorAll("[data-contact-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeContactModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !contactModal.hidden) {
    closeContactModal();
  }
});

const buildCookieNotice = () => {
  if (window.localStorage.getItem("kscCookieConsent") === "accepted") {
    return;
  }

  const notice = document.createElement("section");
  notice.className = "cookie-notice";
  notice.setAttribute("aria-label", "Cookie notice");
  notice.innerHTML = `
    <p>We use cookies and similar tools to keep this site working and understand how visitors use it.</p>
    <button class="button" type="button" data-cookie-accept>Accept</button>
  `;

  body.append(notice);

  notice.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    window.localStorage.setItem("kscCookieConsent", "accepted");
    notice.remove();
  });
};

buildCookieNotice();

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
  const formatValue = (value) => (node.dataset.format === "comma" ? value.toLocaleString("en-US") : String(value));

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

    node.textContent = `${formatValue(value)}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    } else {
      node.textContent = `${formatValue(target)}${suffix}`;
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
