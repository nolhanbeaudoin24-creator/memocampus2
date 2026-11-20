
/* =========================================
   MÉMOCAMPUS — FILES
   Gestion des fichiers importés
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

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " octets";

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " Ko";
    }

    return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
}

function renderFiles() {
    const container = document.getElementById("files-list");

    if (!container) return;

    const files = getCollection("files");

    container.innerHTML = "";

    if (!files.length) {
        container.innerHTML = `
            <div class="item-card">
                <div>
                    <strong>Aucun document importé</strong>
                    <p>Tes documents apparaîtront ici.</p>
                </div>
            </div>
        `;
        return;
    }

    files.forEach(file => {
        const article = document.createElement("article");
        article.className = "item-card";

        const information = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = file.name;

        const details = document.createElement("p");
        details.textContent =
            `${file.type || "Type inconnu"} · ${formatSize(file.size || 0)}`;

        information.append(name, details);

        const actions = document.createElement("div");

        if (file.previewURL) {
            const link = document.createElement("a");
            link.href = file.previewURL;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = "Ouvrir";
            actions.appendChild(link);
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Supprimer";
        deleteButton.dataset.deleteFile = file.id;

        deleteButton.addEventListener("click", () => {
            if (!confirm("Retirer ce document de MémoCampus ?")) {
                return;
            }

            deleteItem("files", file.id);
            renderFiles();
            updateStatistics();
        });

        actions.appendChild(deleteButton);
        article.append(information, actions);
        container.appendChild(article);
    });
}

function updateStatistics() {
    document.dispatchEvent(
        new CustomEvent("memocampus:update")
    );
}

function initFiles() {
    const input = document.getElementById("file-input");
    const container = document.getElementById("files-list");

    if (!input || !container) return;

    input.addEventListener("change", event => {
        const selectedFiles = Array.from(
            event.target.files || []
        );

        for (const file of selectedFiles) {
            addItem("files", {
                name: file.name,
                type: file.type || "Type non identifié",
                size: file.size,
                importedAt: new Date().toISOString()
            });
        }

        input.value = "";
        renderFiles();
        updateStatistics();
    });

    renderFiles();
}

export {
    initFiles,
    renderFiles
};
