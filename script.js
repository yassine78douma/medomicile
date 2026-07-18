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
const ambientCanvases = document.querySelectorAll("[data-ambient-canvas]");
const directorySearch = document.querySelector("[data-directory-search]");
const directoryList = document.querySelector("[data-directory-list]");
const directoryEmpty = document.querySelector("[data-directory-empty]");
const laboratoryList = document.querySelector("[data-laboratory-list]");
const laboratorySponsoredList = document.querySelector("[data-laboratory-sponsored]");
const radiologyList = document.querySelector("[data-radiology-list]");
const radiologyCount = document.querySelector("[data-radiology-count]");
const radiologyFilters = document.querySelectorAll("[data-radiology-filter]");
const establishmentCards = document.querySelectorAll(".facility-card, .doctor-card");
const featuredClinicGalleries = document.querySelectorAll("[data-featured-clinic-gallery]");
const isArabicPage = document.documentElement.lang?.startsWith("ar");
const isEnglishPage = document.documentElement.lang?.startsWith("en");
const newCabinetsCarousels = document.querySelectorAll("[data-new-cabinets-carousel]");
const specialtyProfessionalSlots = document.querySelectorAll("[data-specialty-professional-slots]");
const directoryFooterCtas = document.querySelectorAll("[data-directory-footer-cta]");

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const localizedPage = (baseName) => {
  if (isArabicPage) return `${baseName}-ar.html`;
  if (isEnglishPage) return `${baseName}-en.html`;
  return `${baseName}.html`;
};

const newMedicalCabinets = [
  {
    id: "ophthalmology-principale-building",
    status: "coming",
    name: {
      fr: "Cabinet d’ophtalmologie en préparation",
      en: "Ophthalmology practice in preparation",
      ar: "عيادة طب العيون قيد التحضير"
    },
    specialty: { fr: "Ophtalmologie", en: "Ophthalmology", ar: "طب العيون" },
    district: {
      fr: "Immeuble de la Pharmacie Principale",
      en: "Pharmacie Principale building",
      ar: "عمارة الصيدلية الرئيسية"
    },
    href: "ophtalmologues-kenitra",
    image: "assets/cabinets/cabinet-ophtalmologie-pharmacie-principale.jpg"
  },
  {
    id: "dental-haddada-congress",
    status: "coming",
    name: {
      fr: "Cabinet dentaire en préparation",
      en: "Dental practice in preparation",
      ar: "عيادة طب الأسنان قيد التحضير"
    },
    specialty: { fr: "Dentisterie", en: "Dentistry", ar: "طب الأسنان" },
    district: {
      fr: "Haddada, près Café Congress",
      en: "Haddada, near Café Congress",
      ar: "الحدادة، قرب مقهى كونغرس"
    },
    href: "dentistes-kenitra",
    image: "assets/cabinets/cabinet-dentaire-haddada-congress.jpg"
  },
  {
    id: "laboratory-rx-alhilal",
    status: "coming",
    name: {
      fr: "Laboratoire d’analyses en préparation",
      en: "Medical laboratory in preparation",
      ar: "مختبر تحاليل قيد التحضير"
    },
    specialty: { fr: "Analyses médicales", en: "Medical testing", ar: "تحاليل طبية" },
    district: {
      fr: "À côté du centre RX Al Hilal",
      en: "Next to RX Al Hilal center",
      ar: "بجانب مركز الأشعة الهلال"
    },
    href: {
      fr: "laboratoires-kenitra.html",
      en: "laboratories-kenitra.html",
      ar: "laboratoires-kenitra-ar.html"
    },
    image: "assets/cabinets/laboratoire-rx-alhilal.jpg"
  },
  {
    id: "clinique-internationale-kenitra",
    status: "recent",
    name: {
      fr: "Clinique Internationale de Kénitra",
      en: "Clinique Internationale de Kénitra",
      ar: "المصحة الدولية بالقنيطرة"
    },
    specialty: {
      fr: "Clinique récemment ouverte",
      en: "Recently opened clinic",
      ar: "مصحة افتتحت حديثاً"
    },
    district: {
      fr: "Kénitra, zone centrale",
      en: "Kenitra, central area",
      ar: "القنيطرة، المنطقة المركزية"
    },
    href: {
      fr: "hopitaux.html",
      en: "hopitaux-en.html",
      ar: "hopitaux-ar.html"
    },
    image: "assets/partners/clinical-international/exterieur-principal.jpg"
  }
];

const newCabinetTranslations = {
  fr: {
    name: "Cabinet médical en préparation",
    button: "Voir la fiche",
    statuses: {
      new: "Nouveau cabinet",
      coming: "Ouverture prochaine",
      recent: "Ouverture récente"
    }
  },
  en: {
    name: "Medical practice in preparation",
    button: "View profile",
    statuses: {
      new: "New practice",
      coming: "Opening soon",
      recent: "Recently opened"
    }
  },
  ar: {
    name: "عيادة طبية قيد التحضير",
    button: "عرض الصفحة",
    statuses: {
      new: "عيادة جديدة",
      coming: "افتتاح قريب",
      recent: "افتتاح حديث"
    }
  }
};

const currentLang = isArabicPage ? "ar" : isEnglishPage ? "en" : "fr";

const directoryFooterCtaTranslations = {
  fr: {
    eyebrow: "Medomicile",
    title: "Besoin d’une prise en charge à domicile ?",
    text: "Contactez Medomicile pour une consultation médicale, des soins à domicile ou un transport sanitaire selon votre situation et la disponibilité des équipes.",
    call: "Appeler",
    whatsapp: "WhatsApp"
  },
  en: {
    eyebrow: "Medomicile",
    title: "Need home healthcare support?",
    text: "Contact Medomicile for a home medical consultation, home care or medical transport depending on your situation and team availability.",
    call: "Call",
    whatsapp: "WhatsApp"
  },
  ar: {
    eyebrow: "Medomicile",
    title: "هل تحتاجون إلى رعاية صحية في المنزل؟",
    text: "تواصلوا مع Medomicile من أجل استشارة طبية في المنزل، أو رعاية منزلية، أو نقل صحي حسب الحالة وتوفر الفرق.",
    call: "اتصال",
    whatsapp: "WhatsApp"
  }
};

const specialtyPageText = {
  cardiologues: { fr: { singular: "cardiologue", plural: "cardiologues" }, en: { singular: "cardiologist", plural: "cardiologists" }, ar: { singular: "طبيب قلب", plural: "أطباء القلب" } },
  neurologues: { fr: { singular: "neurologue", plural: "neurologues" }, en: { singular: "neurologist", plural: "neurologists" }, ar: { singular: "طبيب أعصاب", plural: "أطباء الأعصاب" } },
  traumatologues: { fr: { singular: "traumatologue et orthopédiste", plural: "traumatologues et orthopédistes" }, en: { singular: "trauma and orthopedic specialist", plural: "trauma and orthopedic specialists" }, ar: { singular: "طبيب عظام ومفاصل", plural: "أطباء العظام والمفاصل" } },
  gynecologues: { fr: { singular: "gynécologue", plural: "gynécologues" }, en: { singular: "gynecologist", plural: "gynecologists" }, ar: { singular: "طبيب نساء وتوليد", plural: "أطباء النساء والتوليد" } },
  pediatres: { fr: { singular: "pédiatre", plural: "pédiatres" }, en: { singular: "pediatrician", plural: "pediatricians" }, ar: { singular: "طبيب أطفال", plural: "أطباء الأطفال" } },
  dentistes: { fr: { singular: "dentiste", plural: "dentistes" }, en: { singular: "dentist", plural: "dentists" }, ar: { singular: "طبيب أسنان", plural: "أطباء الأسنان" } },
  dermatologues: { fr: { singular: "dermatologue", plural: "dermatologues" }, en: { singular: "dermatologist", plural: "dermatologists" }, ar: { singular: "طبيب جلد", plural: "أطباء الجلد" } },
  ophtalmologues: { fr: { singular: "ophtalmologue", plural: "ophtalmologues" }, en: { singular: "ophthalmologist", plural: "ophthalmologists" }, ar: { singular: "طبيب عيون", plural: "أطباء العيون" } },
  pneumologues: { fr: { singular: "pneumologue", plural: "pneumologues" }, en: { singular: "pulmonologist", plural: "pulmonologists" }, ar: { singular: "طبيب أمراض تنفسية", plural: "أطباء الأمراض التنفسية" } },
  internistes: { fr: { singular: "interniste", plural: "internistes" }, en: { singular: "internist", plural: "internists" }, ar: { singular: "طبيب باطني", plural: "أطباء الباطنة" } },
  visceralistes: { fr: { singular: "chirurgien viscéraliste", plural: "chirurgiens viscéralistes" }, en: { singular: "visceral surgeon", plural: "visceral surgeons" }, ar: { singular: "جراح أحشاء", plural: "جراحو الأحشاء" } },
  endocrinologues: { fr: { singular: "endocrinologue", plural: "endocrinologues" }, en: { singular: "endocrinologist", plural: "endocrinologists" }, ar: { singular: "طبيب غدد وسكري", plural: "أطباء الغدد والسكري" } },
  orl: { fr: { singular: "ORL", plural: "ORL" }, en: { singular: "ENT specialist", plural: "ENT specialists" }, ar: { singular: "طبيب أنف وأذن وحنجرة", plural: "أطباء الأنف والأذن والحنجرة" } },
  urologues: { fr: { singular: "urologue", plural: "urologues" }, en: { singular: "urologist", plural: "urologists" }, ar: { singular: "طبيب مسالك بولية", plural: "أطباء المسالك البولية" } },
  rhumatologues: { fr: { singular: "rhumatologue", plural: "rhumatologues" }, en: { singular: "rheumatologist", plural: "rheumatologists" }, ar: { singular: "طبيب روماتيزم", plural: "أطباء الروماتيزم" } },
};

const professionalSlotTranslations = {
  fr: {
    city: "Kénitra",
    badge: "ESPACE PROFESSIONNEL",
    button: "Découvrir l’espace professionnel",
    mention: "Emplacement professionnel clairement identifié.",
    templates: [
      {
        title: ({ singular, city }) => `Vous êtes ${singular} à ${city} ?`,
        text: () => "Développez votre visibilité sur Medomicile."
      },
      {
        title: ({ city }) => `Présentez votre cabinet aux patients de ${city}.`,
        text: () => "Un espace professionnel clair et facilement accessible."
      },
      {
        title: () => "Rejoignez l’annuaire médical Medomicile.",
        text: () => "Ajoutez vos coordonnées, horaires et itinéraire."
      }
    ]
  },
  en: {
    city: "Kenitra",
    badge: "PROFESSIONAL SPACE",
    button: "Discover the professional space",
    mention: "Clearly identified professional placement.",
    templates: [
      {
        title: ({ singular, city }) => `Are you a ${singular} in ${city}?`,
        text: () => "Increase your visibility on Medomicile."
      },
      {
        title: ({ city }) => `Present your practice to patients in ${city}.`,
        text: () => "A clear professional space that is easy to access."
      },
      {
        title: () => "Join the Medomicile medical directory.",
        text: () => "Add your contact details, opening hours and directions."
      }
    ]
  },
  ar: {
    city: "القنيطرة",
    badge: "مساحة مهنية",
    button: "اكتشف المساحة المهنية",
    mention: "مساحة مهنية موضحة بشكل واضح.",
    templates: [
      {
        title: ({ singular, city }) => `هل أنت ${singular} في ${city}؟`,
        text: () => "عزّز ظهور عيادتك على Medomicile."
      },
      {
        title: ({ city }) => `قدّموا عيادتكم للمرضى في ${city}.`,
        text: () => "مساحة مهنية واضحة وسهلة الوصول."
      },
      {
        title: () => "انضموا إلى دليل Medomicile الطبي.",
        text: () => "أضيفوا معلومات الاتصال، أوقات العمل والمسار."
      }
    ]
  }
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
    src: "assets/optimized/gallery/ambulance-exterieur-01.jpg",
    title: "Ambulance disponible",
    titleEn: "Ambulance available",
    titleAr: "سيارة إسعاف متاحة",
    category: "exterieur",
    alt: "Ambulance extérieure",
    altAr: "سيارة إسعاف من الخارج",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-01.jpg",
    title: "Intérieur ambulance équipé",
    titleEn: "Equipped ambulance interior",
    titleAr: "داخل سيارة إسعاف مجهز",
    category: "interieur",
    alt: "Intérieur ambulance",
    altAr: "داخل سيارة الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-exterieur-02.jpg",
    title: "Ambulance prête au départ",
    titleEn: "Ambulance ready to move",
    titleAr: "سيارة إسعاف جاهزة",
    category: "exterieur",
    alt: "Ambulance avec porte ouverte",
    altAr: "سيارة إسعاف مفتوحة",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-02.jpg",
    title: "Brancard et oxygène",
    titleEn: "Stretcher and oxygen",
    titleAr: "نقالة وأكسجين",
    category: "interieur",
    alt: "Brancard ambulance",
    altAr: "نقالة داخل الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-03.jpg",
    title: "Cabine sanitaire aménagée",
    titleEn: "Prepared medical cabin",
    titleAr: "مساحة صحية مجهزة",
    category: "interieur",
    alt: "Siège et matériel ambulance",
    altAr: "مقعد ومعدات الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-04.jpg",
    title: "Matériel de transport médicalisé",
    titleEn: "Medical transport equipment",
    titleAr: "معدات النقل الطبي",
    category: "interieur",
    alt: "Intérieur équipé ambulance",
    altAr: "داخل مجهز في الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-05.jpg",
    title: "Ambulance ouverte et accessible",
    titleEn: "Open and accessible ambulance",
    titleAr: "سيارة إسعاف مفتوحة وسهلة الولوج",
    category: "interieur",
    alt: "Portes ouvertes ambulance",
    altAr: "أبواب سيارة الإسعاف مفتوحة",
  },
  {
    src: "assets/optimized/gallery/equipement-01.jpg",
    title: "Équipement médical embarqué",
    titleEn: "On-board medical equipment",
    titleAr: "معدات طبية داخل السيارة",
    category: "equipement",
    alt: "Équipement médical ambulance",
    altAr: "معدات طبية في الإسعاف",
  },
  {
    src: "assets/optimized/gallery/equipement-02.jpg",
    title: "Assistance respiratoire",
    titleEn: "Respiratory assistance",
    titleAr: "مساعدة تنفسية",
    category: "equipement",
    alt: "Matériel respiratoire ambulance",
    altAr: "معدات تنفس في الإسعاف",
  },
  {
    src: "assets/optimized/gallery/fourgon-sanitaire-01.jpg",
    title: "Fourgon sanitaire",
    titleEn: "Medical van",
    titleAr: "فورغون صحي",
    category: "fourgon",
    alt: "Fourgon sanitaire",
    altAr: "فورغون صحي",
  },
  {
    src: "assets/optimized/gallery/fourgon-couveuse-01.jpg",
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
  source: "Affiche du Syndicat Regional des Pharmaciens d'Officine de la ville de Kenitra",
  updatedAt: "2026-07-18T09:00:00+01:00",
  title: "Pharmacies de garde de week-end Kenitra - 18 et 19 juillet 2026",
  image: "assets/pharmacies/pharmacie-garde-kenitra.jpg",
  updateFrequency: "manual-from-official-poster",
  note: "Garde de week-end 24h/24 les 18 et 19 juillet 2026. Appelez la pharmacie avant de vous deplacer.",
  pharmacies: [
    {
      name: "Pharmacie Irchad",
      nameAr: "صيدلية الإرشاد",
      nameEn: "Irchad Pharmacy",
      phone: "05 37 39 29 00",
      district: "Saknia",
      districtAr: "السكنية",
      districtEn: "Saknia",
      address: "Avenue El Massira, route Ain Sebaa, en face de Joutiaa Saknia",
      addressAr: "شارع المسيرة، طريق عين السبع، أمام جوطية السكنية",
      addressEn: "Avenue El Massira, Ain Sebaa road, opposite Joutiaa Saknia",
      date: "18 et 19 juillet 2026",
      dateAr: "18 و19 يوليوز 2026",
      dateEn: "July 18 and 19, 2026",
      mapsUrl: "",
    },
    {
      name: "Pharmacie Belhachmi",
      nameAr: "صيدلية بلحاشمي",
      nameEn: "Belhachmi Pharmacy",
      phone: "05 37 39 80 54",
      district: "Ouled Oujih",
      districtAr: "أولاد وجيه",
      districtEn: "Ouled Oujih",
      address: "Lotissement Haddada 1146, derriere la mosquee Erriane, rue en face de Banque Populaire Maghreb",
      addressAr: "تجزئة الحداد رقم 1146، خلف مسجد الريان، في الشارع المقابل للبنك الشعبي المغرب",
      addressEn: "Lotissement Haddada 1146, behind Erriane mosque, on the street opposite Banque Populaire Maghreb",
      date: "18 et 19 juillet 2026",
      dateAr: "18 و19 يوليوز 2026",
      dateEn: "July 18 and 19, 2026",
      mapsUrl: "",
    },
    {
      name: "Pharmacie Principale",
      nameAr: "الصيدلية الرئيسية",
      nameEn: "Principale Pharmacy",
      phone: "05 37 36 35 03",
      district: "Medina",
      districtAr: "المدينة",
      districtEn: "Medina",
      address: "N 204, avenue Mohamed V, entre Kenitra Union et l'entree El Khabisat, pres de Kissariat Sellahi",
      addressAr: "رقم 204، شارع محمد الخامس، بين قنيطرة الاتحاد ومدخل الخبيزات، بجانب قيسارية السلاحي",
      addressEn: "No. 204, Mohamed V Avenue, between Kenitra Union and the El Khabisat entrance, near Kissariat Sellahi",
      date: "18 et 19 juillet 2026",
      dateAr: "18 و19 يوليوز 2026",
      dateEn: "July 18 and 19, 2026",
      mapsUrl: "",
    },
    {
      name: "Pharmacie Saad",
      nameAr: "صيدلية سعد",
      nameEn: "Saad Pharmacy",
      phone: "05 37 36 05 05",
      district: "Ville Nouvelle",
      districtAr: "المدينة الجديدة",
      districtEn: "Ville Nouvelle",
      address: "69 rue Homman El Fatouaki, pres de la piscine couverte et ex terrain mini foot",
      addressAr: "رقم 69 زنقة حمان الفتوكي، قرب المسبح المغطى وملعب ميني فوت سابقا",
      addressEn: "69 Homman El Fatouaki Street, near the indoor swimming pool and former mini football field",
      date: "18 et 19 juillet 2026",
      dateAr: "18 و19 يوليوز 2026",
      dateEn: "July 18 and 19, 2026",
      mapsUrl: "",
    },
    {
      name: "Pharmacie Bir Rami Sud",
      nameAr: "صيدلية بئر الرامي الجنوبية",
      nameEn: "Bir Rami Sud Pharmacy",
      phone: "05 37 37 86 07",
      district: "Bir Rami Industrielle",
      districtAr: "بئر الرامي الصناعية",
      districtEn: "Bir Rami Industrielle",
      address: "Terminus bus 29-30, a cote de la salle couverte et du hammam Sara Jadid, derriere le quartier industriel Bir Rami Sud",
      addressAr: "نهاية الحافلة 29-30، جنب القاعة المغطاة وحمام سارة الجديد، خلف الحي الصناعي بئر الرامي الجنوبية",
      addressEn: "Bus terminus 29-30, beside the covered hall and Hammam Sara Jadid, behind Bir Rami Sud industrial area",
      date: "18 et 19 juillet 2026",
      dateAr: "18 و19 يوليوز 2026",
      dateEn: "July 18 and 19, 2026",
      mapsUrl: "",
    },
  ],
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

const initDirectorySearch = () => {
  if (!directorySearch || !directoryList) return;

  const cards = [...directoryList.querySelectorAll("[data-search]")];
  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const filterCards = () => {
    const query = normalize(directorySearch.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = normalize(card.dataset.search || card.textContent);
      const isVisible = !query || haystack.includes(query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (directoryEmpty) {
      directoryEmpty.hidden = visibleCount > 0;
    }
  };

  directorySearch.addEventListener("input", filterCards);
  filterCards();
};

const getLocalizedLabel = (fr, en, ar) => {
  if (isArabicPage) return ar;
  if (isEnglishPage) return en;
  return fr;
};

const normalizeAddressForDirections = (address, name) => {
  const value = String(address || "").trim();
  const lower = value.toLowerCase();
  const uncertainParts = [
    "zone centrale",
    "central area",
    "المنطقة المركزية",
    "adresse à confirmer",
    "address to confirm",
    "العنوان للتأكيد",
    "clinique de chirurgie",
    "orthopedic and trauma surgery",
    "مصحة جراحة",
  ];

  if (!value || uncertainParts.some((part) => lower.includes(part))) {
    return `${name}, Kenitra`;
  }

  return value;
};

const getCardAddress = (card) => {
  if (card.classList.contains("doctor-card")) {
    const lines = [...card.querySelectorAll(".doctor-line")];
    const addressLine = lines.find((line) => line.textContent.includes("⌖"));
    return addressLine?.querySelector("span:last-child")?.textContent?.trim() || "";
  }

  return card.querySelector("p")?.textContent?.trim() || "";
};

const formatGoogleRating = (ratingText) => {
  const raw = String(ratingText || "").replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0];
  if (!raw) {
    return {
      label: getLocalizedLabel("Note Google non disponible", "Google rating unavailable", "تقييم Google غير متوفر"),
      stars: "☆☆☆☆☆",
      value: "",
    };
  }

  const rating = Math.max(0, Math.min(5, Number(raw)));
  const rounded = Math.round(rating);
  const stars = "★★★★★".slice(0, rounded) + "☆☆☆☆☆".slice(rounded);
  return {
    label: `${rating.toFixed(1).replace(".", ",")} Google`,
    stars,
    value: raw,
  };
};

const closeCompactCard = (card) => {
  const button = card.querySelector(".compact-card-toggle");
  const panel = card.querySelector(".compact-card-details");
  card.classList.remove("is-open");
  button?.setAttribute("aria-expanded", "false");
  if (panel) {
    panel.hidden = true;
    panel.classList.remove("is-expanded");
    panel.style.removeProperty("display");
  }
};

const toggleCompactCard = (card) => {
  const isOpen = card.classList.contains("is-open");

  if (!isOpen && window.matchMedia("(max-width: 720px)").matches) {
    document.querySelectorAll(".facility-card, .doctor-card, .laboratory-card").forEach((otherCard) => {
      if (otherCard !== card) closeCompactCard(otherCard);
    });
  }

  const button = card.querySelector(".compact-card-toggle");
  const panel = card.querySelector(".compact-card-details");
  card.classList.toggle("is-open", !isOpen);
  button?.setAttribute("aria-expanded", String(!isOpen));
  if (!panel) return;

  if (isOpen) {
    panel.hidden = true;
    panel.classList.remove("is-expanded");
    panel.style.removeProperty("display");
    return;
  }

  panel.hidden = false;
  panel.classList.add("is-expanded");
  panel.style.display = "grid";
  panel.offsetHeight;
  requestAnimationFrame(() => {
    panel.style.display = "grid";
    panel.querySelectorAll("a, p, span, h3, div").forEach((item) => {
      item.style.opacity = "1";
      item.style.visibility = "visible";
    });
  });
};

const sortHospitalFacilityCards = () => {
  const section = document.querySelector("#hopitaux");
  const grid = section?.querySelector(".facility-grid");
  if (!grid) return;

  const getRating = (card) => {
    const raw = card.querySelector(".facility-head strong")?.textContent || "";
    const match = raw.match(/\d+(?:[,.]\d+)?/);
    return match ? Number(match[0].replace(",", ".")) : -1;
  };

  const getReviews = (card) => {
    const raw = card.querySelector(".facility-head strong")?.textContent || "";
    const match = raw.match(/(\d+)\s*avis/i);
    return match ? Number(match[1]) : 0;
  };

  const getName = (card) => card.querySelector("h3")?.textContent?.trim() || "";

  [...grid.querySelectorAll(".facility-card")]
    .sort((a, b) => {
      const ratingDiff = getRating(b) - getRating(a);
      if (ratingDiff) return ratingDiff;

      const reviewDiff = getReviews(b) - getReviews(a);
      if (reviewDiff) return reviewDiff;

      return getName(a).localeCompare(getName(b), document.documentElement.lang || "fr", {
        sensitivity: "base",
      });
    })
    .forEach((card) => grid.append(card));
};

const enhanceEstablishmentCards = () => {
  establishmentCards.forEach((card) => {
    if (card.querySelector(".compact-card-toggle")) return;

    const name = card.querySelector("h3")?.textContent?.trim();
    if (!name) return;

    const isDoctor = card.classList.contains("doctor-card");
    if (isDoctor) {
      card.querySelectorAll(".doctor-specialty").forEach((specialty) => specialty.remove());
    }
    const rating = isDoctor ? null : formatGoogleRating(card.querySelector(".facility-head strong")?.textContent || "");
    const open24h = card.dataset.open24h === "true";
    const open24hLabel = getLocalizedLabel("Ouvert 24h/24", "Open 24/7", "متاح 24 ساعة");
    const open24hBadge = open24h ? `<span class="availability-badge" title="${open24hLabel}" aria-label="${open24hLabel}">24h/24</span>` : "";
    const phone = card.querySelector('a[href^="tel:"]');
    const address = normalizeAddressForDirections(getCardAddress(card), name);
    const panelId = `${isDoctor ? "doctor" : "facility"}-${[...establishmentCards].indexOf(card) + 1}-details`;

    const toggle = document.createElement("button");
    toggle.className = "compact-card-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", panelId);
    toggle.setAttribute("aria-label", `${getLocalizedLabel("Afficher les coordonnées de", "Show contact details for", "عرض معلومات")} ${name}`);
    toggle.innerHTML = `
      <span class="compact-card-title">
        <strong>${name}</strong>${open24hBadge}
      </span>
      ${rating ? `<span class="compact-rating" aria-label="${rating.label}">
        <span aria-hidden="true">${rating.stars}</span>
        <b>${rating.label}</b>
      </span>` : ""}
      <span class="compact-chevron" aria-hidden="true">⌄</span>
    `;

    const details = document.createElement("div");
    details.className = "compact-card-details";
    details.id = panelId;
    details.hidden = true;

    const currentChildren = [...card.childNodes];
    card.append(toggle, details);
    currentChildren.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE && !child.textContent.trim()) return;
      details.append(child);
    });

    const actions = document.createElement("div");
    actions.className = "establishment-actions";

    if (phone) {
      const call = document.createElement("a");
      call.className = "establishment-action call";
      call.href = phone.href;
      call.setAttribute("aria-label", `${getLocalizedLabel("Appeler", "Call", "اتصال")} ${name}`);
      call.innerHTML = `<span aria-hidden="true">☎</span>${getLocalizedLabel("Appeler", "Call", "اتصال")}`;
      actions.append(call);
    }

    const directionsHref = address
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${name}, ${address}`)}`
      : "";

    if (directionsHref) {
      const directions = document.createElement("a");
      directions.className = "establishment-action directions";
      directions.href = directionsHref;
      directions.target = "_blank";
      directions.rel = "noopener noreferrer";
      directions.setAttribute("aria-label", `${getLocalizedLabel("Obtenir l’itinéraire vers", "Get directions to", "الحصول على الاتجاهات إلى")} ${name}`);
      directions.innerHTML = `<span aria-hidden="true">⌖</span>${getLocalizedLabel("Itinéraire", "Directions", "الاتجاهات")}`;
      actions.append(directions);
    }

    details.append(actions);
    card.classList.add("compact-card");
    toggle.addEventListener("click", () => toggleCompactCard(card));
  });
};

const laboratoryTranslations = {
  fr: {
    type: "Laboratoire d’analyses médicales",
    call: "Appeler",
    directions: "Itinéraire",
    googleUnavailable: "Note Google non disponible",
    reviews: "avis",
    sponsored: "SPONSORISÉ",
    phone: "Téléphone",
    phoneToConfirm: "Téléphone à confirmer",
    hours: "Horaires",
    hoursToConfirm: "Horaire à confirmer",
    informationToConfirm: "Information à confirmer",
    loadError: "Les laboratoires ne peuvent pas être chargés pour le moment. Veuillez réessayer ou contacter Medomicile.",
    open24h: "Ouvert 24h/24",
  },
  en: {
    type: "Medical laboratory",
    call: "Call",
    directions: "Directions",
    googleUnavailable: "Google rating unavailable",
    reviews: "reviews",
    sponsored: "SPONSORED",
    phone: "Phone",
    phoneToConfirm: "Phone to be confirmed",
    hours: "Opening hours",
    hoursToConfirm: "Hours to be confirmed",
    informationToConfirm: "Information to be confirmed",
    loadError: "Laboratories cannot be loaded for the moment. Please try again or contact Medomicile.",
    open24h: "Open 24/7",
  },
  ar: {
    type: "مختبر للتحاليل الطبية",
    call: "اتصال",
    directions: "المسار",
    googleUnavailable: "تقييم Google غير متوفر",
    reviews: "مراجعة",
    sponsored: "إعلان ممول",
    phone: "الهاتف",
    phoneToConfirm: "الهاتف يحتاج إلى تأكيد",
    hours: "أوقات العمل",
    hoursToConfirm: "أوقات العمل تحتاج إلى تأكيد",
    informationToConfirm: "المعلومة تحتاج إلى تأكيد",
    loadError: "لا يمكن تحميل المختبرات حالياً. يرجى المحاولة من جديد أو التواصل مع Medomicile.",
    open24h: "متاح 24 ساعة",
  },
};

const getLanguageKey = () => {
  if (isArabicPage) return "ar";
  if (isEnglishPage) return "en";
  return "fr";
};

const getLaboratoryText = () => laboratoryTranslations[getLanguageKey()];

const isSponsorActive = (lab) => {
  if (!lab?.sponsored) return false;
  const today = new Date();
  const start = lab.sponsorStartDate ? new Date(`${lab.sponsorStartDate}T00:00:00`) : null;
  const end = lab.sponsorEndDate ? new Date(`${lab.sponsorEndDate}T23:59:59`) : null;
  if (start && today < start) return false;
  if (end && today > end) return false;
  return true;
};

const hasNumericRating = (lab) => Number.isFinite(Number(lab.rating));
const hasNumericReviewCount = (lab) => Number.isFinite(lab.reviewCount);

const sortLaboratories = (laboratories) =>
  [...laboratories].sort((a, b) => {
    const ratingA = hasNumericRating(a) ? Number(a.rating) : -1;
    const ratingB = hasNumericRating(b) ? Number(b.rating) : -1;

    if (ratingB !== ratingA) return ratingB - ratingA;

    const reviewsA = hasNumericReviewCount(a) ? Number(a.reviewCount) : 0;
    const reviewsB = hasNumericReviewCount(b) ? Number(b.reviewCount) : 0;

    if (reviewsB !== reviewsA) return reviewsB - reviewsA;

    return String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" });
  });

const getDirectionsUrl = (lab) => {
  const url = String(lab.mapsUrl || "");
  const query = url.match(/[?&]q=([^&]+)/)?.[1];
  const destination = query ? decodeURIComponent(query.replace(/\+/g, " ")) : lab.name;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};

const getLocalizedHours = (hours) => {
  if (!Array.isArray(hours)) return [];
  if (!isArabicPage && !isEnglishPage) return hours;
  return hours.map((line) => {
    if (isEnglishPage) {
      return line
        .replace("Lun–Ven", "Mon–Fri")
        .replace("Sam", "Sat")
        .replace("Dim", "Sun")
        .replace("à confirmer", "to be confirmed");
    }
    return line
      .replace("Lun–Ven", "الإثنين–الجمعة")
      .replace("Sam", "السبت")
      .replace("Dim", "الأحد")
      .replace("à confirmer", "تحتاج إلى تأكيد");
  });
};

const formatLaboratoryRating = (lab) => {
  const text = getLaboratoryText();
  if (!hasNumericRating(lab)) {
    return {
      label: text.googleUnavailable,
      stars: "",
    };
  }

  const rating = Math.max(0, Math.min(5, Number(lab.rating)));
  const rounded = Math.round(rating);
  const stars = "★★★★★".slice(0, rounded) + "☆☆☆☆☆".slice(rounded);
  const reviews = hasNumericReviewCount(lab) ? ` · ${Number(lab.reviewCount)} ${text.reviews}` : "";
  return {
    label: `${rating.toFixed(1).replace(".", isEnglishPage ? "." : ",")} Google${reviews}`,
    stars,
  };
};

const getLaboratoryDisplayName = (lab) => {
  if (isArabicPage && lab.nameAr) return lab.nameAr;
  return lab.name || "";
};

const updateLaboratoryItemListJsonLd = (labs) => {
  if (!laboratoryList || !labs.length) return;

  document.querySelector("[data-laboratory-itemlist-jsonld]")?.remove();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sortLaboratories(labs).map((lab, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MedicalBusiness",
        name: lab.name,
        url: lab.mapsUrl,
        telephone: lab.phone || undefined,
      },
    })),
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.laboratoryItemlistJsonld = "true";
  script.textContent = JSON.stringify(itemList);
  document.head.append(script);
};

const createLaboratoryCard = (lab, options = {}) => {
  const text = getLaboratoryText();
  const displayName = getLaboratoryDisplayName(lab);
  const rating = formatLaboratoryRating(lab);
  const open24hBadge = lab.open24h ? `<span class="availability-badge" title="${text.open24h}" aria-label="${text.open24h}">24h/24</span>` : "";
  const card = document.createElement("article");
  card.className = `facility-card laboratory-card compact-card reveal is-visible${options.sponsored ? " sponsored-card" : ""}`;
  card.dataset.search = [lab.name, lab.nameAr, lab.shortName, lab.phone, ...(lab.hours || [])].filter(Boolean).join(" ");

  const panelId = `laboratory-${lab.id}-details`;
  const phoneHtml = lab.phone && lab.phoneHref
    ? `<p class="doctor-line"><span aria-hidden="true">☎</span><a dir="ltr" href="${lab.phoneHref}">${lab.phone}</a></p>`
    : `<p class="doctor-line facility-muted"><span aria-hidden="true">☎</span><span>${text.phoneToConfirm}</span></p>`;
  const hours = getLocalizedHours(lab.hours);
  const hoursHtml = hours.length
    ? `<div class="laboratory-hours"><strong>${text.hours}</strong>${hours.map((hour) => `<span>${hour}</span>`).join("")}</div>`
    : `<p class="facility-muted">${text.hoursToConfirm}</p>`;
  const unverified = [
    lab.verifiedPhone === false ? text.phoneToConfirm : "",
    lab.verifiedHours === false ? text.hoursToConfirm : "",
  ].filter(Boolean);
  const unverifiedHtml = unverified.length
    ? `<p class="facility-muted">${unverified.join(" · ")}</p>`
    : "";
  const imageHtml = options.sponsored && lab.image
    ? `<img class="laboratory-card__image" src="${lab.image}" width="720" height="420" loading="lazy" decoding="async" alt="${displayName}" />`
    : "";

  card.innerHTML = `
    ${imageHtml}
    ${options.sponsored ? `<span class="sponsored-badge">${text.sponsored}</span>` : ""}
    <button class="compact-card-toggle" type="button" aria-expanded="false" aria-controls="${panelId}" aria-label="${getLocalizedLabel("Afficher les coordonnées de", "Show contact details for", "عرض معلومات")} ${displayName}">
      <span class="compact-card-title">
        <strong>${displayName}</strong>${open24hBadge}
      </span>
      <span class="compact-rating" aria-label="${rating.label}">
        ${rating.stars ? `<span aria-hidden="true">${rating.stars}</span>` : ""}
        <b>${rating.label}</b>
      </span>
      <span class="compact-chevron" aria-hidden="true">⌄</span>
    </button>
    <div class="compact-card-details" id="${panelId}" hidden>
      ${phoneHtml}
      ${hoursHtml}
      ${unverifiedHtml}
      <div class="establishment-actions">
        ${lab.phoneHref ? `<a class="establishment-action call" href="${lab.phoneHref}" aria-label="${text.call} ${displayName}"><span aria-hidden="true">☎</span>${text.call}</a>` : ""}
        <a class="establishment-action directions" href="${getDirectionsUrl(lab)}" target="_blank" rel="noopener noreferrer" aria-label="${text.directions} ${displayName}"><span aria-hidden="true">⌖</span>${text.directions}</a>
      </div>
    </div>
  `;

  card.querySelector(".compact-card-toggle")?.addEventListener("click", () => toggleCompactCard(card));
  return card;
};

// ==============================
// DONNÉES DES CENTRES À MODIFIER
// ==============================
const radiologyCenters = [
  {
    id: "clinique-internationale",
    name: "Clinique Internationale de Kénitra - service radiologie",
    nameAr: "المصحة الدولية بالقنيطرة - قسم الأشعة",
    type: "Service d’imagerie médicale",
    typeEn: "Medical imaging service",
    typeAr: "قسم التصوير الطبي",
    district: "Kénitra",
    address: "Kénitra, zone centrale",
    phoneDisplay: "+212 5 37 31 34 34",
    phoneRaw: "tel:+212537313434",
    hours: "24h/24, urgences radiologiques selon disponibilité",
    open24h: true,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Clinique%20Internationale%20de%20K%C3%A9nitra%2C%20Kenitra",
    website: "",
    verified: true,
    exams: [],
    featured: true,
    sponsored: false,
    lastVerified: "2026-07-17",
  },
  {
    id: "hopital-international",
    name: "Hôpital International de Kénitra - service radiologie",
    nameAr: "المستشفى الدولي بالقنيطرة - قسم الأشعة",
    type: "Service d’imagerie médicale",
    typeEn: "Medical imaging service",
    typeAr: "قسم التصوير الطبي",
    district: "Kénitra",
    address: "Avenue Mohammed VI, Kénitra",
    phoneDisplay: "+212 5 37 36 96 96",
    phoneRaw: "tel:+212537369696",
    hours: "24h/24, urgences radiologiques selon disponibilité",
    open24h: true,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Akdital%20International%20Hospital%20Kenitra",
    website: "",
    verified: true,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: "2026-07-17",
  },
  {
    id: "polyclinique-kenitra",
    name: "Polyclinique de Kénitra - service radiologie",
    nameAr: "المصحة المتعددة الاختصاصات بالقنيطرة - قسم الأشعة",
    type: "Service d’imagerie médicale",
    typeEn: "Medical imaging service",
    typeAr: "قسم التصوير الطبي",
    district: "Kénitra",
    address: "Avenue de l’Hôpital, Kénitra",
    phoneDisplay: "+212 5 37 37 36 35",
    phoneRaw: "tel:+212537373635",
    hours: "24h/24, urgences radiologiques selon disponibilité",
    open24h: true,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Polyclinique%20de%20K%C3%A9nitra",
    website: "",
    verified: true,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: "2026-07-17",
  },
  {
    id: "cnss-radiologie",
    name: "Polyclinique CNSS Kénitra - service radiologie",
    nameAr: "مصحة الصندوق الوطني للضمان الاجتماعي بالقنيطرة - قسم الأشعة",
    type: "Service d’imagerie médicale",
    typeEn: "Medical imaging service",
    typeAr: "قسم التصوير الطبي",
    district: "Kénitra",
    address: "Avenue Moulay Youssef, Kénitra",
    phoneDisplay: "+212 5 37 37 87 39",
    phoneRaw: "tel:+212537378739",
    hours: "24h/24, à confirmer auprès de l’établissement",
    open24h: true,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Polyclinique%20CNSS%20K%C3%A9nitra",
    website: "",
    verified: true,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: "2026-07-17",
  },
  {
    id: "radiologie-amane",
    name: "Radiologie Amane",
    nameAr: "مركز أمان للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Radiologie%20Amane%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "horloge",
    name: "Cabinet radiologique de l’Horloge",
    nameAr: "عيادة الساعة للأشعة",
    type: "Cabinet de radiologie",
    typeEn: "Radiology practice",
    typeAr: "عيادة للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Cabinet%20radiologique%20de%20l%27Horloge%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "ibn-sina-radiologie",
    name: "Cabinet de Radiologie Ibn Sina",
    nameAr: "عيادة ابن سينا للأشعة",
    type: "Cabinet de radiologie",
    typeEn: "Radiology practice",
    typeAr: "عيادة للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Cabinet%20de%20Radiologie%20Ibn%20Sina%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "firdaous-aouifi",
    name: "Radiologie Firdaous / Aouifi",
    nameAr: "مركز الفردوس / العويفي للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Radiologie%20Firdaous%20Aouifi%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "al-istiqlal",
    name: "Centre de Radiologie Al Istiqlal",
    nameAr: "مركز الاستقلال للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Centre%20de%20Radiologie%20Al%20Istiqlal%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "hassan-ii",
    name: "Centre de Radiologie Hassan II",
    nameAr: "مركز الحسن الثاني للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: "24h/24, à confirmer auprès de l’établissement",
    open24h: true,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Centre%20de%20Radiologie%20Hassan%20II%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "nafora",
    name: "Radiologie Nafora",
    nameAr: "مركز النافورة للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Radiologie%20Nafora%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "diouri",
    name: "Centre Radiologie Diouri",
    nameAr: "مركز الديوري للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: "24h/24, à confirmer auprès de l’établissement",
    open24h: true,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Centre%20Radiologie%20Diouri%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "el-hilal",
    name: "Radiologie El Hilal",
    nameAr: "مركز الهلال للأشعة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Radiologie%20El%20Hilal%20Kenitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
  {
    id: "beclere",
    name: "Radiologie Béclère Kénitra",
    nameAr: "مركز بيكلير للأشعة بالقنيطرة",
    type: "Centre de radiologie",
    typeEn: "Radiology center",
    typeAr: "مركز للأشعة",
    district: "Kénitra",
    address: null,
    phoneDisplay: null,
    phoneRaw: null,
    hours: null,
    open24h: false,
    rating: null,
    reviewCount: null,
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Radiologie%20B%C3%A9cl%C3%A8re%20K%C3%A9nitra",
    website: "",
    verified: false,
    exams: [],
    featured: false,
    sponsored: false,
    lastVerified: null,
  },
];

// ==============================
// TRADUCTIONS
// ==============================
const radiologyTranslations = {
  fr: {
    sponsored: "VISIBILITÉ LOCALE",
    call: "Appeler",
    directions: "Itinéraire",
    unavailableRating: "Note Google non renseignée",
    phoneToConfirm: "Téléphone à confirmer",
    hoursToConfirm: "Horaires à confirmer",
    addressToConfirm: "Adresse à confirmer",
    informationToConfirm: "Informations à confirmer auprès de l’établissement",
    examsToConfirm: "Examens à confirmer directement auprès du centre",
    open24h: "Ouvert 24h/24",
    results: "centre(s) affiché(s)",
    noResults: "Aucun centre ne correspond à votre recherche.",
  },
  en: {
    sponsored: "LOCAL VISIBILITY",
    call: "Call",
    directions: "Directions",
    unavailableRating: "Google rating not provided",
    phoneToConfirm: "Phone to be confirmed",
    hoursToConfirm: "Opening hours to be confirmed",
    addressToConfirm: "Address to be confirmed",
    informationToConfirm: "Information should be confirmed directly with the facility",
    examsToConfirm: "Exams should be confirmed directly with the center",
    open24h: "Open 24/7",
    results: "center(s) shown",
    noResults: "No center matches your search.",
  },
  ar: {
    sponsored: "ظهور محلي",
    call: "اتصال",
    directions: "الاتجاهات",
    unavailableRating: "تقييم Google غير متوفر",
    phoneToConfirm: "الهاتف يحتاج إلى تأكيد",
    hoursToConfirm: "ساعات العمل تحتاج إلى تأكيد",
    addressToConfirm: "العنوان يحتاج إلى تأكيد",
    informationToConfirm: "يرجى تأكيد المعلومات مباشرة مع المؤسسة",
    examsToConfirm: "يجب تأكيد الفحوصات مباشرة مع المركز",
    open24h: "متاح 24 ساعة",
    results: "مركز معروض",
    noResults: "لا يوجد مركز مطابق للبحث.",
  },
};

const getRadiologyText = () => radiologyTranslations[getLanguageKey()];

// ==============================
// TRI ET FILTRES
// ==============================
const getRadiologyName = (center) => (isArabicPage && center.nameAr ? center.nameAr : center.name);
const getRadiologyType = (center) => (isArabicPage ? center.typeAr || center.type : isEnglishPage ? center.typeEn || center.type : center.type);

const sortRadiologyCenters = (centers) =>
  [...centers].sort((a, b) => {
    if (a.sponsored !== b.sponsored) return a.sponsored ? -1 : 1;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const ratingA = Number.isFinite(Number(a.rating)) ? Number(a.rating) : -1;
    const ratingB = Number.isFinite(Number(b.rating)) ? Number(b.rating) : -1;
    if (ratingB !== ratingA) return ratingB - ratingA;
    const reviewsA = Number.isFinite(a.reviewCount) ? Number(a.reviewCount) : 0;
    const reviewsB = Number.isFinite(b.reviewCount) ? Number(b.reviewCount) : 0;
    if (reviewsB !== reviewsA) return reviewsB - reviewsA;
    return String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" });
  });

const filterRadiologyCenters = () => {
  const query = normalizeText(directorySearch?.value || "");
  const activeFilter = document.querySelector("[data-radiology-filter].is-active")?.dataset.radiologyFilter || "all";
  return sortRadiologyCenters(radiologyCenters).filter((center) => {
    const haystack = normalizeText([
      center.name,
      center.nameAr,
      center.type,
      center.district,
      center.address,
      center.hours,
      ...(center.exams || []),
    ].filter(Boolean).join(" "));
    const matchesSearch = !query || haystack.includes(query);
    const matchesFilter = activeFilter === "all" || (activeFilter === "open24h" && center.open24h);
    return matchesSearch && matchesFilter;
  });
};

const updateRadiologyResultsCount = (count) => {
  const text = getRadiologyText();
  if (radiologyCount) radiologyCount.textContent = `${count} ${text.results}`;
  if (directoryEmpty) {
    directoryEmpty.hidden = count > 0;
    directoryEmpty.textContent = text.noResults;
  }
};

// ==============================
// GÉNÉRATION DES CARTES
// ==============================
const formatRadiologyRating = (center) => {
  const text = getRadiologyText();
  if (!Number.isFinite(Number(center.rating))) return { label: text.unavailableRating, stars: "" };
  const rating = Math.max(0, Math.min(5, Number(center.rating)));
  const rounded = Math.round(rating);
  const stars = "★★★★★".slice(0, rounded) + "☆☆☆☆☆".slice(rounded);
  const reviews = Number.isFinite(center.reviewCount) ? ` · ${center.reviewCount}` : "";
  return { label: `${rating.toFixed(1).replace(".", isEnglishPage ? "." : ",")} Google${reviews}`, stars };
};

const createCenterCard = (center) => {
  const text = getRadiologyText();
  const name = getRadiologyName(center);
  const rating = formatRadiologyRating(center);
  const open24hBadge = center.open24h ? `<span class="availability-badge" title="${text.open24h}" aria-label="${text.open24h}">24h/24</span>` : "";
  const panelId = `radiology-${center.id}-details`;
  const card = document.createElement("article");
  card.className = `facility-card radiology-card compact-card reveal is-visible${center.sponsored ? " sponsored-card" : ""}`;
  card.dataset.search = [center.name, center.nameAr, center.type, center.address, center.district, center.hours, ...(center.exams || [])].filter(Boolean).join(" ");
  const exams = center.exams?.length
    ? `<div class="exam-tags">${center.exams.map((exam) => `<span>${exam}</span>`).join("")}</div>`
    : `<p class="facility-muted">${text.examsToConfirm}</p>`;
  card.innerHTML = `
    ${center.sponsored ? `<span class="sponsored-badge">${text.sponsored}</span>` : ""}
    <button class="compact-card-toggle" type="button" aria-expanded="false" aria-controls="${panelId}" aria-label="${getLocalizedLabel("Afficher les coordonnées de", "Show contact details for", "عرض معلومات")} ${name}">
      <span class="compact-card-title">
        <strong>${name}</strong>${open24hBadge}
      </span>
      <span class="compact-rating" aria-label="${rating.label}">
        ${rating.stars ? `<span aria-hidden="true">${rating.stars}</span>` : ""}
        <b>${rating.label}</b>
      </span>
      <span class="compact-chevron" aria-hidden="true">⌄</span>
    </button>
    <div class="compact-card-details" id="${panelId}" hidden>
      <p class="doctor-line"><span aria-hidden="true">⌖</span><span>${center.address || text.addressToConfirm}</span></p>
      <p class="doctor-line"><span aria-hidden="true">☎</span>${center.phoneRaw ? `<a dir="ltr" href="${center.phoneRaw}">${center.phoneDisplay}</a>` : `<span>${text.phoneToConfirm}</span>`}</p>
      <p class="doctor-line"><span aria-hidden="true">◷</span><span>${center.hours || text.hoursToConfirm}</span></p>
      ${!center.verified ? `<p class="facility-muted">${text.informationToConfirm}</p>` : ""}
      ${exams}
      <div class="establishment-actions">
        ${center.phoneRaw ? `<a class="establishment-action call" href="${center.phoneRaw}" aria-label="${text.call} ${name}"><span aria-hidden="true">☎</span>${text.call}</a>` : ""}
        ${center.mapsUrl ? `<a class="establishment-action directions" href="${center.mapsUrl}" target="_blank" rel="noopener noreferrer" aria-label="${text.directions} ${name}"><span aria-hidden="true">⌖</span>${text.directions}</a>` : ""}
      </div>
    </div>
  `;
  card.querySelector(".compact-card-toggle")?.addEventListener("click", () => toggleCompactCard(card));
  return card;
};

const renderCenters = () => {
  if (!radiologyList) return;
  const centers = filterRadiologyCenters();
  radiologyList.innerHTML = "";
  centers.forEach((center) => radiologyList.append(createCenterCard(center)));
  updateRadiologyResultsCount(centers.length);
};

const renderLaboratories = (data) => {
  if (!laboratoryList) return;
  const labs = Array.isArray(data?.laboratories) ? data.laboratories.filter((lab) => lab.verified) : [];
  const sponsored = labs.filter(isSponsorActive);
  const organic = sortLaboratories(labs.filter((lab) => !isSponsorActive(lab)));

  laboratoryList.innerHTML = "";
  laboratorySponsoredList && (laboratorySponsoredList.innerHTML = "");

  sponsored.forEach((lab) => laboratorySponsoredList?.append(createLaboratoryCard(lab, { sponsored: true })));
  organic.forEach((lab) => laboratoryList.append(createLaboratoryCard(lab)));

  if (directoryEmpty) {
    directoryEmpty.hidden = Boolean(labs.length);
    directoryEmpty.textContent = getLaboratoryText().loadError;
  }

  updateLaboratoryItemListJsonLd(labs);
  initDirectorySearch();
};

const loadLaboratories = async () => {
  if (!laboratoryList) return;

  try {
    const response = await fetch(`data/laboratoires-kenitra.json?cache=20260716-01`);
    if (!response.ok) throw new Error("Laboratory data unavailable");
    renderLaboratories(await response.json());
  } catch (error) {
    if (directoryEmpty) {
      directoryEmpty.hidden = false;
      directoryEmpty.textContent = getLaboratoryText().loadError;
    }
  }
};

const initFeaturedClinicGalleries = () => {
  featuredClinicGalleries.forEach((gallery) => {
    const images = [...gallery.querySelectorAll("img")];
    const buttons = [...gallery.querySelectorAll(".featured-clinic__controls button")];
    if (images.length < 2 || !buttons.length) return;

    let activeIndex = Math.max(0, images.findIndex((image) => image.classList.contains("is-active")));
    let timer;

    const showImage = (index) => {
      activeIndex = (index + images.length) % images.length;
      images.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === activeIndex));
      buttons.forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === activeIndex));
    };

    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => showImage(activeIndex + 1), 4200);
    };

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        showImage(index);
        restart();
      });
    });

    restart();
  });
};

radiologyFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    radiologyFilters.forEach((button) => button.classList.remove("is-active"));
    filter.classList.add("is-active");
    renderCenters();
  });
});

directorySearch?.addEventListener("input", () => {
  if (radiologyList) renderCenters();
});

const initGoogleReviewMarquees = () => {
  document.querySelectorAll(".google-review-list").forEach((list) => {
    if (list.querySelector(".marquee__track")) return;

    const cards = [...list.querySelectorAll(".google-review-card")];
    if (!cards.length) return;

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

const localizedText = (value) => value?.[currentLang] || value?.fr || "";
const localizedHref = (value) => {
  if (typeof value === "string") return localizedPage(value);
  return value?.[currentLang] || value?.fr || "#";
};

const createNewCabinetCard = (cabinet) => {
  const labels = newCabinetTranslations[currentLang] || newCabinetTranslations.fr;
  const article = document.createElement("article");
  article.className = "new-cabinet-card";

  const photo = document.createElement("div");
  photo.className = "new-cabinet-card__photo";
  const image = document.createElement("img");
  image.src = cabinet.image;
  image.alt = "";
  image.loading = "lazy";
  photo.append(image);

  const body = document.createElement("div");
  body.className = "new-cabinet-card__body";

  const badge = document.createElement("span");
  badge.className = "new-cabinet-card__badge";
  badge.textContent = labels.statuses[cabinet.status] || labels.statuses.coming;

  const title = document.createElement("h3");
  title.textContent = localizedText(cabinet.name) || labels.name;

  const details = document.createElement("p");
  details.textContent = localizedText(cabinet.specialty);

  const area = document.createElement("span");
  area.className = "new-cabinet-card__area";
  area.textContent = localizedText(cabinet.district);
  details.append(area);

  const link = document.createElement("a");
  link.className = "new-cabinet-card__link";
  link.href = localizedHref(cabinet.href);
  link.textContent = labels.button;

  body.append(badge, title, details, link);
  article.append(photo, body);

  return article;
};

const NewMedicalCabinetsCarousel = (section) => {
  const track = section.querySelector("[data-new-cabinets-track]");
  if (!track || track.children.length) return;

  const cards = newMedicalCabinets.map(createNewCabinetCard);
  const group = document.createElement("div");
  group.className = "new-cabinets-carousel__group";
  cards.forEach((card) => group.append(card));

  const duplicate = group.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("a").forEach((link) => {
    link.tabIndex = -1;
  });

  track.append(group, duplicate);

  section.addEventListener("pointerdown", () => section.classList.add("is-touching"));
  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    section.addEventListener(eventName, () => section.classList.remove("is-touching"));
  });
};

const getSpecialtySlugFromPath = () => {
  const fileName = (window.location.pathname.split("/").pop() || "").replace(/\.html$/i, "");
  return fileName.replace(/-(?:en|ar)$/i, "").replace(/-kenitra$/i, "");
};

const getSpecialtyProfessionalConfig = () => {
  const slug = getSpecialtySlugFromPath();
  const labels = professionalSlotTranslations[currentLang] || professionalSlotTranslations.fr;
  const specialtyTexts = specialtyPageText[slug];
  const fallbackTitle = document.querySelector(".directory-hero h1, h1")?.textContent?.trim() || "";
  const fallbackName = fallbackTitle
    .replace(/\s+(?:à|a)\s+Kénitra$/i, "")
    .replace(/\s+in\s+Kenitra$/i, "")
    .replace(/\s+في\s+القنيطرة$/i, "")
    .trim();

  return {
    specialtySlug: slug || "specialite",
    cityName: labels.city,
    specialtyName: specialtyTexts?.[currentLang]?.singular || specialtyTexts?.fr?.singular || fallbackName || "médecin",
    specialtyNamePlural: specialtyTexts?.[currentLang]?.plural || specialtyTexts?.fr?.plural || fallbackName || "médecins"
  };
};

const renderSpecialtyProfessionalSlots = (section) => {
  if (!section || section.children.length) return;

  const labels = professionalSlotTranslations[currentLang] || professionalSlotTranslations.fr;
  const config = getSpecialtyProfessionalConfig();
  const mailSubject = encodeURIComponent(`Espace professionnel Medomicile - ${config.specialtyNamePlural}`);
  const mailHref = `mailto:contact@medomicile.com?subject=${mailSubject}`;
  const accessibleTitle =
    currentLang === "ar"
      ? `مساحات مهنية ل${config.specialtyNamePlural} في ${config.cityName}`
      : currentLang === "en"
        ? `Professional spaces for ${config.specialtyNamePlural} in ${config.cityName}`
        : `Espaces professionnels pour ${config.specialtyNamePlural} à ${config.cityName}`;

  const heading = document.createElement("h2");
  heading.className = "sr-only";
  heading.textContent = accessibleTitle;

  const list = document.createElement("div");
  list.className = "specialty-professional-slots__list";

  labels.templates.slice(0, 3).forEach((template, index) => {
    const card = document.createElement("article");
    card.className = "specialty-professional-slot";

    const icon = document.createElement("span");
    icon.className = "specialty-professional-slot__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✦";

    const content = document.createElement("div");
    content.className = "specialty-professional-slot__content";

    const badge = document.createElement("span");
    badge.className = "specialty-professional-slot__badge";
    badge.textContent = labels.badge;

    const title = document.createElement("h3");
    title.textContent = template.title({
      singular: config.specialtyName,
      plural: config.specialtyNamePlural,
      city: config.cityName,
      slug: config.specialtySlug
    });

    const text = document.createElement("p");
    text.textContent = template.text({
      singular: config.specialtyName,
      plural: config.specialtyNamePlural,
      city: config.cityName,
      slug: config.specialtySlug
    });

    const mention = document.createElement("small");
    mention.textContent = labels.mention;

    const link = document.createElement("a");
    link.className = "specialty-professional-slot__link";
    link.href = mailHref;
    link.textContent = labels.button;

    content.append(badge, title, text, mention);
    card.append(icon, content, link);
    card.style.setProperty("--slot-index", index);
    list.append(card);
  });

  section.setAttribute("aria-label", accessibleTitle);
  section.append(heading, list);
};

const renderDirectoryFooterCtas = () => {
  const labels = directoryFooterCtaTranslations[currentLang] || directoryFooterCtaTranslations.fr;

  directoryFooterCtas.forEach((section, index) => {
    const titleId = section.getAttribute("aria-labelledby") || `directory-footer-cta-title-${index + 1}`;
    section.setAttribute("aria-labelledby", titleId);
    section.innerHTML = `
      <div>
        <p class="eyebrow">${labels.eyebrow}</p>
        <h2 id="${titleId}">${labels.title}</h2>
        <p>${labels.text}</p>
      </div>
      <div class="urgent-actions">
        <a dir="ltr" class="primary-action" href="tel:+212663058222">${labels.call}</a>
        <a class="whatsapp-action" href="https://wa.me/212663058222">${labels.whatsapp}</a>
      </div>
    `;
  });
};

const cleanGoogleReviewTimes = () => {
  document.querySelectorAll(".google-review-meta").forEach((meta) => {
    if ((meta.textContent || "").includes("★")) {
      meta.textContent = "★★★★★";
    }
  });
};

const ensureFloatingCallButton = () => {
  const existing = document.querySelector(".floating-call, .floating-call-button");
  if (existing) {
    existing.classList.add("floating-call-button");
    existing.setAttribute("dir", isArabicPage ? "rtl" : "ltr");
    if (!existing.querySelector(".floating-call-button__icon")) {
      existing.insertAdjacentHTML("afterbegin", '<span class="floating-call-button__icon" aria-hidden="true">☎</span>');
    }
    return;
  }

  const labels = {
    fr: { text: "Appeler", aria: "Appeler Medomicile" },
    en: { text: "Call", aria: "Call Medomicile" },
    ar: { text: "اتصال", aria: "اتصل ب Medomicile" }
  };
  const label = labels[currentLang] || labels.fr;
  const link = document.createElement("a");
  link.className = "floating-call floating-call-button";
  link.href = "tel:+212663058222";
  link.setAttribute("aria-label", label.aria);
  link.setAttribute("dir", isArabicPage ? "rtl" : "ltr");
  link.innerHTML = `<span class="floating-call-button__icon" aria-hidden="true">☎</span><span>${label.text}</span>`;
  document.body.append(link);
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

renderDirectoryFooterCtas();

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
loadLaboratories();
renderCenters();
initFeaturedClinicGalleries();
cleanGoogleReviewTimes();
ensureFloatingCallButton();
initGoogleReviewMarquees();
newCabinetsCarousels.forEach(NewMedicalCabinetsCarousel);
specialtyProfessionalSlots.forEach(renderSpecialtyProfessionalSlots);
sortHospitalFacilityCards();
enhanceEstablishmentCards();
initDirectorySearch();
window.addEventListener("scroll", updateMediaScale, { passive: true });
window.addEventListener("resize", updateMediaScale);
