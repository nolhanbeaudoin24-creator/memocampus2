
/* =========================================
   MÉMOCAMPUS — COURSES
   Gestion des matières
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

function renderCourses() {
    const container = document.getElementById("courses-list");

    if (!container) return;

    const courses = getCollection("courses");

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="item-card">
                <div>
                    <strong>Aucun cours pour le moment</strong>
                    <p>Ajoute ta première matière pour commencer.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(course => `
        <article class="item-card">
            <div>
                <strong>${escapeHTML(course.name)}</strong>
                <p>
                    Créé le ${
                        new Date(course.createdAt).toLocaleDateString("fr-FR")
                    }
                </p>
            </div>

            <button
                type="button"
                data-delete-course="${escapeHTML(course.id)}"
                aria-label="Supprimer ce cours">
                Supprimer
            </button>
        </article>
    `).join("");
}

function initCourses() {
    const form = document.getElementById("course-form");
    const input = document.getElementById("course-name");
    const container = document.getElementById("courses-list");

    if (!form || !input || !container) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = input.value.trim();

        if (!name) return;

        const course = addItem("courses", { name });

        if (!course) return;

        input.value = "";

        renderCourses();

        document.dispatchEvent(
            new CustomEvent("memocampus:update")
        );
    });

    container.addEventListener("click", event => {
        const button = event.target.closest("[data-delete-course]");

        if (!button) return;

        const id = button.dataset.deleteCourse;

        if (!confirm("Supprimer ce cours ?")) return;

        if (deleteItem("courses", id)) {
            renderCourses();

            document.dispatchEvent(
                new CustomEvent("memocampus:update")
            );
        }
    });

    renderCourses();
}

export {
    initCourses,
    renderCourses
};
