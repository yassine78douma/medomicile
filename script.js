const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");
const revealItems = document.querySelectorAll(".reveal");
const pickerOptions = document.querySelectorAll(".picker-option");
const serviceCards = document.querySelectorAll("[data-service-card]");
const scrollMedia = document.querySelector("[data-scroll-media]");
const sections = document.querySelectorAll("main section[id]");
const galleryFilters = document.querySelectorAll(".gallery-filter");
const galleryThumbs = document.querySelectorAll(".gallery-thumb");
const galleryMain = document.querySelector("[data-gallery-main]");
const galleryTitle = document.querySelector("[data-gallery-title]");
const galleryCount = document.querySelector("[data-gallery-count]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const pharmacyList = document.querySelector("[data-pharmacy-list]");
const pharmacyTitle = document.querySelector("[data-pharmacy-title]");
const pharmacyUpdated = document.querySelector("[data-pharmacy-updated]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const reviewForm = document.querySelector("[data-review-form]");
const reviewList = document.querySelector("[data-review-list]");
const ambientCanvases = document.querySelectorAll("[data-ambient-canvas]");
const isArabicPage = document.documentElement.lang?.startsWith("ar");
const isEnglishPage = document.documentElement.lang?.startsWith("en");

const localizedPage = (baseName) => {
  if (isArabicPage) return `${baseName}-ar.html`;
  if (isEnglishPage) return `${baseName}-en.html`;
  return `${baseName}.html`;
};

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.querySelector(".bottom-actions")?.remove();

const initAmbientCanvas = (canvas) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_position;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    float softCircle(vec2 point, vec2 center, float radius) {
      float distanceToCenter = length(point - center);
      return smoothstep(radius, 0.0, distanceToCenter);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 mouse = mix(vec2(0.5), u_mouse, 0.32);
      float time = u_time * 0.16;

      vec2 c1 = vec2(0.18 + sin(time) * 0.05, 0.72 + cos(time * 0.8) * 0.05);
      vec2 c2 = vec2(0.78 + cos(time * 0.7) * 0.05, 0.35 + sin(time * 1.1) * 0.06);
      vec2 c3 = vec2(0.5 + sin(time * 0.55) * 0.08, 0.48 + cos(time * 0.5) * 0.08);

      float wave = sin((uv.x + uv.y) * 8.0 + time * 5.0) * 0.035;
      float light = 0.0;
      light += softCircle(uv + wave, c1, 0.58);
      light += softCircle(uv - wave, c2, 0.52);
      light += softCircle(uv, c3, 0.44) * 0.72;
      light += softCircle(uv, mouse, 0.38) * 0.34;

      vec3 deepBlue = vec3(0.059, 0.298, 0.506);
      vec3 brightBlue = vec3(0.184, 0.502, 0.929);
      vec3 softGreen = vec3(0.133, 0.773, 0.369);
      vec3 softGold = vec3(0.776, 0.663, 0.412);

      vec3 color = mix(deepBlue, brightBlue, uv.x + wave);
      color = mix(color, softGreen, softCircle(uv, c1, 0.58) * 0.28);
      color = mix(color, softGold, softCircle(uv, c2, 0.46) * 0.2);

      float alpha = clamp(light * 0.2, 0.0, 0.32);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const createShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "a_position");
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const mouse = gl.getUniformLocation(program, "u_mouse");
  const pointer = { x: 0.5, y: 0.5 };
  const start = performance.now();

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const updatePointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    pointer.x = Math.min(1, Math.max(0, x));
    pointer.y = Math.min(1, Math.max(0, y));
  };

  const render = () => {
    resize();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, (performance.now() - start) / 1000);
    gl.uniform2f(mouse, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", updatePointer, { passive: true });
  render();
};

ambientCanvases.forEach(initAmbientCanvas);

const galleryItems = [
  {
    src: "assets/gallery/ambulance-exterieur-01.jpg",
    title: "Ambulance disponible",
    titleEn: "Ambulance available",
    titleAr: "سيارة إسعاف متاحة",
    category: "exterieur",
    alt: "Ambulance extérieure",
    altAr: "سيارة إسعاف من الخارج",
  },
  {
    src: "assets/gallery/ambulance-interieur-01.jpg",
    title: "Intérieur ambulance équipé",
    titleEn: "Equipped ambulance interior",
    titleAr: "داخل سيارة إسعاف مجهز",
    category: "interieur",
    alt: "Intérieur ambulance",
    altAr: "داخل سيارة الإسعاف",
  },
  {
    src: "assets/gallery/ambulance-exterieur-02.jpg",
    title: "Ambulance prête au départ",
    titleEn: "Ambulance ready to move",
    titleAr: "سيارة إسعاف جاهزة",
    category: "exterieur",
    alt: "Ambulance avec porte ouverte",
    altAr: "سيارة إسعاف مفتوحة",
  },
  {
    src: "assets/gallery/ambulance-interieur-02.jpg",
    title: "Brancard et oxygène",
    titleEn: "Stretcher and oxygen",
    titleAr: "نقالة وأكسجين",
    category: "interieur",
    alt: "Brancard ambulance",
    altAr: "نقالة داخل الإسعاف",
  },
  {
    src: "assets/gallery/ambulance-interieur-03.jpg",
    title: "Cabine sanitaire aménagée",
    titleEn: "Prepared medical cabin",
    titleAr: "مساحة صحية مجهزة",
    category: "interieur",
    alt: "Siège et matériel ambulance",
    altAr: "مقعد ومعدات الإسعاف",
  },
  {
    src: "assets/gallery/ambulance-interieur-04.jpg",
    title: "Matériel de transport médicalisé",
    titleEn: "Medical transport equipment",
    titleAr: "معدات النقل الطبي",
    category: "interieur",
    alt: "Intérieur équipé ambulance",
    altAr: "داخل مجهز في الإسعاف",
  },
  {
    src: "assets/gallery/ambulance-interieur-05.jpg",
    title: "Ambulance ouverte et accessible",
    titleEn: "Open and accessible ambulance",
    titleAr: "سيارة إسعاف مفتوحة وسهلة الولوج",
    category: "interieur",
    alt: "Portes ouvertes ambulance",
    altAr: "أبواب سيارة الإسعاف مفتوحة",
  },
  {
    src: "assets/gallery/equipement-01.jpg",
    title: "Équipement médical embarqué",
    titleEn: "On-board medical equipment",
    titleAr: "معدات طبية داخل السيارة",
    category: "equipement",
    alt: "Équipement médical ambulance",
    altAr: "معدات طبية في الإسعاف",
  },
  {
    src: "assets/gallery/equipement-02.jpg",
    title: "Assistance respiratoire",
    titleEn: "Respiratory assistance",
    titleAr: "مساعدة تنفسية",
    category: "equipement",
    alt: "Matériel respiratoire ambulance",
    altAr: "معدات تنفس في الإسعاف",
  },
  {
    src: "assets/gallery/materiel-ambulance.jpg",
    title: "Matériel médical et équipements",
    titleEn: "Medical equipment and supplies",
    titleAr: "المعدات الطبية في سيارة الإسعاف",
    category: "equipement",
    alt: "Matériel médical et équipements ambulance",
    altAr: "المعدات الطبية في سيارة الإسعاف",
  },
  {
    src: "assets/gallery/fourgon-sanitaire-01.jpg",
    title: "Fourgon sanitaire",
    titleEn: "Medical van",
    titleAr: "فورغون صحي",
    category: "fourgon",
    alt: "Fourgon sanitaire",
    altAr: "فورغون صحي",
  },
  {
    src: "assets/gallery/fourgon-couveuse-01.jpg",
    title: "Fourgon avec couveuse",
    titleEn: "Van with incubator",
    titleAr: "فورغون مع حاضنة",
    category: "fourgon",
    alt: "Fourgon avec couveuse",
    altAr: "فورغون مع حاضنة",
  },
];

let activeGalleryIndex = 0;
let activeGalleryFilter = "all";

const fallbackPharmacyData = {
  "source": "https://pharmaciedegardekenitra.com/",
  "updatedAt": "2026-06-09T17:41:24+01:00",
  "title": "Pharmacies de garde Kenitra - mardi 9 juin 2026",
  "image": "assets/pharmacies/pharmacie-garde-kenitra.jpg",
  "updateFrequency": "automatic-4-times-per-day-data-weekly-manual-image",
  "note": "Données texte actualisées automatiquement 4 fois par jour depuis pharmaciedegardekenitra.com. Les pharmacies ouvrent généralement de 9h à 13h puis de 16h à 20h. La pharmacie de garde reste ouverte 24h/24 à partir de 9h du matin. L'affiche image reste mise à jour manuellement une fois par semaine. Appelez la pharmacie avant de vous déplacer.",
  "pharmacies": [
    {
      "name": "pharmacie du passage",
      "nameAr": "صيدلية السكة",
      "phone": "05373 63162",
      "district": "bab fes",
      "districtAr": "",
      "address": "133 Rue 206, Kénitra 14000",
      "date": "mardi 9 juin 2026",
      "mapsUrl": "https://g.co/kgs/XMfokN3",
      "nameEn": "Du Passage Pharmacy",
      "districtEn": "bab fes",
      "addressAr": "133 Rue 206, Kénitra 14000",
      "addressEn": "133 Rue 206, Kénitra 14000"
    },
    {
      "name": "pharmacie el hikma",
      "nameAr": "صيدلية الحكمة",
      "phone": "05 37 36 59 24",
      "district": "maghrib arabi douar chikh",
      "districtAr": "",
      "address": "hay Al Maghrib Al Arabi n°74  Kénitra - Maroc",
      "date": "mardi 9 juin 2026",
      "mapsUrl": "https://maps.app.goo.gl/W5ZjGbezv3oiy5o67",
      "nameEn": "El Hikma Pharmacy",
      "districtEn": "maghrib arabi douar chikh",
      "addressAr": "hay Al Maghrib Al Arabi n°74  Kénitra - Maroc",
      "addressEn": "hay Al Maghrib Al Arabi n°74  Kénitra - Maroc"
    }
  ]
};

const getLocalized = (item, key) => {
  if (isArabicPage && item[`${key}Ar`]) return item[`${key}Ar`];
  if (isEnglishPage && item[`${key}En`]) return item[`${key}En`];
  return item[key];
};

const systemPrefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const getActiveTheme = (theme = localStorage.getItem("medomicile-theme")) =>
  theme && theme !== "auto" ? theme : systemPrefersDark() ? "dark" : "light";

const setTheme = (theme) => {
  if (!theme || theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("medomicile-theme");
  } else {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("medomicile-theme", theme);
  }

  const activeTheme = getActiveTheme(theme);
  const themeColor = activeTheme === "dark" ? "#04111d" : "#f8fafc";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  if (themeToggle) {
    themeToggle.textContent = activeTheme === "dark" ? "☾" : "☼";
    themeToggle.setAttribute(
      "aria-label",
      activeTheme === "dark"
        ? isArabicPage
          ? "تفعيل المظهر الفاتح"
          : isEnglishPage
            ? "Switch to light mode"
            : "Activer le mode clair"
        : isArabicPage
          ? "تفعيل المظهر الداكن"
          : isEnglishPage
            ? "Switch to dark mode"
            : "Activer le mode sombre"
    );
  }
};

setTheme(localStorage.getItem("medomicile-theme") || "auto");

themeToggle?.addEventListener("click", () => {
  setTheme(getActiveTheme() === "dark" ? "light" : "dark");
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (!localStorage.getItem("medomicile-theme")) setTheme("auto");
});

const closeMenu = () => {
  if (!menuToggle || !menu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const clearReloadHash = () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const isReload = navigation?.type === "reload" || performance.navigation?.type === 1;

  if (!isReload) return;

  if (window.location.hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 120);
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 480);
};

clearReloadHash();

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const cardServiceFor = (service) => {
  if (["infirmier", "kine"].includes(service)) return "medecin";
  if (service === "couveuse") return "ambulance";
  return service;
};

const selectService = (service) => {
  const activeCardService = cardServiceFor(service);

  pickerOptions.forEach((option) => {
    option.classList.toggle("is-active", option.dataset.service === service);
  });

  serviceCards.forEach((card) => {
    const isCurrent = card.dataset.serviceCard === activeCardService;
    card.classList.toggle("is-selected", isCurrent);

    if (card.tagName === "DETAILS") {
      if (isCurrent) {
        card.setAttribute("open", "");
      } else {
        card.removeAttribute("open");
      }
    }
  });
};

const galleryFilterForService = (service) => {
  if (service === "fourgon") return "fourgon";
  if (["ambulance", "couveuse", "evenement"].includes(service)) return "ambulance";
  return null;
};

const scrollToSection = (selector, behavior = "smooth") => {
  const targetElement = document.querySelector(selector);
  const headerOffset =
    Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) + 18;

  if (!targetElement) return;

  window.scrollTo({
    top: targetElement.getBoundingClientRect().top + window.scrollY - headerOffset,
    behavior,
  });
};

const handleServiceChoice = (service) => {
  const galleryFilter = galleryFilterForService(service);
  const target = service === "vitamines" ? "#vitamines" : galleryFilter ? "#galerie" : "#services";
  const targetElement = document.querySelector(target);

  selectService(service);
  if (!targetElement) {
    if (galleryFilter) {
      window.location.href = `${localizedPage("galerie")}?filter=${encodeURIComponent(galleryFilter)}`;
      return;
    }
    if (service === "vitamines") {
      window.location.href = localizedPage("vitamines");
      return;
    }
    if (!document.querySelector("#services")) {
      window.location.href = localizedPage("services");
      return;
    }
  }

  if (galleryFilter) applyGalleryFilter(galleryFilter);
  if (galleryFilter && window.location.hash !== target) window.location.hash = target;
  scrollToSection(target, galleryFilter ? "auto" : "smooth");
  window.setTimeout(() => {
    scrollToSection(target, galleryFilter ? "auto" : "smooth");
    if (galleryFilter) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, 160);
};

pickerOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    event.preventDefault();
    handleServiceChoice(option.dataset.service);
  });
});

serviceCards.forEach((card) => {
  if (card.tagName === "DETAILS") {
    card.addEventListener("toggle", () => {
      if (!card.open) {
        card.classList.remove("is-selected");
        return;
      }

      serviceCards.forEach((otherCard) => {
        const isCurrent = otherCard === card;
        if (!isCurrent && otherCard.tagName === "DETAILS") otherCard.removeAttribute("open");
        otherCard.classList.toggle("is-selected", isCurrent);
      });
    });
    return;
  }

  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleServiceChoice(card.dataset.serviceCard);
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-service-card] a")) return;

  const card = event.target.closest("[data-service-card]");
  if (!card || card.tagName === "DETAILS") return;

  handleServiceChoice(card.dataset.serviceCard);
});

const visibleGalleryIndexes = () =>
  galleryItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      activeGalleryFilter === "all" ||
      (activeGalleryFilter === "ambulance" ? item.category !== "fourgon" : item.category === activeGalleryFilter)
    )
    .map(({ index }) => index);

const setGalleryImage = (index) => {
  if (!galleryMain || !galleryTitle || !galleryCount) return;

  const visibleIndexes = visibleGalleryIndexes();
  const safeIndex = visibleIndexes.includes(index) ? index : visibleIndexes[0] || 0;
  const item = galleryItems[safeIndex];
  activeGalleryIndex = safeIndex;

  galleryMain.classList.add("is-changing");
  window.setTimeout(() => {
    galleryMain.src = item.src;
    galleryMain.alt = getLocalized(item, "alt");
    galleryTitle.textContent = getLocalized(item, "title");
    galleryCount.textContent = `${safeIndex + 1} / ${galleryItems.length}`;
    galleryMain.classList.remove("is-changing");
  }, 120);

  galleryThumbs.forEach((thumb) => {
    const thumbIndex = Number(thumb.dataset.galleryIndex);
    thumb.classList.toggle("is-active", thumbIndex === safeIndex);
  });
};

const applyGalleryFilter = (filter) => {
  activeGalleryFilter = filter;

  galleryFilters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.galleryFilter === filter);
  });

  galleryThumbs.forEach((thumb) => {
    const category = thumb.dataset.galleryCategory;
    const isVisible = filter === "all" || (filter === "ambulance" ? category !== "fourgon" : category === filter);
    thumb.classList.toggle("is-hidden", !isVisible);
  });

  setGalleryImage(visibleGalleryIndexes()[0] || 0);
};

galleryFilters.forEach((button) => {
  button.addEventListener("click", () => applyGalleryFilter(button.dataset.galleryFilter));
});

const requestedGalleryFilter = new URLSearchParams(window.location.search).get("filter");
if (requestedGalleryFilter && galleryFilters.length) {
  applyGalleryFilter(requestedGalleryFilter);
}

galleryThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => setGalleryImage(Number(thumb.dataset.galleryIndex)));
});

galleryPrev?.addEventListener("click", () => {
  const visible = visibleGalleryIndexes();
  const position = visible.indexOf(activeGalleryIndex);
  const nextPosition = position <= 0 ? visible.length - 1 : position - 1;
  setGalleryImage(visible[nextPosition]);
});

galleryNext?.addEventListener("click", () => {
  const visible = visibleGalleryIndexes();
  const position = visible.indexOf(activeGalleryIndex);
  const nextPosition = position >= visible.length - 1 ? 0 : position + 1;
  setGalleryImage(visible[nextPosition]);
});

const normalizePhoneHref = (phone) => {
  const firstNumber = String(phone).split("/")[0] || phone;
  return `tel:${firstNumber.replace(/[^\d+]/g, "")}`;
};

const renderPharmacies = (data) => {
  if (!pharmacyList || !pharmacyTitle || !pharmacyUpdated) return;

  const title = data.title || (isArabicPage ? "صيدليات الحراسة في القنيطرة" : "Pharmacies de garde à Kenitra");
  pharmacyTitle.textContent = isArabicPage
    ? "صيدليات الحراسة في القنيطرة والمهدية"
    : isEnglishPage
      ? "On-duty pharmacies in Kenitra and Mehdia"
      : title;
  pharmacyUpdated.textContent = data.updatedAt
    ? isArabicPage
      ? `آخر تحديث: ${data.updatedAt}`
      : isEnglishPage
        ? `Last update: ${data.updatedAt}`
        : `Dernière actualisation : ${data.updatedAt}`
    : isArabicPage
      ? "المعلومات قابلة للتغيير، يرجى الاتصال قبل التنقل."
      : isEnglishPage
        ? "Information may change, please call before going."
        : "Les informations peuvent changer, appelez avant de vous déplacer.";

  pharmacyList.replaceChildren();

  (data.pharmacies || []).forEach((pharmacy) => {
    const card = document.createElement("article");
    card.className = "pharmacy-card";

    const heading = document.createElement("h3");
    heading.textContent = getLocalized(pharmacy, "name") || pharmacy.name;

    const district = document.createElement("p");
    district.textContent = getLocalized(pharmacy, "district") || pharmacy.district || "";

    const address = document.createElement("p");
    address.textContent = getLocalized(pharmacy, "address") || pharmacy.address || "";

    const date = document.createElement("span");
    date.className = "pharmacy-date";
    date.textContent = pharmacy.date
      ? isArabicPage
        ? `تاريخ الحراسة: ${pharmacy.date}`
        : isEnglishPage
          ? `On duty: ${pharmacy.date}`
          : `Garde : ${pharmacy.date}`
      : isArabicPage
        ? "Garde hebdomadaire"
        : isEnglishPage
          ? "Weekly duty"
          : "Garde hebdomadaire";

    const actions = document.createElement("div");
    actions.className = "pharmacy-actions";

    if (pharmacy.phone) {
      const phoneLink = document.createElement("a");
      phoneLink.href = normalizePhoneHref(pharmacy.phone);
      phoneLink.textContent = isArabicPage
        ? "اتصال بالصيدلية"
        : isEnglishPage
          ? "Call pharmacy"
          : "Appeler la pharmacie";
      actions.append(phoneLink);
    }

    if (pharmacy.mapsUrl) {
      const mapLink = document.createElement("a");
      mapLink.href = pharmacy.mapsUrl;
      mapLink.target = "_blank";
      mapLink.rel = "noopener";
      mapLink.textContent = isArabicPage ? "الخريطة" : isEnglishPage ? "Directions" : "Itinéraire";
      actions.append(mapLink);
    }

    card.append(heading, date, district, address, actions);
    pharmacyList.append(card);
  });

  if (!pharmacyList.children.length) {
    pharmacyList.textContent = isArabicPage
      ? "لم يتم العثور على صيدليات في الملف الحالي."
      : isEnglishPage
        ? "No pharmacy found in the current file."
        : "Aucune pharmacie trouvée dans le fichier actuel.";
  }
};

const loadPharmacies = async () => {
  if (!pharmacyList) return;

  try {
    const response = await fetch(`data/pharmacies-garde.json?cache=${Date.now()}`);
    if (!response.ok) throw new Error("Pharmacy data unavailable");
    renderPharmacies(await response.json());
  } catch (error) {
    renderPharmacies(fallbackPharmacyData);
  }
};

const reviewStorageKey = "medomicile-reviews";

const getReviews = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(reviewStorageKey) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const renderReviews = () => {
  if (!reviewList) return;
  const reviews = getReviews();
  reviewList.replaceChildren();

  if (!reviews.length) {
    const empty = document.createElement("p");
    empty.className = "review-empty";
    empty.textContent = reviewList.dataset.empty || "Aucun avis affiché pour le moment.";
    reviewList.append(empty);
    return;
  }

  reviews.forEach((review) => {
    const card = document.createElement("article");
    card.className = "review-card";

    const name = document.createElement("strong");
    name.textContent = review.name;

    const message = document.createElement("p");
    message.textContent = review.message;

    card.append(name, message);
    reviewList.append(card);
  });
};

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reviewForm);
  const name = String(formData.get("name") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name || !message) return;

  const reviews = getReviews();
  reviews.unshift({ name, message, createdAt: new Date().toISOString() });
  localStorage.setItem(reviewStorageKey, JSON.stringify(reviews.slice(0, 12)));
  reviewForm.reset();
  renderReviews();

  const text = encodeURIComponent(`Avis Medomicile\nNom: ${name}\nAvis: ${message}`);
  window.open(`https://wa.me/212663058222?text=${text}`, "_blank", "noopener");
});

const updateMediaScale = () => {
  if (!scrollMedia) return;
  const rect = scrollMedia.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const progress = Math.min(Math.max((viewport - rect.top) / viewport, 0), 1);
  const scale = 0.94 + progress * 0.06;
  scrollMedia.style.setProperty("--media-scale", scale.toFixed(3));
};

const revealAll = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      menuLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { threshold: 0.46 }
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  revealAll();
}

updateMediaScale();
loadPharmacies();
renderReviews();
window.addEventListener("scroll", updateMediaScale, { passive: true });
window.addEventListener("resize", updateMediaScale);
