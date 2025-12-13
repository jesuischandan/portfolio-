const EMAIL = "chandan.kumar@skema.edu";
const PHONE = "+33751112483";

const projects = [
  {
    id: "aperam-kpi-sic",
    title: "KPI temps réel & Short Interval Control (SIC)",
    company: "Aperam",
    period: "2024 — présent",
    tags: ["Industrie", "KPI", "Python", "SQL", "Dashboards"],
    headline: "Monitoring machine/secteur/usine + workflow SIC toutes les 2h, scale à 27 machines.",
    impact: [
      "Objectifs de production atteints +20% vs 2023."
    ],
    stack: ["Python", "SQL", "Pandas", "Schedulers", "GCP Sheets sync", "Power BI (dashboarding)"],
    details: [
      "Conception d’un écosystème KPI temps réel pour suivi continu des lignes de production.",
      "Workflow SIC : passage toutes les 2h, actions correctives, suivi par shift.",
      "Dashboard central consolidant KPIs machine, secteur, usine."
    ]
  },
  {
    id: "aperam-rag-diagnostic",
    title: "IA diagnostic (RAG) pour pannes & recommandations",
    company: "Aperam",
    period: "2024 — présent",
    tags: ["IA", "RAG", "FastAPI", "Vector DB", "Industrie"],
    headline: "Ticketing opérateur→ingénieur + base de connaissances + recherche sémantique pour proposer des solutions.",
    impact: [
      "Structuration des logs pannes/causes/solutions pour capitaliser la connaissance.",
      "Suggestions de causes & solutions sur incidents nouveaux via similarité sémantique."
    ],
    stack: ["Chroma (vector DB)", "Embeddings", "Semantic search", "Gemini API", "FastAPI"],
    details: [
      "Système de déclaration de panne : génération de tickets + assignation ingénieur.",
      "Bibliothèque configurable de causes par machine, extensible par opérateurs/ingénieurs.",
      "Assistant RAG : retrieval sur historiques + recommandation pour incidents proches."
    ]
  },
  {
    id: "cmacgm-allinone",
    title: "Dashboard Power BI “ALL IN ONE”",
    company: "CMA CGM",
    period: "2024",
    tags: ["Power BI", "DAX", "SQL", "Commercial"],
    headline: "Modèle de données fiable multi-sources + KPIs actionnables (volumes, performance, tendances).",
    impact: [
      "Insights : volumes bookings par port/semaine, top/flop clients, disponibilité conteneurs, tendances compétiteurs."
    ],
    stack: ["Power BI", "DAX", "SQL", "Excel (SharePoint)", "Data modeling", "Data cleaning"],
    details: [
      "Définition des besoins & KPIs avec Data/Commercial/Trade/Area Managers.",
      "Connexion à fichiers Excel + tables SQL, harmonisation des sources.",
      "Rédaction guide utilisateur + formation interne + présentation management."
    ]
  },
  {
    id: "cmacgm-tender-automation",
    title: "Automatisation Tender Matrix (Streamlit + IA interne)",
    company: "CMA CGM",
    period: "2024",
    tags: ["Python", "Streamlit", "Automatisation", "IA"],
    headline: "Extraction data contrat, détection routes, reconstruction pricing/marge, reco taux en négo.",
    impact: [
      "POC approuvé & déployé : +40% deals closés par les Area Managers."
    ],
    stack: ["Python", "Streamlit", "APIs", "LLM interne (MAYA)", "Data extraction"],
    details: [
      "Analyse du processus manuel et automatisation des étapes clés.",
      "Recommandations en temps réel pour soutenir les négociations.",
      "Focus adoption : simplicité d’usage & vitesse."
    ]
  },
  {
    id: "sony-inventory",
    title: "Optimisation supply chain : visibilité inventaire temps réel",
    company: "Sony India",
    period: "2017 — 2019",
    tags: ["Supply Chain", "SQL", "Analytics"],
    headline: "Tracking inventaire + pipeline de reconciliation billing → visibilité SKU.",
    impact: [
      "+30% demand–supply accuracy (réduction stockouts)."
    ],
    stack: ["SQL", "Google Sheets", "Barcode scanners", "Reporting templates"],
    details: [
      "Diagnostic terrain avec équipes (stores, supply chain, sales).",
      "Déploiement solution scalable et standardisation du reporting.",
      "Amélioration capacités long-terme pour décisions analytics-driven."
    ]
  }
];

const tagUniverse = (() => {
  const all = new Set();
  projects.forEach(p => p.tags.forEach(t => all.add(t)));
  return ["Tous", ...Array.from(all).sort((a,b)=>a.localeCompare(b, "fr"))];
})();

const state = {
  q: "",
  tag: "Tous"
};

// DOM
const grid = document.getElementById("projectGrid");
const tagFilters = document.getElementById("tagFilters");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const toast = document.getElementById("toast");

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function renderTags(){
  tagFilters.innerHTML = "";
  tagUniverse.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "tagBtn";
    btn.type = "button";
    btn.textContent = tag;
    btn.setAttribute("aria-pressed", String(tag === state.tag));
    btn.addEventListener("click", () => {
      state.tag = tag;
      renderTags();
      renderProjects();
    });
    tagFilters.appendChild(btn);
  });
}

function matches(p){
  const q = state.q.trim().toLowerCase();
  const inTag = (state.tag === "Tous") || p.tags.includes(state.tag);
  if(!q) return inTag;

  const blob = [
    p.title, p.company, p.period,
    p.headline,
    ...(p.tags || []),
    ...(p.stack || []),
    ...(p.details || []),
    ...(p.impact || [])
  ].join(" ").toLowerCase();

  return inTag && blob.includes(q);
}

function renderProjects(){
  const filtered = projects.filter(matches);

  grid.innerHTML = "";
  if(filtered.length === 0){
    grid.innerHTML = `<div class="card" style="grid-column:1/-1">
      <h3 style="margin:0 0 6px">Aucun résultat</h3>
      <p class="muted" style="margin:0">Essaie un autre mot-clé ou remets le filtre sur “Tous”.</p>
    </div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "card project";
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.setAttribute("aria-label", `Ouvrir le projet ${p.title}`);
    card.innerHTML = `
      <h3 class="project__title">${escapeHtml(p.title)}</h3>
      <p class="project__meta"><strong>${escapeHtml(p.company)}</strong> • ${escapeHtml(p.period)}</p>
      <p class="project__meta">${escapeHtml(p.headline)}</p>
      <div class="pillRow">
        ${p.tags.slice(0,4).map(t => `<span class="pillSmall">${escapeHtml(t)}</span>`).join("")}
        ${p.tags.length > 4 ? `<span class="pillSmall">+${p.tags.length-4}</span>` : ``}
      </div>
    `;

    const open = () => openModal(p.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        open();
      }
    });

    grid.appendChild(card);
  });
}

function openModal(projectId){
  const p = projects.find(x => x.id === projectId);
  if(!p) return;

  modalContent.innerHTML = `
    <div class="card" style="box-shadow:none; border:none; padding:6px">
      <p class="kicker" style="margin:0 0 10px; display:inline-block">${escapeHtml(p.company)} • ${escapeHtml(p.period)}</p>
      <h2 style="margin:0 0 10px; font-size:26px; letter-spacing:-.03em">${escapeHtml(p.title)}</h2>
      <p class="muted" style="margin:0 0 12px; line-height:1.6">${escapeHtml(p.headline)}</p>

      <div class="divider"></div>

      <h3 style="margin:0 0 8px">Impact</h3>
      <ul class="list" style="margin-top:0">
        ${(p.impact || []).map(i => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>

      <h3 style="margin:14px 0 8px">Démarche / livrables</h3>
      <ul class="list" style="margin-top:0">
        ${(p.details || []).map(d => `<li>${escapeHtml(d)}</li>`).join("")}
      </ul>

      <h3 style="margin:14px 0 8px">Stack</h3>
      <div class="pillRow" style="margin-top:0">
        ${(p.stack || []).map(s => `<span class="pillSmall">${escapeHtml(s)}</span>`).join("")}
      </div>

      <div class="divider"></div>
      <div style="display:flex; gap:10px; flex-wrap:wrap">
        <a class="btn btn--primary" href="#contact" onclick="window.__closeModal()">Me contacter</a>
        <button class="btn btn--ghost" type="button" onclick="navigator.clipboard.writeText('${escapeHtml(p.title)} — ${escapeHtml(p.company)}'); (${Date.now()}) && 0">Copier le titre</button>
      </div>
    </div>
  `;

  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal(){
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
window.__closeModal = closeModal;

// Modal events
modal.addEventListener("click", (e) => {
  const t = e.target;
  if(t && t.dataset && t.dataset.close === "true") closeModal();
});
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

// Search
searchInput.addEventListener("input", (e) => {
  state.q = e.target.value || "";
  renderProjects();
});

// Copy actions
document.getElementById("copyEmailBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(EMAIL);
  showToast("Email copié ✓");
});
document.getElementById("copyPhoneBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(PHONE);
  showToast("Téléphone copié ✓");
});

// Quick form -> mailto
document.getElementById("quickForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = (document.getElementById("name").value || "").trim();
  const msg = (document.getElementById("msg").value || "").trim();

  const subject = encodeURIComponent(`Opportunity — Portfolio (Chandan Kumar)`);
  const body = encodeURIComponent(
`Bonjour Chandan,

Je suis ${name || "[Votre nom]"}.

${msg || "[Votre message]"}

Cordialement,`
  );

  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

// Burger menu
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
});

// Close nav on click (mobile)
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

// Scroll progress
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
  scrollProgress.style.width = `${p}%`;
});

// Animated counters when visible
function animateCounter(el, target){
  const start = 0;
  const duration = 900;
  const t0 = performance.now();

  function tick(now){
    const k = Math.min(1, (now - t0) / duration);
    const val = Math.round(start + (target - start) * (1 - Math.pow(1-k, 3)));
    el.textContent = String(val);
    if(k < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterEls = [...document.querySelectorAll("[data-counter]")];
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = Number(el.getAttribute("data-counter") || "0");
      animateCounter(el, target);
      io.unobserve(el);
    }
  });
}, { threshold: 0.35 });

counterEls.forEach(el => io.observe(el));

// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());

// Init
renderTags();
renderProjects();