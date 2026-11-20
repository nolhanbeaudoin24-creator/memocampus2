
import {
    getCollection,
    addItem,
    deleteItem
} from "./storage.js";

const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");

export function initNotes() {
    if (!notesList || !noteForm) return;

    noteForm.addEventListener("submit", createNote);

    renderNotes();
}

function createNote(event) {
    event.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) {
        alert("Merci de remplir le titre et le contenu.");
        return;
    }

    addItem("notes", {
        title,
        content,
        createdAt: new Date().toISOString()
    });

    noteForm.reset();
    renderNotes();
}

function renderNotes() {
    const notes = getCollection("notes");

    notesList.innerHTML = "";

    if (notes.length === 0) {
        notesList.innerHTML = `
            <p class="empty-message">
                Aucune fiche de révision pour le moment.
            </p>
        `;
        return;
    }

    notes.forEach(note => {
        const article = document.createElement("article");
        article.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        const date = document.createElement("small");
        date.textContent = new Date(
            note.createdAt
        ).toLocaleDateString("fr-FR");

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Supprimer";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            if (confirm("Supprimer cette fiche ?")) {
                deleteItem("notes", note.id);
                renderNotes();
            }
        });

        article.append(title, content, date, deleteButton);
        notesList.appendChild(article);
    });
}
