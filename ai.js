
/* =========================================
   MÉMOCAMPUS — AI
   Assistant intelligent
========================================= */

const promptInput = document.getElementById("ai-prompt");
const generateButton = document.getElementById("ai-generate");
const resultArea = document.getElementById("ai-result");

let isGenerating = false;

/* =========================================
   INITIALISATION
========================================= */

export function initAI() {
    if (!generateButton || !promptInput || !resultArea) {
        console.warn("MémoCampus IA : éléments HTML introuvables.");
        return;
    }

    generateButton.addEventListener("click", generateResponse);

    promptInput.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            generateResponse();
        }
    });
}

/* =========================================
   GÉNÉRATION DE LA RÉPONSE
========================================= */

async function generateResponse() {
    if (isGenerating) return;

    const prompt = promptInput.value.trim();

    if (!prompt) {
        resultArea.textContent = "Écris une question pour commencer.";
        promptInput.focus();
        return;
    }

    isGenerating = true;

    generateButton.disabled = true;
    generateButton.textContent = "Réflexion en cours...";

    resultArea.textContent =
        "MémoCampus IA prépare une réponse...";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error(
                "Le serveur n'a pas renvoyé une réponse JSON."
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Le serveur a rencontré une erreur."
            );
        }

        resultArea.textContent =
            data.answer || "Aucune réponse reçue.";

    } catch (error) {
        console.error("Erreur MémoCampus IA :", error);

        resultArea.textContent =
            "Impossible de contacter MémoCampus IA pour le moment. Vérifie que le serveur et sa configuration sont opérationnels.";

    } finally {
        isGenerating = false;

        generateButton.disabled = false;
        generateButton.textContent = "Générer une réponse";
    }
}
