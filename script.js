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
const pharmacyDutyLists = document.querySelectorAll("[data-pharmacy-duty-list]");
const pharmacyDirectoryList = document.querySelector("[data-pharmacy-directory-list]");
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
    image: "assets/cabinets/cabinet-ophtalmologie-pharmacie-principale.avif"
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
    image: "assets/cabinets/cabinet-dentaire-haddada-congress.avif"
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
    image: "assets/cabinets/laboratoire-rx-alhilal.avif"
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
    image: "assets/partners/clinical-international/exterieur-principal.avif"
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
  gastroenterologues: { fr: { singular: "gastro-entérologue", plural: "gastro-entérologues" }, en: { singular: "gastroenterologist", plural: "gastroenterologists" }, ar: { singular: "طبيب جهاز هضمي", plural: "أطباء الجهاز الهضمي" } },
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
    src: "assets/optimized/gallery/ambulance-exterieur-01.avif",
    title: "Ambulance disponible",
    titleEn: "Ambulance available",
    titleAr: "سيارة إسعاف متاحة",
    category: "exterieur",
    alt: "Ambulance extérieure",
    altAr: "سيارة إسعاف من الخارج",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-01.avif",
    title: "Intérieur ambulance équipé",
    titleEn: "Equipped ambulance interior",
    titleAr: "داخل سيارة إسعاف مجهز",
    category: "interieur",
    alt: "Intérieur ambulance",
    altAr: "داخل سيارة الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-exterieur-02.avif",
    title: "Ambulance prête au départ",
    titleEn: "Ambulance ready to move",
    titleAr: "سيارة إسعاف جاهزة",
    category: "exterieur",
    alt: "Ambulance avec porte ouverte",
    altAr: "سيارة إسعاف مفتوحة",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-02.avif",
    title: "Brancard et oxygène",
    titleEn: "Stretcher and oxygen",
    titleAr: "نقالة وأكسجين",
    category: "interieur",
    alt: "Brancard ambulance",
    altAr: "نقالة داخل الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-03.avif",
    title: "Cabine sanitaire aménagée",
    titleEn: "Prepared medical cabin",
    titleAr: "مساحة صحية مجهزة",
    category: "interieur",
    alt: "Siège et matériel ambulance",
    altAr: "مقعد ومعدات الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-04.avif",
    title: "Matériel de transport médicalisé",
    titleEn: "Medical transport equipment",
    titleAr: "معدات النقل الطبي",
    category: "interieur",
    alt: "Intérieur équipé ambulance",
    altAr: "داخل مجهز في الإسعاف",
  },
  {
    src: "assets/optimized/gallery/ambulance-interieur-05.avif",
    title: "Ambulance ouverte et accessible",
    titleEn: "Open and accessible ambulance",
    titleAr: "سيارة إسعاف مفتوحة وسهلة الولوج",
    category: "interieur",
    alt: "Portes ouvertes ambulance",
    altAr: "أبواب سيارة الإسعاف مفتوحة",
  },
  {
    src: "assets/optimized/gallery/equipement-01.avif",
    title: "Équipement médical embarqué",
    titleEn: "On-board medical equipment",
    titleAr: "معدات طبية داخل السيارة",
    category: "equipement",
    alt: "Équipement médical ambulance",
    altAr: "معدات طبية في الإسعاف",
  },
  {
    src: "assets/optimized/gallery/equipement-02.avif",
    title: "Assistance respiratoire",
    titleEn: "Respiratory assistance",
    titleAr: "مساعدة تنفسية",
    category: "equipement",
    alt: "Matériel respiratoire ambulance",
    altAr: "معدات تنفس في الإسعاف",
  },
  {
    src: "assets/optimized/gallery/fourgon-sanitaire-01.avif",
    title: "Fourgon sanitaire",
    titleEn: "Medical van",
    titleAr: "فورغون صحي",
    category: "fourgon",
    alt: "Fourgon sanitaire",
    altAr: "فورغون صحي",
  },
  {
    src: "assets/optimized/gallery/fourgon-couveuse-01.avif",
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
  "source": "Affiche du Syndicat Regional des Pharmaciens d'Officine de la ville de Kenitra",
  "updatedAt": "2026-08-12T09:30:00+01:00",
  "displayDate": "Mercredi 12 aout 2026",
  "displayDateEn": "Wednesday, August 12, 2026",
  "displayDateAr": "الأربعاء 12 غشت 2026",
  "title": "Pharmacies de garde a Kenitra - 12 aout 2026",
  "image": "assets/pharmacies/pharmacie-garde-kenitra-2026-08-10.jpg",
  "updateFrequency": "daily-manual-from-official-poster",
  "note": "Garde de nuit 24h/24 du mercredi 12 aout 2026. Appelez toujours la pharmacie avant de vous deplacer.",
  "duty": {
    "day": [],
    "night": [
      {
        "id": "ar-rif-2026-08-12",
        "directoryId": "ar-rif",
        "badge": "night",
        "name": "Pharmacie Ar Rif",
        "nameEn": "Ar Rif Pharmacy",
        "nameAr": "صيدلية الريف",
        "phone": "05 37 36 33 00",
        "district": "Bir Rami Est",
        "districtEn": "Bir Rami East",
        "districtAr": "بئر الرامي الشرقي",
        "address": "Pres de la mosquee Maich, Bir Rami Est, sur la route double en direction de la grande gare",
        "addressEn": "Near Maich mosque, Bir Rami East, on the dual road toward the main train station",
        "addressAr": "قرب مسجد مائش، بئر الرامي الشرقي، على الطريق المزدوجة في اتجاه محطة القطار الكبرى",
        "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ar%20Rif%20Bir%20Rami%20Est%20Kenitra",
        "hours": "Garde de nuit 24h/24 - 12 aout 2026",
        "hoursEn": "Night duty 24/24 - August 12, 2026",
        "hoursAr": "حراسة ليلية 24/24 - 12 غشت 2026",
        "services": []
      },
      {
        "id": "al-ghofrane-2026-08-12",
        "directoryId": "al-ghofrane",
        "badge": "night",
        "name": "Pharmacie Al Ghofrane",
        "nameEn": "Al Ghofrane Pharmacy",
        "nameAr": "صيدلية الغفران",
        "phone": "05 37 38 53 23",
        "district": "Saknia",
        "districtEn": "Saknia",
        "districtAr": "السكنية",
        "address": "Al Wifaq F, numero 128, Saknia, pres de la mosquee Al Ghofrane en direction de la salle couverte",
        "addressEn": "Al Wifaq F, No. 128, Saknia, near Al Ghofrane mosque toward the covered hall",
        "addressAr": "الوفاق F رقم 128، السكنية، قرب مسجد الغفران في اتجاه القاعة المغطاة",
        "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Ghofrane%20Al%20Wifaq%20128%20Saknia%20Kenitra",
        "hours": "Garde de nuit 24h/24 - 12 aout 2026",
        "hoursEn": "Night duty 24/24 - August 12, 2026",
        "hoursAr": "حراسة ليلية 24/24 - 12 غشت 2026",
        "services": []
      }
    ]
  },
  "directory": [
    {
      "id": "romana",
      "name": "Pharmacie Romana",
      "nameEn": "Romana Pharmacy",
      "nameAr": "صيدلية رومانا",
      "phone": "05 37 35 33 45",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Bloc D, numero 16, Ouled Oujih, route entre la station Ziz et Le Vallon",
      "addressEn": "Block D, No. 16, Ouled Oujih, road between Ziz station and Le Vallon",
      "addressAr": "رقم 16 بلوك D، أولاد أوجيه، الطريق بين محطة زيز في اتجاه Le Vallon",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Romana%20Ouled%20Oujih%20Kenitra"
    },
    {
      "id": "chark-medina",
      "name": "Pharmacie Chark Medina",
      "nameEn": "Chark Medina Pharmacy",
      "nameAr": "صيدلية شرق المدينة",
      "phone": "06 38 67 52 36",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "Lotissement Al Wafaa 4, numero 1320, Roumane Ain Sebaa, a droite du centre ONEP vers Chato",
      "addressEn": "Al Wafaa 4 subdivision, No. 1320, Roumane Ain Sebaa, right of the ONEP water center toward Chato",
      "addressAr": "1320 تجزئة الوفاء 4، روميوان عين السبع، على يمين مركز الماء ONEP في اتجاه الشاطو",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Chark%20Medina%20Kenitra"
    },
    {
      "id": "hinde",
      "name": "Pharmacie Hinde",
      "nameEn": "Hinde Pharmacy",
      "nameAr": "صيدلية هند",
      "phone": "05 37 36 12 96",
      "district": "Maamora",
      "districtEn": "Maamora",
      "districtAr": "المعمورة",
      "address": "Rue Youssef Ben Tachfine, residence Younes, pres du cafe Le Grand et du cafe Ch. Ibrahim, vers le complexe sportif KAC",
      "addressEn": "Youssef Ben Tachfine Street, Residence Younes, near Cafe Le Grand and Cafe Ch. Ibrahim, toward KAC sports complex",
      "addressAr": "شارع يوسف بن تاشفين، زنقة فرحات، حضاد إقامة يونس بجانب مقهى Le Grand ومقهى ش إبراهيم، 50م من كوارزم القنيطرة المؤدية إلى المركب الرياضي KAC",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Hinde%20Kenitra"
    },
    {
      "id": "balsam",
      "name": "Pharmacie Balsam",
      "nameEn": "Balsam Pharmacy",
      "nameAr": "صيدلية بلسم",
      "phone": "05 37 39 17 13",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Rue 57, numero 2975, Hay Errajae, Douar Sahraoua, pres de la rue des librairies",
      "addressEn": "Street 57, No. 2975, Hay Errajae, Douar Sahraoua, near the bookshops street",
      "addressAr": "زنقة 57 رقم 2975، حي الرجاء، دوار صحراوة، زنقة المكتبات الساكنية",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Balsam%20Kenitra"
    },
    {
      "id": "tidas",
      "name": "Pharmacie Tidas",
      "nameEn": "Tidas Pharmacy",
      "nameAr": "صيدلية تيداس",
      "phone": "05 37 35 09 21",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Bloc 30, Ouled Oujih, pres du cafe Tidas et du souk Ouled Oujih",
      "addressEn": "Block 30, Ouled Oujih, near Cafe Tidas and Ouled Oujih market",
      "addressAr": "بلوك 30، أولاد أوجيه، قرب مقهى تيداس وقرب سوق أولاد أوجيه",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Tidas%20Kenitra"
    },
    {
      "id": "asfar",
      "name": "Pharmacie Asfar",
      "nameEn": "Asfar Pharmacy",
      "nameAr": "صيدلية أسفار",
      "phone": "06 58 43 01 90",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Boulevard Al Allama, pres du hammam Talmoust, Saknia",
      "addressEn": "Al Allama Boulevard, near Hammam Talmoust, Saknia",
      "addressAr": "شارع العلامة، قرب الحمام تلموست، الساكنية",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Asfar%20Kenitra"
    },
    {
      "id": "al-ousra",
      "name": "Pharmacie Al Ousra",
      "nameEn": "Al Ousra Pharmacy",
      "nameAr": "صيدلية الأسرة",
      "phone": "05 37 37 03 29",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "276 Bir Rami Ouest, route de Lycee Abderrahman Nacer vers Ouled Oujih",
      "addressEn": "276 Bir Rami West, road from Abderrahman Nacer high school toward Ouled Oujih",
      "addressAr": "276 بئر الرامي الغربية، الطريق المؤدية من ثانوية عبد الرحمان الناصر إلى أولاد أوجيه",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Ousra%20Kenitra"
    },
    {
      "id": "issam-omar",
      "name": "Pharmacie Issam Omar",
      "nameEn": "Issam Omar Pharmacy",
      "nameAr": "صيدلية عصام عمر",
      "phone": "05 37 37 72 84",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Mechouar El Assame, station OLA, route de Tanger, pres de l'hotel El Assame",
      "addressEn": "Mechouar El Assame, OLA station, Tangier road, near Hotel El Assame",
      "addressAr": "مشوار العصام، محطة OLA، طريق طنجة، قرب فندق العصام",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Issam%20Omar%20Kenitra"
    },
    {
      "id": "amical",
      "name": "Pharmacie Amical",
      "nameEn": "Amical Pharmacy",
      "nameAr": "صيدلية أميكال",
      "phone": "08 08 53 12 62",
      "district": "Bir Rami Est",
      "districtEn": "Bir Rami East",
      "districtAr": "بئر الرامي الشرقية",
      "address": "566 Bir Rami Est, devant la direction regionale de l'agriculture",
      "addressEn": "566 Bir Rami East, in front of the regional agriculture directorate",
      "addressAr": "566 بئر الرامي الشرقية، أمام مقر المديرية الجهوية للفلاحة",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Amical%20Kenitra"
    },
    {
      "id": "hay-tabib",
      "name": "Pharmacie Hay Tabib",
      "nameEn": "Hay Tabib Pharmacy",
      "nameAr": "صيدلية حي الطبيب",
      "phone": "05 37 38 41 63",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Rue 196 et 144 Al Allama, Hay Lazma, pres de la mosquee Haj El Mbarek",
      "addressEn": "Streets 196 and 144 Al Allama, Hay Lazma, near Haj El Mbarek mosque",
      "addressAr": "زنقة 196 و144 العلامة، حي لازما، الساكنية، بجانب مسجد الحاج المبارك",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": [],
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Hay%20Tabib%20Kenitra"
    },
    {
      "id": "venezia",
      "name": "Pharmacie Venezia",
      "nameEn": "Venezia Pharmacy",
      "nameAr": "صيدلية فينيزيا",
      "phone": "05 30 66 73 84 / 06 61 37 59 66",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Quartier Ismailia N 1196, pres de la Base Militaire",
      "addressEn": "Ismailia district No. 1196, near the Military Base",
      "addressAr": "حي الإسماعيلية، طريق مهدية رقم 1196، قرب القاعدة العسكرية",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Venezia%20Quartier%20Ismailia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ennasr",
      "name": "Pharmacie Ennasr",
      "nameEn": "Ennasr Pharmacy",
      "nameAr": "صيدلية النصر",
      "phone": "06 59 79 90 24 / 05 37 38 79 00",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "Boulevard Med V, route de Tanger, a cote de la rotisserie El Mizane",
      "addressEn": "Mohammed V Boulevard, Tangier road, next to Rotisserie El Mizane",
      "addressAr": "شارع محمد الخامس، طريق طنجة، قرب مشواة الميزان",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ennasr%20Boulevard%20Med%20V%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "marche-central",
      "name": "Pharmacie du Marche Central",
      "nameEn": "Central Market Pharmacy",
      "nameAr": "صيدلية المارشي سنطرال",
      "phone": "05 37 37 10 54",
      "district": "Ville Nouvelle",
      "districtEn": "Ville Nouvelle",
      "districtAr": "المدينة الجديدة",
      "address": "Avenue Moulay Abdellah, pres du Marche Central",
      "addressEn": "Moulay Abdellah Avenue, near the Central Market",
      "addressAr": "شارع مولاي عبد الله، قرب مارشي سنطرال",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20du%20Marche%20Central%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "chiboub",
      "name": "Pharmacie Chiboub",
      "nameEn": "Chiboub Pharmacy",
      "nameAr": "صيدلية شيبوب",
      "phone": "06 09 27 28 83",
      "district": "Bir Rami Industrielle",
      "districtEn": "Bir Rami Industrial Area",
      "districtAr": "بئر الرامي الصناعية",
      "address": "Bir Rami Ouest, disponible sur Google Maps",
      "addressEn": "Bir Rami West, available on Google Maps",
      "addressAr": "بئر الرامي الجنوبية، جناح 4، الطريق المؤدية إلى مقبرة الرضوان، أمام المعهد المتخصص في مهن النقل الطرقي واللوجستيك",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Chiboub%20Bir%20Rami%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-mouna",
      "name": "Pharmacie Al Mouna",
      "nameEn": "Al Mouna Pharmacy",
      "nameAr": "صيدلية المنى",
      "phone": "06 61 18 83 38",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "5 Rue Assafae lot N 155, Saknia",
      "addressEn": "5 Assafae Street, lot No. 155, Saknia",
      "addressAr": "زنقة الصفاء تجزئة رقم 155، قرب جوطية الموتورات، المنطقة المطهرة، ديور الحلوف",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Mouna%20Saknia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "mosquee-rahma",
      "name": "Pharmacie Mosquee Rahma",
      "nameEn": "Mosquee Rahma Pharmacy",
      "nameAr": "صيدلية مسجد الرحمة",
      "phone": "05 37 35 57 00",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Bloc H numero 155, S.G.M.B, entre la banque S.G.M.B et le college Ouled Oujih",
      "addressEn": "Block H No. 155, S.G.M.B, between S.G.M.B bank and Ouled Oujih middle school",
      "addressAr": "أولاد أوجيه بلوك H رقم 155، بين بنك S.G.M.B وإعدادية أولاد أوجيه",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Mosquee%20Rahma%20Ouled%20Oujih%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "khayrat-chaabia",
      "name": "Pharmacie Khayrat Chaabia",
      "nameEn": "Khayrat Chaabia Pharmacy",
      "nameAr": "صيدلية الخيرات الشعبية",
      "phone": "05 37 36 59 23",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "Rue Kennedy numero 33, centre-ville",
      "addressEn": "Kennedy Street No. 33, city center",
      "addressAr": "شارع كينيدي رقم 33، وسط المدينة",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Khayrat%20Chaabia%20Kennedy%2033%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ibn-tofail",
      "name": "Pharmacie Ibn Tofail",
      "nameEn": "Ibn Tofail Pharmacy",
      "nameAr": "صيدلية ابن طفيل",
      "phone": "05 37 36 57 00",
      "district": "Bir Rami Est",
      "districtEn": "Bir Rami East",
      "districtAr": "بئر الرامي الشرقية",
      "address": "Ouled Mbarek, Bir Rami Est, route de Taounate, pres de la nouvelle prefecture de police de Bir Rami",
      "addressEn": "Ouled Mbarek, Bir Rami East, Taounate road, near the new Bir Rami police headquarters",
      "addressAr": "أولاد مبارك بن بئر الرامي الشرقية، طريق الطايونة، قرب القيادة الجديدة لبئر الرامي",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ibn%20Tofail%20Bir%20Rami%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "bilal",
      "name": "Pharmacie Bilal",
      "nameEn": "Bilal Pharmacy",
      "nameAr": "صيدلية بلال",
      "phone": "08 09 88 80 09 / 07 66 39 79 25",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Centre commercial Marjane",
      "addressEn": "Inside Marjane shopping center",
      "addressAr": "داخل المركز التجاري مرجان",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Bilal%20Marjane%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "belhachmi",
      "name": "Pharmacie Belhachmi",
      "nameEn": "Belhachmi Pharmacy",
      "nameAr": "صيدلية بلهاشمي",
      "phone": "05 37 39 80 54",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Lotissement Al Hayat numero 1146, derriere la mosquee Errayan, rue en face de la porte arriere de la mosquee",
      "addressEn": "Al Hayat subdivision No. 1146, behind Errayan mosque, on the street opposite the mosque back gate",
      "addressAr": "تجزئة الحياة رقم 1146، خلف مسجد الريان في الشارع المقابل للباب الخلفي للمسجد",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Belhachmi%20Ouled%20Oujih%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "salam-saknia",
      "name": "Pharmacie Salam",
      "nameEn": "Salam Pharmacy",
      "nameAr": "صيدلية السلام",
      "phone": "05 37 38 78 10",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Lot 2, devant college Hilal Ben Abdellah, pres de Maamel Zerai, terminus bus numero 12, Saknia",
      "addressEn": "Lot 2, in front of Hilal Ben Abdellah middle school, near Maamel Zerai, bus line 12 terminus, Saknia",
      "addressAr": "بام 2 أمام إعدادية هلال بن عبد الله وقرب معمل الزراعي، بنهاية الحافلة رقم 12، الساكنية",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Salam%20Saknia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "centre-ville-diwri",
      "name": "Pharmacie Centre Ville",
      "nameEn": "Centre Ville Pharmacy",
      "nameAr": "صيدلية وسط المدينة",
      "phone": "05 37 37 67 29",
      "district": "Centre-ville",
      "districtEn": "City center",
      "districtAr": "وسط المدينة",
      "address": "Rue Hamad Diouri, en face de la station Winxo, pres de Kenitra Mall",
      "addressEn": "Hamad Diouri Street, opposite Winxo station, near Kenitra Mall",
      "addressAr": "شارع حمد الديوري، قبالة محطة البنزين وينكسو، قرب Kenitra Mall",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Centre%20Ville%20Rue%20Hamad%20Diouri%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "fourat",
      "name": "Pharmacie Fourat",
      "nameEn": "Fourat Pharmacy",
      "nameAr": "صيدلية الفوارات",
      "phone": "05 37 38 00 32",
      "district": "Fourat",
      "districtEn": "Fourat",
      "districtAr": "الفوارات",
      "address": "Groupe Haj Mansour, pres de la mosquee Fourat",
      "addressEn": "Haj Mansour group, near Fourat mosque",
      "addressAr": "مجموعة الحاج منصور، قرب مسجد الفوارات",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Fourat%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-widad",
      "name": "Pharmacie Al Widad",
      "nameEn": "Al Widad Pharmacy",
      "nameAr": "صيدلية الوداد",
      "phone": "05 37 35 11 25",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Lot Ismailia numero 1435, route separant Taibia et Ismailia, a 300 m du cafe Angelina",
      "addressEn": "Lot Ismailia No. 1435, road between Taibia and Ismailia, 300 m from Cafe Angelina",
      "addressAr": "تجزئة الإسماعيلية رقم 1435، الطريق الفاصلة بين الطبية والإسماعيلية، على بعد 300 م من مقهى أنجلينا",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Widad%20Lot%20Ismailia%201435%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ourida",
      "name": "Pharmacie Ourida",
      "nameEn": "Ourida Pharmacy",
      "nameAr": "صيدلية أوريدة",
      "phone": "05 37 38 34 67",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "Lot Ourida, lot numero 91, terminus bus numero 13",
      "addressEn": "Ourida subdivision, lot No. 91, bus terminus No. 13",
      "addressAr": "مجموعة أوريدة رقم 91، نهاية الحافلة رقم 13",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ourida%20Lot%20Ourida%2091%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "essoufi",
      "name": "Pharmacie Essoufi",
      "nameEn": "Essoufi Pharmacy",
      "nameAr": "صيدلية الصوفي",
      "phone": "05 37 36 74 12",
      "district": "Ville Nouvelle",
      "districtEn": "Ville Nouvelle",
      "districtAr": "المدينة الجديدة",
      "address": "Lot Le Vallon numero 506, derriere le lycee Abderrahman Nacer",
      "addressEn": "Lot Le Vallon No. 506, behind Abderrahman Nacer high school",
      "addressAr": "تجزئة لوفالون رقم 506، خلف ثانوية عبد الرحمان الناصر",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Essoufi%20Le%20Vallon%20506%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "dalia",
      "name": "Pharmacie Dalia",
      "nameEn": "Dalia Pharmacy",
      "nameAr": "صيدلية الدالية",
      "phone": "05 37 36 17 27",
      "district": "Bir Rami Industrielle",
      "districtEn": "Bir Rami Industrial Area",
      "districtAr": "بئر الرامي الصناعية",
      "address": "Lot 17 Maghreb Al Arabi A2, entre le college Moulay Ali Cherif et la mosquee Al Omma, derriere Assouak Essalam",
      "addressEn": "Lot 17 Maghreb Al Arabi A2, between Moulay Ali Cherif middle school and Al Omma mosque, behind Assouak Essalam",
      "addressAr": "مجموعة 17 المغرب العربي، بين إعدادية مولاي علي الشريف ومسجد الأمة، وراء أسواق السلام",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Dalia%20Maghreb%20Al%20Arabi%20A2%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "diour-pam",
      "name": "Pharmacie Diour Pam",
      "nameEn": "Diour Pam Pharmacy",
      "nameAr": "صيدلية ديور بام",
      "phone": "05 37 38 08 81",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Numero 28, rue 98, Pam 1, pres du terminus bus 7 et 12, pres de la mosquee Miloud",
      "addressEn": "No. 28, Street 98, Pam 1, near bus terminus 7 and 12, near Miloud mosque",
      "addressAr": "رقم 28 زنقة 98، بام 1، قرب نهاية الحافلة رقم 7 و12 وقرب مسجد ميلود",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Diour%20Pam%20Rue%2098%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "azhar",
      "name": "Pharmacie Azhar",
      "nameEn": "Azhar Pharmacy",
      "nameAr": "صيدلية الأزهر",
      "phone": "05 37 36 36 83",
      "district": "Ville Nouvelle - Bir Rami Est",
      "districtEn": "Ville Nouvelle - Bir Rami East",
      "districtAr": "المدينة الجديدة - بئر الرامي الشرقية",
      "address": "Bir Rami Est, villa numero 515, pres des immeubles Assouak Essalam et du restaurant italien, en face du centre ADVIM",
      "addressEn": "Bir Rami East, villa No. 515, near Assouak Essalam buildings and the Italian restaurant, opposite ADVIM center",
      "addressAr": "فيلا رقم 515، بئر الرامي الشرقية، قرب عمارات أسواق السلام والمطعم الإيطالي، أمام مركز المعاقين ADVIM",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Azhar%20Bir%20Rami%20Est%20515%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "farazdaq",
      "name": "Pharmacie Farazdaq",
      "nameEn": "Farazdaq Pharmacy",
      "nameAr": "صيدلية الفرزدق",
      "phone": "05 37 35 12 11",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Bloc I, numero 171, Ouled Oujih, sur la voie principale en face du Credit Agricole, pres de la mosquee Al Houda",
      "addressEn": "Block I, No. 171, Ouled Oujih, on the main road opposite Credit Agricole, near Al Houda mosque",
      "addressAr": "بلوك I رقم 171، أولاد أوجيه، الشارع الرئيسي مقابل القرض الفلاحي، قرب مسجد الهدى",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Farazdaq%20Bloc%20I%20171%20Ouled%20Oujih%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-manar",
      "name": "Pharmacie Al Manar",
      "nameEn": "Al Manar Pharmacy",
      "nameAr": "صيدلية المنار",
      "phone": "06 58 78 28 42 / 05 37 39 50 33",
      "district": "Bir Rami Industrielle",
      "districtEn": "Bir Rami Industrial Area",
      "districtAr": "بئر الرامي الصناعية",
      "address": "42 lot Al Manar, Bir Rami Industrielle, derriere les immeubles Tawfik et le projet Tajhiz Saniya",
      "addressEn": "42 Al Manar subdivision, Bir Rami Industrial Area, behind Tawfik buildings and Tajhiz Saniya project",
      "addressAr": "تجزئة المنار رقم 42، بئر الرامي الصناعية، خلف عمارات التوفيق ومشروع تجهيز السانية",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Manar%2042%20Lot%20Al%20Manar%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "lotissement-assam",
      "name": "Pharmacie Lotissement Assam",
      "nameEn": "Lotissement Assam Pharmacy",
      "nameAr": "صيدلية تجزئة العصام",
      "phone": "06 96 53 86 64",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "327 lot Assam, derriere Qentar, pres de la mosquee Al Izzah, a cote de la nouvelle Saknia",
      "addressEn": "327 Assam subdivision, behind Qentar, near Al Izzah mosque, beside the new Saknia area",
      "addressAr": "تجزئة العصام رقم 327، خلف قنطار، قرب مسجد العزة، بجانب السكنية الجديدة",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Lotissement%20Assam%20327%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "attakaddoum",
      "name": "Pharmacie Attakaddoum",
      "nameEn": "Attakaddoum Pharmacy",
      "nameAr": "صيدلية التقدم",
      "phone": "05 37 37 99 97",
      "district": "Medina - Centre-ville",
      "districtEn": "Medina - City center",
      "districtAr": "المدينة - وسط المدينة",
      "address": "100, rue Sidi Mohamed, en face de la gare routiere des voyageurs",
      "addressEn": "100 Sidi Mohamed Street, opposite the passenger bus station",
      "addressAr": "رقم 100 زنقة سيدي محمد، أمام المحطة الطرقية للمسافرين",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Attakaddoum%20100%20rue%20Sidi%20Mohamed%20gare%20routiere%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ammour",
      "name": "Pharmacie Ammour",
      "nameEn": "Ammour Pharmacy",
      "nameAr": "صيدلية عمور",
      "phone": "05 37 39 30 32",
      "district": "Saknia - Ouled Arafa",
      "districtEn": "Saknia - Ouled Arafa",
      "districtAr": "السكنية - أولاد عرفة",
      "address": "Douil Foq, route double voie vers Al Fouarat, lotissement Al Amal extension, pres du cafe Najma Dahabia",
      "addressEn": "Douil Foq, dual carriageway toward Al Fouarat, Al Amal extension subdivision, near Najma Dahabia cafe",
      "addressAr": "دويل فوق، الطريق المزدوجة أولاد عرفة في اتجاه الفوارات، تجزئة الأمل توسع، قرب مقهى النجمة الذهبية",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ammour%20Douil%20Foq%20Ouled%20Arafa%20Saknia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-firdous",
      "name": "Pharmacie Al Firdous",
      "nameEn": "Al Firdous Pharmacy",
      "nameAr": "صيدلية الفردوس",
      "phone": "05 37 37 19 79",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "322, avenue Mohamed V, pres de l ecole Balzac",
      "addressEn": "322 Mohamed V Avenue, near Balzac school",
      "addressAr": "322 شارع محمد الخامس، قرب مدرسة بالزاك",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Firdous%20322%20Avenue%20Mohamed%20V%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ilyas-el-assam",
      "name": "Pharmacie Ilyas El Assam",
      "nameEn": "Ilyas El Assam Pharmacy",
      "nameAr": "صيدلية إلياس العصام",
      "phone": "07 60 57 18 16 / 05 37 30 76 57",
      "district": "Saknia - Medina",
      "districtEn": "Saknia - Medina",
      "districtAr": "السكنية - المدينة",
      "address": "A cote de l Hotel Assam, en face d Atacadao",
      "addressEn": "Next to Hotel Assam, opposite Atacadao",
      "addressAr": "جانب فندق العصام، أمام أتقداو",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ilyas%20El%20Assam%20Hotel%20Assam%20Atacadao%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "sirine",
      "name": "Pharmacie Sirine",
      "nameEn": "Sirine Pharmacy",
      "nameAr": "صيدلية سيرين",
      "phone": "05 37 37 39 64",
      "district": "Bir Rami Sud",
      "districtEn": "Bir Rami South",
      "districtAr": "بئر الرامي الجنوبية",
      "address": "Numero 988, Bir Rami Sud Al Omrane, derriere la zone industrielle et la salle couverte de Bir Rami Sud, pres du projet de la mosquee Arrahmane",
      "addressEn": "No. 988, Bir Rami South Al Omrane, behind the industrial area and covered hall of Bir Rami South, near the Arrahmane mosque project",
      "addressAr": "رقم 988 بئر الرامي الجنوبية العمران، خلف الحي الصناعي والقاعة المغطاة لبئر الرامي الجنوبية، قرب مشروع مسجد الرحمان",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Sirine%20988%20Bir%20Rami%20Sud%20Al%20Omrane%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ibn-khaldoun",
      "name": "Pharmacie Ibn Khaldoun",
      "nameEn": "Ibn Khaldoun Pharmacy",
      "nameAr": "صيدلية ابن خلدون",
      "phone": "05 37 38 29 76",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Saknia 1, rue 7, numero 158, Dahrone, en face du cafe Al Assafir",
      "addressEn": "Saknia 1, Street 7, No. 158, Dahrone, opposite Al Assafir cafe",
      "addressAr": "السكنية 1 زنقة 7 رقم 158، ظهرون، أمام مقهى العصافير",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ibn%20Khaldoun%20Saknia%201%20rue%207%20158%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "lila",
      "name": "Pharmacie Lila",
      "nameEn": "Lila Pharmacy",
      "nameAr": "صيدلية ليلى",
      "phone": "05 37 32 27 41",
      "district": "Haddada - Route de Mehdia",
      "districtEn": "Haddada - Mehdia Road",
      "districtAr": "الحدادة - طريق مهدية",
      "address": "Lotissement Al Jadida Haddada numero 2286, route de Mehdia, Al Zitouane 2, apres la base aerienne militaire, a 100 m du cafe Marrakech",
      "addressEn": "Al Jadida Haddada subdivision No. 2286, Mehdia Road, Al Zitouane 2, after the military air base, 100 m from Cafe Marrakech",
      "addressAr": "التجزئة الجديدة للحدادة رقم 2286، طريق مهدية، الزيتون الثاني بعد القاعدة الجوية العسكرية، على بعد 100 م من مقهى مراكش",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Lila%20Haddada%202286%20route%20de%20Mehdia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-bassatine-errahmania",
      "name": "Pharmacie Al Bassatine Errahmania",
      "nameEn": "Al Bassatine Errahmania Pharmacy",
      "nameAr": "صيدلية البساتين الرحمانية",
      "phone": "07 01 09 20 32",
      "district": "Al Fouarat",
      "districtEn": "Al Fouarat",
      "districtAr": "الفوارات",
      "address": "Lotissement Al Bassatine, Al Fouarat, pres des villas, disponible sur GPS",
      "addressEn": "Al Bassatine subdivision, Al Fouarat, near the villas, available on GPS",
      "addressAr": "تجزئة البساتين، الفوارات، قرب الفيلات، متاح على GPS",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Bassatine%20Errahmania%20Al%20Fouarat%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "bouafia",
      "name": "Pharmacie Bouafia",
      "nameEn": "Bouafia Pharmacy",
      "nameAr": "صيدلية بوعافية",
      "phone": "06 02 24 96 85 / 05 30 39 93 85",
      "district": "Bir Rami Sud",
      "districtEn": "Bir Rami South",
      "districtAr": "بئر الرامي الجنوبية",
      "address": "Pres du cafe Arina, Bir Rami Sud, pres du lycee Allal El Fassi",
      "addressEn": "Near Cafe Arina, Bir Rami South, near Allal El Fassi high school",
      "addressAr": "قرب مقهى أرينا، بئر الرامي الجنوبية، قرب ثانوية علال الفاسي",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Bouafia%20Bir%20Rami%20Sud%20Cafe%20Arina%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "alhamd-lillah",
      "name": "Pharmacie Alhamd Lillah",
      "nameEn": "Alhamd Lillah Pharmacy",
      "nameAr": "صيدلية الحمد لله",
      "phone": "06 42 83 69 19 / 05 37 39 18 77",
      "district": "Al Fouarat",
      "districtEn": "Al Fouarat",
      "districtAr": "الفوارات",
      "address": "Jazaa Al Haj Mansour numero 12, Saktour S, Al Fouarat",
      "addressEn": "Jazaa Al Haj Mansour No. 12, Saktour S, Al Fouarat",
      "addressAr": "جزءة الحاج منصور رقم 12، سكتور س، الفوارات",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Alhamd%20Lillah%20Haj%20Mansour%2012%20Al%20Fouarat%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "asswak-assalam",
      "name": "Pharmacie Asswak Assalam",
      "nameEn": "Asswak Assalam Pharmacy",
      "nameAr": "صيدلية أسواق السلام",
      "phone": "05 37 37 64 78",
      "district": "Bir Rami Industrielle",
      "districtEn": "Bir Rami Industrial Area",
      "districtAr": "بئر الرامي الصناعية",
      "address": "N 2 et 3, a l interieur du centre commercial Asswak Assalam",
      "addressEn": "No. 2 and 3 inside Asswak Assalam shopping center",
      "addressAr": "رقم 2 و3 داخل محلات المركز التجاري أسواق السلام",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Asswak%20Assalam%20Centre%20Commercial%20Asswak%20Assalam%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ibn-baytar",
      "name": "Pharmacie Ibn Baytar",
      "nameEn": "Ibn Baytar Pharmacy",
      "nameAr": "صيدلية ابن بيطار",
      "phone": "05 37 35 70 22",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Lot Al Haddada, pres de la mosquee Arayane, immeuble Al Rayhane, en face du grand rond-point",
      "addressEn": "Al Haddada subdivision, near Arayane mosque, Al Rayhane building, opposite the large roundabout",
      "addressAr": "تجزئة الحدادة قرب مسجد الريان، عمارة الريحان، أمام الدوران الكبير",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ibn%20Baytar%20Lot%20Al%20Haddada%20Mosquee%20Arayane%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "el-gueddari",
      "name": "Pharmacie El Gueddari",
      "nameEn": "El Gueddari Pharmacy",
      "nameAr": "صيدلية الكداري",
      "phone": "06 18 82 75 92",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "Rue 153, numero 222, Afca, pres du cinema Atlas",
      "addressEn": "Street 153, No. 222, Afca, near Cinema Atlas",
      "addressAr": "شارع 153 رقم 222، أفكا، قرب سينما الأطلس",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20El%20Gueddari%20Rue%20153%20222%20Afca%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "haddioui",
      "name": "Pharmacie Haddioui",
      "nameEn": "Haddioui Pharmacy",
      "nameAr": "صيدلية حديوي",
      "phone": "05 37 36 79 17",
      "district": "Ville Nouvelle",
      "districtEn": "Ville Nouvelle",
      "districtAr": "المدينة الجديدة",
      "address": "Avenue Roosevelt numero 5",
      "addressEn": "Roosevelt Avenue No. 5",
      "addressAr": "شارع روزفلت رقم 5",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Haddioui%20Avenue%20Roosevelt%205%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "principale-al-bassatine",
      "name": "Pharmacie Principale Al Bassatine",
      "nameEn": "Principale Al Bassatine Pharmacy",
      "nameAr": "الصيدلية الرئيسية البساتين",
      "phone": "07 01 09 20 32 / 06 60 91 54 75",
      "district": "Saknia - Fouarat",
      "districtEn": "Saknia - Fouarat",
      "districtAr": "السكنية - الفوارات",
      "address": "Lot Al Bassatine, Fouarat, disponible sur GPS",
      "addressEn": "Al Bassatine subdivision, Fouarat, available on GPS",
      "addressAr": "تجزئة البساتين، الفوارات، متاح على GPS",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Principale%20Al%20Bassatine%20Lot%20Al%20Bassatine%20Fouarat%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-hamd",
      "name": "Pharmacie Al Hamd",
      "nameEn": "Al Hamd Pharmacy",
      "nameAr": "صيدلية الحمد",
      "phone": "05 37 35 74 73",
      "district": "Ouled Oujih",
      "districtEn": "Ouled Oujih",
      "districtAr": "أولاد أوجيه",
      "address": "Tajziat Al Maghrib Al Arabi, bloc D, numero 659, Ouled Oujih, devant Dar Al Ajaza et Dar Al Fatayat, pres d Asswak Salam",
      "addressEn": "Al Maghrib Al Arabi subdivision, Block D, No. 659, Ouled Oujih, in front of Dar Al Ajaza and Dar Al Fatayat, near Asswak Salam",
      "addressAr": "تجزئة المغرب العربي بلوك د رقم 659، أولاد أوجيه، أمام دار العجزة ودار الفتيات، قرب أسواق السلام",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Hamd%20Bloc%20D%20659%20Ouled%20Oujih%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-mostachfa",
      "name": "Pharmacie Al Mostachfa",
      "nameEn": "Al Mostachfa Pharmacy",
      "nameAr": "صيدلية المستشفى",
      "phone": "05 37 38 10 37",
      "district": "Saknia - Medina",
      "districtEn": "Saknia - Medina",
      "districtAr": "السكنية - المدينة",
      "address": "Numero 4, rue Al Bassra, Hay Al Fath, entre la 7e annexe administrative et Dar Chabab Rahal El Meskini",
      "addressEn": "No. 4, Al Bassra Street, Hay Al Fath, between the 7th administrative annex and Dar Chabab Rahal El Meskini",
      "addressAr": "رقم 4 شارع البصرة، حي الفتح، بين المقاطعة السابعة ودار الشباب رحال المسكيني",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Mostachfa%20Hay%20Al%20Fath%20Rahal%20El%20Meskini%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "er-rissala",
      "name": "Pharmacie Er Rissala",
      "nameEn": "Er Rissala Pharmacy",
      "nameAr": "صيدلية الرسالة",
      "phone": "05 30 00 59 30",
      "district": "Al Houzia",
      "districtEn": "Al Houzia",
      "districtAr": "الحوزية",
      "address": "Bloc C Al Houzia, numero 78, route de Mehdia, en face du cafe Omar et de la base aerienne, en face de la mosquee Al Kawtar",
      "addressEn": "Block C Al Houzia, No. 78, Mehdia road, opposite Cafe Omar and the air base, opposite Al Kawtar mosque",
      "addressAr": "بلوك C الحوزية رقم 78، طريق مهدية، أمام مقهى عمر وقرب القاعدة الجوية، أمام مسجد الكوثر",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Er%20Rissala%20Al%20Houzia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "charkaoui",
      "name": "Pharmacie Charkaoui",
      "nameEn": "Charkaoui Pharmacy",
      "nameAr": "صيدلية الشرقاوي",
      "phone": "05 37 39 24 44",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Zenka 13, numero 29, pres de Joutiya Kerakchou, pres de BMCE Errachad",
      "addressEn": "Street 13, No. 29, near Joutiya Kerakchou, near BMCE Errachad",
      "addressAr": "زنقة 13 رقم 29، قرب جوطية كراكشو، قرب BMCE إرشاد",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Charkaoui%20Saknia%20BMCE%20Errachad%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "ar-rif",
      "name": "Pharmacie Ar Rif",
      "nameEn": "Ar Rif Pharmacy",
      "nameAr": "صيدلية الريف",
      "phone": "05 37 36 33 00",
      "district": "Bir Rami Est",
      "districtEn": "Bir Rami East",
      "districtAr": "بئر الرامي الشرقي",
      "address": "Pres de la mosquee Maich, Bir Rami Est, sur la route double en direction de la grande gare",
      "addressEn": "Near Maich mosque, Bir Rami East, on the dual road toward the main train station",
      "addressAr": "قرب مسجد مائش، بئر الرامي الشرقي، على الطريق المزدوجة في اتجاه محطة القطار الكبرى",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Ar%20Rif%20Bir%20Rami%20Est%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-ghofrane",
      "name": "Pharmacie Al Ghofrane",
      "nameEn": "Al Ghofrane Pharmacy",
      "nameAr": "صيدلية الغفران",
      "phone": "05 37 38 53 23",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Al Wifaq F, numero 128, Saknia, pres de la mosquee Al Ghofrane en direction de la salle couverte",
      "addressEn": "Al Wifaq F, No. 128, Saknia, near Al Ghofrane mosque toward the covered hall",
      "addressAr": "الوفاق F رقم 128، السكنية، قرب مسجد الغفران في اتجاه القاعة المغطاة",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Ghofrane%20Al%20Wifaq%20128%20Saknia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-majd",
      "name": "Pharmacie Al Majd",
      "nameEn": "Al Majd Pharmacy",
      "nameAr": "صيدلية المجد",
      "phone": "05 37 35 35 72",
      "district": "Al Houzia",
      "districtEn": "Al Houzia",
      "districtAr": "الحوزية",
      "address": "Groupe D, pres de la Banque Populaire, Al Houzia, route double depuis Ouled Oujih vers rond-point de la base aerienne, pres de l ecole Annakhil et Al Fath",
      "addressEn": "Group D, near Banque Populaire, Al Houzia, dual road from Ouled Oujih toward the air base roundabout, near Annakhil and Al Fath schools",
      "addressAr": "مجموعة د قرب البنك الشعبي، الحوزية، الطريق المزدوجة من أولاد أوجيه اتجاه Rond-Point القاعدة الجوية، قرب مدرسة النخيل والفتح",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Majd%20Al%20Houzia%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "hopital-idrissi",
      "name": "Pharmacie Hopital Idrissi",
      "nameEn": "Hopital Idrissi Pharmacy",
      "nameAr": "صيدلية مستشفى الإدريسي",
      "phone": "05 37 37 32 76",
      "district": "Medina",
      "districtEn": "Medina",
      "districtAr": "المدينة",
      "address": "A cote de l hopital Idrissi, derriere la gare routiere et derriere la grande gare ferroviaire",
      "addressEn": "Next to Idrissi Hospital, behind the bus station and behind the main train station",
      "addressAr": "بجانب مستشفى الإدريسي، وراء محطة القطار الكبرى ووراء محطة الحافلات",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Hopital%20Idrissi%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "mosquee-palestine",
      "name": "Pharmacie Mosquee Palestine",
      "nameEn": "Mosquee Palestine Pharmacy",
      "nameAr": "صيدلية مسجد فلسطين",
      "phone": "05 37 36 44 06",
      "district": "Bir Rami Est",
      "districtEn": "Bir Rami East",
      "districtAr": "بئر الرامي الشرقي",
      "address": "Hay Al Manzah, Bir Rami Est, pres de la mosquee Palestine, Douar Fellaha",
      "addressEn": "Hay Al Manzah, Bir Rami East, near Palestine mosque, Douar Fellaha",
      "addressAr": "حي المنزه، بئر الرامي الشرقية، قرب مسجد فلسطين، دوار الفلاحة",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Mosquee%20Palestine%20Bir%20Rami%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    },
    {
      "id": "al-massira",
      "name": "Pharmacie Al Massira",
      "nameEn": "Al Massira Pharmacy",
      "nameAr": "صيدلية المسيرة",
      "phone": "05 37 38 06 27",
      "district": "Saknia",
      "districtEn": "Saknia",
      "districtAr": "السكنية",
      "address": "Groupe Pam, a cote de Kissariat Oued Dahab",
      "addressEn": "Pam group, next to Kissariat Oued Dahab",
      "addressAr": "مجموعة بام، بجانب قيسارية وادي الذهب",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Pharmacie%20Al%20Massira%20Groupe%20Pam%20Kenitra",
      "hours": "A completer",
      "hoursEn": "To be completed",
      "hoursAr": "سيتم إكمالها",
      "services": []
    }
  ],
  "noteEn": "Night duty 24/24 for Wednesday, August 12, 2026. Always call the pharmacy before going.",
  "noteAr": "حراسة ليلية 24/24 ليوم الأربعاء 12 غشت 2026. يرجى الاتصال بالصيدلية قبل التنقل."
};
const pharmacyLabels = {
  fr: {
    title: "Pharmacies de garde à Kénitra",
    updated: "Date de mise à jour",
    noDay: "Aucune pharmacie de garde de jour officielle n’est renseignée pour le moment.",
    noNight: "Aucune pharmacie de garde de nuit officielle n’est renseignée pour le moment.",
    noDirectory: "Aucune pharmacie permanente n’est encore renseignée.",
    call: "Appeler",
    directions: "Itinéraire Google Maps",
    phone: "Téléphone",
    district: "Quartier",
    address: "Adresse",
    hours: "Horaires de garde",
    day: "De garde",
    night: "De garde",
    directoryHours: "Horaires",
    toComplete: "À compléter"
  },
  en: {
    title: "On-duty pharmacies in Kenitra",
    updated: "Update date",
    noDay: "No official day on-duty pharmacy is listed for now.",
    noNight: "No official night on-duty pharmacy is listed for now.",
    noDirectory: "No permanent pharmacy profile is listed yet.",
    call: "Call",
    directions: "Google Maps directions",
    phone: "Phone",
    district: "District",
    address: "Address",
    hours: "Duty hours",
    day: "On duty",
    night: "On duty",
    directoryHours: "Opening hours",
    toComplete: "To be completed"
  },
  ar: {
    title: "صيدليات الحراسة في القنيطرة",
    updated: "تاريخ التحديث",
    noDay: "لا توجد صيدلية حراسة نهارية رسمية مسجلة حالياً.",
    noNight: "لا توجد صيدلية حراسة ليلية رسمية مسجلة حالياً.",
    noDirectory: "لم تتم إضافة أي صيدلية دائمة بعد.",
    call: "اتصال",
    directions: "الاتجاهات عبر Google Maps",
    phone: "الهاتف",
    district: "الحي",
    address: "العنوان",
    hours: "أوقات الحراسة",
    day: "حراسة",
    night: "حراسة",
    directoryHours: "أوقات العمل",
    toComplete: "سيتم إكمالها"
  }
};

const getPharmacyLabels = () => pharmacyLabels[currentLang] || pharmacyLabels.fr;

const getPharmacyMapsUrl = (pharmacy) =>
  pharmacy.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pharmacy.name || ""} ${pharmacy.district || ""} Kenitra`)}`;

const createPharmacyLine = (label, value, options = {}) => {
  if (!value) return "";
  const dir = options.dir ? ` dir="${options.dir}"` : "";
  return `<p class="pharmacy-card-line"><span>${label}</span><b${dir}>${value}</b></p>`;
};

const createPharmacyCard = (pharmacy, options = {}) => {
  const labels = getPharmacyLabels();
  const isDuty = Boolean(options.badge);
  const badgeLabel = options.badge === "day" ? labels.day : options.badge === "night" ? labels.night : "";
  const name = getLocalized(pharmacy, "name") || pharmacy.name || labels.toComplete;
  const district = getLocalized(pharmacy, "district") || pharmacy.district || labels.toComplete;
  const address = getLocalized(pharmacy, "address") || pharmacy.address || labels.toComplete;
  const mapsUrl = getPharmacyMapsUrl(pharmacy);
  const article = document.createElement("article");
  article.className = `pharmacy-card${isDuty ? " pharmacy-card--duty" : " pharmacy-card--directory"}`;

  article.innerHTML = `
    <div class="pharmacy-card-head">
      <h3>${name}</h3>
      ${badgeLabel ? `<span class="pharmacy-duty-badge pharmacy-duty-badge--${options.badge}">${badgeLabel}</span>` : ""}
    </div>
    ${createPharmacyLine(labels.district, district)}
    ${createPharmacyLine(labels.address, address)}
    ${createPharmacyLine(labels.phone, pharmacy.phone, { dir: "ltr" })}
    <div class="pharmacy-actions">
      ${pharmacy.phone ? `<a href="${normalizePhoneHref(pharmacy.phone)}" aria-label="${labels.call} ${name}">${labels.call}</a>` : ""}
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" aria-label="${labels.directions} ${name}">${labels.directions}</a>
    </div>
  `;

  return article;
};

const renderPharmacyEmpty = (container, message) => {
  container.replaceChildren();
  const empty = document.createElement("p");
  empty.className = "pharmacy-empty";
  empty.textContent = message;
  container.append(empty);
};

const updatePharmacyJsonLd = (data) => {
  document.querySelector("[data-pharmacy-jsonld]")?.remove();
  const pharmacies = [...(data?.duty?.day || []), ...(data?.duty?.night || []), ...(data?.directory || [])];
  if (!pharmacies.length) return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.pharmacyJsonld = "true";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: getPharmacyLabels().title,
    itemListElement: pharmacies.map((pharmacy, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Pharmacy",
        name: pharmacy.name,
        telephone: pharmacy.phone || undefined,
        address: pharmacy.address || undefined,
        url: getPharmacyMapsUrl(pharmacy)
      }
    }))
  });
  document.head.append(script);
};

const renderPharmacies = (data) => {
  if (!pharmacyDutyLists.length && !pharmacyDirectoryList) return;

  const labels = getPharmacyLabels();
  if (pharmacyTitle) pharmacyTitle.textContent = data.displayDate ? `${labels.updated} : ${getLocalized(data, "displayDate") || data.displayDate}` : labels.title;
  if (pharmacyUpdated) pharmacyUpdated.textContent = getLocalized(data, "note") || data.note || labels.title;

  pharmacyDutyLists.forEach((container) => {
    const dutyType = container.dataset.pharmacyDutyList;
    const pharmacies = data?.duty?.[dutyType] || [];
    container.replaceChildren();
    if (!pharmacies.length) {
      renderPharmacyEmpty(container, dutyType === "night" ? labels.noNight : labels.noDay);
      return;
    }
    pharmacies.forEach((pharmacy) => container.append(createPharmacyCard(pharmacy, { badge: dutyType })));
  });

  if (pharmacyDirectoryList) {
    const directory = data.directory || data.pharmacies || [];
    pharmacyDirectoryList.replaceChildren();
    if (!directory.length) {
      renderPharmacyEmpty(pharmacyDirectoryList, labels.noDirectory);
    } else {
      directory.forEach((pharmacy) => pharmacyDirectoryList.append(createPharmacyCard(pharmacy)));
    }
  }

  updatePharmacyJsonLd(data);
};

const loadPharmacies = async () => {
  if (!pharmacyDutyLists.length && !pharmacyDirectoryList) return;

  const pharmacyDataUrls = ["data/pharmacies-garde-2026-08-12.json", "data/pharmacies-garde.json"];

  try {
    let data = null;
    for (const url of pharmacyDataUrls) {
      const response = await fetch(`${url}?cache=${Date.now()}`);
      if (!response.ok) continue;
      data = await response.json();
      break;
    }
    if (!data) throw new Error("Pharmacy data unavailable");
    renderPharmacies(data);
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
const hasVerifiedGoogleRating = (lab) =>
  lab.rating !== null && lab.rating !== "" && hasNumericRating(lab);

const sortLaboratories = (laboratories) =>
  [...laboratories].sort((a, b) => {
    const ratingA = hasVerifiedGoogleRating(a) ? Number(a.rating) : -1;
    const ratingB = hasVerifiedGoogleRating(b) ? Number(b.rating) : -1;

    if (ratingB !== ratingA) return ratingB - ratingA;

    const reviewsA = hasVerifiedGoogleRating(a) ? Number(a.reviewCount) : 0;
    const reviewsB = hasVerifiedGoogleRating(b) ? Number(b.reviewCount) : 0;

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
  if (!hasVerifiedGoogleRating(lab)) {
    return null;
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
  const ratingHtml = rating
    ? `<span class="compact-rating" aria-label="${rating.label}">
        <span aria-hidden="true">${rating.stars}</span>
        <b>${rating.label}</b>
      </span>`
    : "";
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
      ${ratingHtml}
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
    const ratingA = a.rating !== null && a.rating !== "" && Number.isFinite(Number(a.rating)) ? Number(a.rating) : -1;
    const ratingB = b.rating !== null && b.rating !== "" && Number.isFinite(Number(b.rating)) ? Number(b.rating) : -1;
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
  if (center.rating === null || center.rating === "" || !Number.isFinite(Number(center.rating))) return null;
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
  const ratingHtml = rating
    ? `<span class="compact-rating" aria-label="${rating.label}">
        <span aria-hidden="true">${rating.stars}</span>
        <b>${rating.label}</b>
      </span>`
    : "";
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
      ${ratingHtml}
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
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

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

    gallery.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = true;
        window.clearInterval(timer);
      },
      { passive: true }
    );

    gallery.addEventListener(
      "touchend",
      (event) => {
        if (!isSwiping) return;
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        isSwiping = false;

        if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
          showImage(activeIndex + (deltaX < 0 ? 1 : -1));
        }

        restart();
      },
      { passive: true }
    );

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
  const viewport = section.querySelector(".new-cabinets-carousel__viewport");
  const track = section.querySelector("[data-new-cabinets-track]");
  if (!viewport || !track || track.children.length) return;

  const cards = newMedicalCabinets.map(createNewCabinetCard);
  const group = document.createElement("div");
  group.className = "new-cabinets-carousel__group";
  cards.forEach((card) => group.append(card));

  const duplicate = group.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("a").forEach((link) => {
    link.tabIndex = -1;
  });
  const duplicateAfter = duplicate.cloneNode(true);

  track.append(group, duplicate, duplicateAfter);

  let autoplayId = 0;
  let resumeId = 0;
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  const getLoopWidth = () => group.scrollWidth;
  const normalizeScroll = () => {
    const loopWidth = getLoopWidth();
    if (!loopWidth) return;
    if (viewport.scrollLeft >= loopWidth * 1.5) viewport.scrollLeft -= loopWidth;
    if (viewport.scrollLeft <= loopWidth * 0.5) viewport.scrollLeft += loopWidth;
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = 0;
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(() => {
      const direction = document.documentElement.dir === "rtl" ? -1 : 1;
      viewport.scrollLeft += direction;
      normalizeScroll();
    }, 24);
  };

  const scheduleAutoplay = () => {
    window.clearTimeout(resumeId);
    resumeId = window.setTimeout(startAutoplay, 1800);
  };

  requestAnimationFrame(() => {
    viewport.scrollLeft = getLoopWidth();
    startAutoplay();
  });

  viewport.addEventListener("pointerdown", (event) => {
    isPointerDown = true;
    startX = event.clientX;
    startScrollLeft = viewport.scrollLeft;
    section.classList.add("is-touching");
    stopAutoplay();
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isPointerDown) return;
    viewport.scrollLeft = startScrollLeft - (event.clientX - startX);
    normalizeScroll();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    viewport.addEventListener(eventName, (event) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      section.classList.remove("is-touching");
      viewport.releasePointerCapture?.(event.pointerId);
      normalizeScroll();
      scheduleAutoplay();
    });
  });

  viewport.addEventListener(
    "scroll",
    () => {
      normalizeScroll();
    },
    { passive: true }
  );

  section.addEventListener("mouseenter", stopAutoplay);
  section.addEventListener("mouseleave", scheduleAutoplay);
  section.addEventListener("focusin", stopAutoplay);
  section.addEventListener("focusout", scheduleAutoplay);
  window.addEventListener("resize", () => {
    normalizeScroll();
    scheduleAutoplay();
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
  if (document.querySelector(".mobile-sticky-actions")) {
    return;
  }

  const existing = document.querySelector(".floating-call, .floating-call-button");
  if (existing) {
    existing.classList.add("floating-call-button");
    existing.setAttribute("dir", isArabicPage ? "rtl" : "ltr");
    if (!existing.querySelector(".floating-call-button__icon")) {
      existing.insertAdjacentHTML("afterbegin", '<span class="floating-call-button__icon" aria-hidden="true">☎</span>');
    }
    initFloatingCallVisibility(existing);
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
  initFloatingCallVisibility(link);
};

const initFloatingCallVisibility = (button) => {
  const hero = document.querySelector(".home-hero");
  if (!button || !hero) return;

  button.classList.add("is-hidden");

  if (!("IntersectionObserver" in window)) {
    const update = () => {
      button.classList.toggle("is-hidden", hero.getBoundingClientRect().bottom > 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      button.classList.toggle("is-hidden", entry.isIntersecting);
    },
    { rootMargin: "0px 0px -65% 0px", threshold: 0 }
  );

  observer.observe(hero);
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
initGalleryAutoplay();
cleanGoogleReviewTimes();
ensureFloatingCallButton();
initGoogleReviewMarquees();
if ("IntersectionObserver" in window && newCabinetsCarousels.length) {
  const carouselObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        NewMedicalCabinetsCarousel(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "220px 0px" }
  );
  newCabinetsCarousels.forEach((carousel) => carouselObserver.observe(carousel));
} else {
  newCabinetsCarousels.forEach(NewMedicalCabinetsCarousel);
}
specialtyProfessionalSlots.forEach(renderSpecialtyProfessionalSlots);
sortHospitalFacilityCards();
enhanceEstablishmentCards();
initDirectorySearch();
window.addEventListener("scroll", updateMediaScale, { passive: true });
window.addEventListener("resize", updateMediaScale);
