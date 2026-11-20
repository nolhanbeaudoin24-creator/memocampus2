
/* =========================================
   MÉMOCAMPUS — PROGRESS
   Statistiques et suivi de progression
========================================= */

import { getCollection } from "./storage.js";

export function initProgress() {
    updateProgress();

    document.addEventListener(
        "memocampus:update",
        updateProgress
    );
}

export function updateProgress() {
    const courses = getCollection("courses");
    const files = getCollection("files");
    const websites = getCollection("websites");
    const notes = getCollection("notes");
    const quizzes = getCollection("quizzes");
    const mindmaps = getCollection("mindmaps");

    const total =
        courses.length +
        files.length +
        websites.length +
        notes.length +
        quizzes.length +
        mindmaps.length;

    updateNumber("stat-courses", courses.length);
    updateNumber("stat-files", files.length);
    updateNumber("stat-websites", websites.length);
    updateNumber("stat-notes", notes.length);
    updateNumber("stat-quizzes", quizzes.length);
    updateNumber("stat-mindmaps", mindmaps.length);
    updateNumber("stat-total", total);

    renderProgress({
        courses: courses.length,
        files: files.length,
        websites: websites.length,
        notes: notes.length,
        quizzes: quizzes.length,
        mindmaps: mindmaps.length,
        total
    });
}

function updateNumber(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function renderProgress(stats) {
    const container = document.getElementById("progress-content");

    if (!container) return;

    const categories = [
        ["Cours", stats.courses],
        ["Fichiers", stats.files],
        ["Sites web", stats.websites],
        ["Fiches de révision", stats.notes],
        ["Quiz", stats.quizzes],
        ["Cartes mentales", stats.mindmaps]
    ];

    container.innerHTML = `
        <div class="progress-summary">
            <h3>Mon activité sur MémoCampus</h3>

            <p>
                Tu as actuellement
                <strong>${stats.total}</strong>
                élément(s) enregistré(s).
            </p>
        </div>

        <div class="progress-details">
            ${categories.map(([name, value]) => `
                <div class="progress-item">
                    <span>${name}</span>
                    <strong>${value}</strong>
                </div>
            `).join("")}
        </div>
    `;
}
