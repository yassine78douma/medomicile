(() => {
  const root = document.documentElement;
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const floatingCall = document.querySelector(".floating-call, .floating-call-button");
  const hero = document.querySelector(".home-hero");
  const media = document.querySelector("[data-scroll-media]");
  const revealItems = document.querySelectorAll(".reveal");

  const storedTheme = localStorage.getItem("medomicile-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    root.dataset.theme = storedTheme;
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menu?.classList.toggle("is-open", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
  });

  menu?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    menuToggle?.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    body.classList.remove("menu-open");
  });

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("medomicile-theme", nextTheme);
  });

  const updateMediaScale = () => {
    if (!media) return;
    const rect = media.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = Math.min(Math.max((viewport - rect.top) / viewport, 0), 1);
    media.style.setProperty("--media-scale", (0.94 + progress * 0.06).toFixed(3));
  };

  const initFloatingCall = () => {
    if (!floatingCall) return;
    floatingCall.classList.add("floating-call-button");
    if (!hero) return;

    floatingCall.classList.add("is-hidden");
    if (!("IntersectionObserver" in window)) {
      const update = () => {
        floatingCall.classList.toggle("is-hidden", hero.getBoundingClientRect().bottom > 80);
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        floatingCall.classList.toggle("is-hidden", entry.isIntersecting);
      },
      { rootMargin: "0px 0px -65% 0px", threshold: 0 }
    );
    observer.observe(hero);
  };

  const initReviewMarquee = () => {
    document.querySelectorAll(".google-review-list").forEach((list) => {
      if (list.querySelector(".marquee__track") || list.dataset.marqueeReady === "true") return;

      const cards = [...list.querySelectorAll(".google-review-card")];
      if (!cards.length) return;

      list.dataset.marqueeReady = "true";

      const track = document.createElement("div");
      track.className = "marquee__track";
      track.style.setProperty("--duration", "32s");

      const group = document.createElement("div");
      group.className = "marquee__group";
      cards.forEach((card) => group.append(card));

      const duplicate = group.cloneNode(true);
      duplicate.setAttribute("aria-hidden", "true");

      track.append(group, duplicate);
      list.classList.add("marquee");
      list.append(track);
    });
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  initFloatingCall();
  initReviewMarquee();
  updateMediaScale();
  window.addEventListener("scroll", updateMediaScale, { passive: true });
  window.addEventListener("resize", updateMediaScale);
})();
