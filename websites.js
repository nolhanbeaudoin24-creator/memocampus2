
/* =========================================
   MÉMOCAMPUS — WEBSITES
   Gestion des sites web
========================================= */

import {
    getCollection,
    addItem,
    deleteItem
} from "./storage.js";

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function renderWebsites() {
    const container = document.getElementById("websites-list");

    if (!container) return;

    const websites = getCollection("websites");

    if (!websites.length) {
        container.innerHTML = `
            <div class="item-card">
                <div>
                    <strong>Aucun site enregistré</strong>
                    <p>Ajoute tes premières ressources Internet.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = websites.map(site => `
        <article class="item-card">
            <div>
                <strong>${escapeHTML(site.title)}</strong>
                <p>
                    <a href="${escapeHTML(site.url)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${escapeHTML(site.url)}
                    </a>
                </p>
            </div>

            <button
                type="button"
                data-delete-website="${escapeHTML(site.id)}">
                Supprimer
            </button>
        </article>
    `).join("");
}

function updateStatistics() {
    document.dispatchEvent(
        new CustomEvent("memocampus:update")
    );
}

function initWebsites() {
    const form = document.getElementById("website-form");
    const titleInput = document.getElementById("website-title");
    const urlInput = document.getElementById("website-url");
    const container = document.getElementById("websites-list");

    if (!form || !titleInput || !urlInput || !container) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const url = urlInput.value.trim();

        if (!title || !url) return;

        let parsedURL;

        try {
            parsedURL = new URL(url);

            if (!["http:", "https:"].includes(parsedURL.protocol)) {
                throw new Error("Protocole non autorisé");
            }
        } catch {
            alert("Merci de saisir une adresse web valide.");
            return;
        }

        const result = addItem("websites", {
            title,
            url: parsedURL.href,
            createdAt: new Date().toISOString()
        });

        if (!result) return;

        form.reset();
        renderWebsites();
        updateStatistics();
    });

    container.addEventListener("click", event => {
        const button = event.target.closest("[data-delete-website]");

        if (!button) return;

        if (!confirm("Supprimer ce site web ?")) return;

        deleteItem("websites", button.dataset.deleteWebsite);

        renderWebsites();
        updateStatistics();
    });

    renderWebsites();
}

export {
    initWebsites,
    renderWebsites
};
