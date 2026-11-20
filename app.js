
/* =========================================
   MÉMOCAMPUS — APP
   Initialisation et navigation générale
========================================= */

import { initCourses } from "./courses.js";
import { initFiles } from "./files.js";
import { initWebsites } from "./websites.js";
import { initNotes } from "./notes.js";
import { initQuiz } from "./quiz.js";
import { initMindmap } from "./mindmap.js";
import { initProgress } from "./progress.js";
import { initAI } from "./ai.js";

import {
    exportData,
    importData
} from "./storage.js";

/* =========================================
   TITRES DES PAGES
========================================= */

const pageTitles = {
    dashboard: "Accueil",
    courses: "Mes cours",
    files: "Mes fichiers",
    websites: "Sites web",
    notes: "Fiches de révision",
    quiz: "Quiz",
    mindmap: "Cartes mentales",
    progress: "Progression",
    ai: "Intelligence artificielle",
    settings: "Paramètres"
};

/* =========================================
   NAVIGATION
========================================= */

function showPage(pageName) {
    const pages = document.querySelectorAll(".page");
    const navigationLinks = document.querySelectorAll("[data-page]");

    const targetPage = document.getElementById(`page-${pageName}`);

    if (!targetPage) {
        console.warn("Page introuvable :", pageName);
        return;
    }

    pages.forEach(page => {
        page.classList.toggle(
            "active",
            page.id === `page-${pageName}`
        );
    });

    navigationLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === pageName
        );
    });

    const title = document.getElementById("page-title");

    if (title) {
        title.textContent = pageTitles[pageName] || "MémoCampus";
    }

    closeMobileMenu();
}

/* =========================================
   MENU MOBILE
========================================= */

function initMobileMenu() {
    const menuButton = document.getElementById("menu-button");
    const sidebar = document.querySelector(".sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });
}

function closeMobileMenu() {
    const sidebar = document.querySelector(".sidebar");
    const menuButton = document.getElementById("menu-button");

    sidebar?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
}

/* =========================================
   INITIALISATION DE LA NAVIGATION
========================================= */

function initNavigation() {
    document.querySelectorAll("[data-page]").forEach(link => {
        link.addEventListener("click", () => {
            showPage(link.dataset.page);
        });
    });

    document.querySelectorAll("[data-go]").forEach(button => {
        button.addEventListener("click", () => {
            showPage(button.dataset.go);
        });
    });

    showPage("dashboard");
    initMobileMenu();
}

/* =========================================
   EXPORTATION DES DONNÉES
========================================= */

function initBackup() {
    const exportButton = document.getElementById("export-data");
    const importButton = document.getElementById("import-data");
    const backupInput = document.getElementById("backup-input");

    exportButton?.addEventListener("click", () => {
        try {
            const backup = exportData();

            const blob = new Blob(
                [JSON.stringify(backup, null, 2)],
                { type: "application/json" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "memocampus-sauvegarde.json";

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 1000);

        } catch (error) {
            console.error("Erreur d'exportation :", error);
            alert("Impossible d'exporter les données.");
        }
    });

    /* =====================================
       IMPORTATION DES DONNÉES
    ===================================== */

    importButton?.addEventListener("click", () => {
        backupInput?.click();
    });

    backupInput?.addEventListener("change", async () => {
        const file = backupInput.files?.[0];

        if (!file) return;

        try {
            const content = await file.text();
            const data = JSON.parse(content);

            if (!confirm(
                "Remplacer les données actuelles par cette sauvegarde ?"
            )) {
                return;
            }

            const success = importData(data);

            if (!success) {
                alert("L'importation a échoué.");
                return;
            }

            alert("Sauvegarde importée avec succès.");

            window.location.reload();

        } catch (error) {
            console.error("Erreur d'importation :", error);

            alert(
                "Impossible de lire cette sauvegarde. Vérifie le fichier sélectionné."
            );

        } finally {
            backupInput.value = "";
        }
    });
}

/* =========================================
   INITIALISATION GÉNÉRALE
========================================= */

function initApp() {
    initNavigation();

    initCourses();
    initFiles();
    initWebsites();
    initNotes();
    initQuiz();
    initMindmap();
    initProgress();
    initAI();

    initBackup();

    console.log("MémoCampus : application initialisée.");
}

/* =========================================
   DÉMARRAGE
========================================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
