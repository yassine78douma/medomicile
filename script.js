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
const isArabicPage = document.documentElement.lang?.startsWith("ar");
const isEnglishPage = document.documentElement.lang?.startsWith("en");

document.querySelector(".bottom-actions")?.remove();

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
  source: "https://pharmaciedegardekenitra.com",
  updatedAt: "2026-05-27",
  title: "Pharmacies de garde Kenitra - mercredi 27 mai 2026",
  updateFrequency: "daily-data-weekly-manual-image",
  pharmacies: [
    {
      name: "Pharmacie Pasteur",
      nameAr: "صيدلية باستور",
      phone: "05 37 37 97 61",
      district: "Centre-ville",
      districtAr: "وسط المدينة",
      address: "46 avenue Hassan II, immeuble Wahbi, 1er étage, à côté du laboratoire Ibn Sina, Kenitra",
      date: "2026-05-27",
    },
    {
      name: "Pharmacie El Manar",
      nameAr: "صيدلية المنار",
      phone: "05 37 36 25 50",
      district: "Boulevard Mohamed V",
      districtAr: "شارع محمد الخامس",
      address: "Boulevard Mohamed V n°243, à côté du Crédit Agricole, à 200 m de la gare routière, Kenitra",
      date: "2026-05-27",
    },
    {
      name: "Pharmacie Les Iris",
      nameAr: "صيدلية ليز إيريس",
      phone: "05 37 32 24 44",
      district: "Riad Saknia",
      districtAr: "رياض الساكنية",
      address: "Lotissement Riad Saknia, lot n°77, 1ère tranche, en face de la mosquée Charif Al Idrissi, Kenitra",
      date: "2026-05-27",
    },
    {
      name: "Pharmacie El Houria",
      nameAr: "صيدلية الحرية",
      phone: "05 37 36 41 42",
      district: "Maghrib Arabi",
      districtAr: "المغرب العربي",
      address: "Maghrib Arabi 4, Oued El Makhazine, lotissement El Houria, Kenitra",
      date: "2026-05-27",
    },
  ],
};

const getLocalized = (item, key) => {
  if (isArabicPage && item[`${key}Ar`]) return item[`${key}Ar`];
  if (isEnglishPage && item[`${key}En`]) return item[`${key}En`];
  return item[key];
};

const setTheme = (theme) => {
  if (!theme || theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("medomicile-theme");
  } else {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("medomicile-theme", theme);
  }

  const activeTheme =
    theme && theme !== "auto"
      ? theme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  const themeColor = activeTheme === "dark" ? "#f3f8fc" : "#f8fafc";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  if (themeToggle) {
    themeToggle.textContent = activeTheme === "dark" ? "☾" : "☼";
  }
};

setTheme(localStorage.getItem("medomicile-theme") || "auto");

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
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

const selectService = (service) => {
  pickerOptions.forEach((option) => {
    option.classList.toggle("is-active", option.dataset.service === service);
  });

  serviceCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.serviceCard === service);
  });
};

pickerOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const service = option.dataset.service;
    const galleryServices = ["ambulance", "couveuse", "fourgon"];
    const target = service === "vitamines" ? "#vitamines" : galleryServices.includes(service) ? "#galerie" : "#services";

    selectService(service);
    if (galleryServices.includes(service)) applyGalleryFilter(service === "couveuse" ? "ambulance" : service);

    window.setTimeout(() => {
      const targetElement = document.querySelector(target);
      const headerOffset =
        Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) + 18;

      if (!targetElement) return;

      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.scrollY - headerOffset,
        behavior: "smooth",
      });
    }, 120);
  });
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

const normalizePhoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const renderPharmacies = (data) => {
  if (!pharmacyList || !pharmacyTitle || !pharmacyUpdated) return;

  const title = data.title || (isArabicPage ? "صيدليات الحراسة في القنيطرة" : "Pharmacies de garde à Kenitra");
  pharmacyTitle.textContent = isArabicPage
    ? "صيدليات الحراسة في القنيطرة"
    : isEnglishPage
      ? "On-duty pharmacies in Kenitra"
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
    heading.textContent = (isArabicPage && pharmacy.nameAr) || pharmacy.name;

    const district = document.createElement("p");
    district.textContent = (isArabicPage && pharmacy.districtAr) || pharmacy.district || "";

    const address = document.createElement("p");
    address.textContent = pharmacy.address || "";

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
window.addEventListener("scroll", updateMediaScale, { passive: true });
window.addEventListener("resize", updateMediaScale);
