const i18n = {
    fr: {
        nav: {
            about: "À propos",
            projects: "Projets & impacts",
            experience: "Expériences",
            skills: "Compétences",
            education: "Formation",
            contact: "Contact"
        },
        hero: {
            kicker: "Digital Transformation • IA appliquée • Performance industrielle",
            main: "Je conçois des solutions data & IA qui améliorent ",
            grad: "la performance opérationnelle",
            main2: "et la prise de décision",
            subtitle: "Consultant en transformation digitale & solutions IA. KPI temps réel, automatisation, IA appliquée."
        },
        buttons: {
            viewProjects: "Voir mes projets",
            contactMe: "Me contacter",
            copyEmail: "Copier email",
            realTimeKPI: "KPI temps réel / SIC"
        },
        metrix:{
            L1: "Objectifs de production atteints plus souvent (vs 2023)",
            L2: "Deals en + via automatisation d’appels d’offres",
            L3: "Amélioration demand–supply / réduction stockouts",
            L4: "Cas concrets",
            L5: "Positionnement : ",
            L6: "data + industrial ops + IA pragmatique. Je pars du besoin terrain, je sécurise la donnée, puis je livre un outil adopté"
        },
        about: {
            head: "À propos",
            job: "Consultant en transformation digitale & solutions IA",
            text: "Consultant en transformation digitale & solutions IA : je conçois et déploie des outils pour améliorer la performance industrielle, la qualité de la donnée et la prise de décision"
        }
    },

    en: {
        nav: {
            about: "About",
            projects: "Projects & impact",
            experience: "Experience",
            skills: "Skills",
            education: "Education",
            contact: "Contact"
        },
        hero: {
            kicker: "Digital Transformation • Applied AI • Industrial Performance",
            main: "I design data & AI solutions that improve ",
            grad: "operational performance",
            main2: "and decision-making",
            subtitle: "Digital Transformation & AI Solutions Consultant. Real-time KPIs, automation, applied AI."
        },
        buttons: {
            viewProjects: "View projects",
            contactMe: "Contact me",
            copyEmail: "Copy email",
            realTimeKPI: "Real Time KPI / SIC"
        },
        metrix:{
            L1: "Production targets achieved more often (vs. 2023)",
            L2: "More deals through automated tendering",
            L3: "Improvement in demand–supply / reduction in stockouts",
            L4: "Case studies",
            L5: "Positioning: ",
            L6: "data + industrial ops + pragmatic AI. I start with the needs on the ground, secure the data, then deliver a tool that is adopted"
        },
        about: {
            head: "About me",
            job: "Digital Transformation & AI Solutions Consultant",
            text: "Digital transformation & AI solutions consultant: I design and deploy tools to improve industrial performance, data quality, and decision-making"
        }
    }
};

function setLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        const value = key.split(".").reduce((obj, k) => obj?.[k], i18n[lang]);

        if (value) {
            el.innerHTML = value;
        }
    });

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    localStorage.setItem("lang", lang);
}

const savedLang = localStorage.getItem("lang") || "fr";
setLanguage(savedLang);

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setLanguage(btn.dataset.lang);
    });
});