
import {
    getCollection,
    addItem,
    deleteItem
} from "./storage.js";

const quizList = document.getElementById("quiz-list");

export function initQuiz() {
    if (!quizList) return;

    renderQuizzes();
}

export function createQuiz(data) {
    if (
        !data?.title?.trim() ||
        !data?.question?.trim() ||
        !Array.isArray(data.answers) ||
        data.answers.length < 2 ||
        !Number.isInteger(data.correctAnswer) ||
        data.correctAnswer < 0 ||
        data.correctAnswer >= data.answers.length
    ) {
        return false;
    }

    const answers = data.answers.map(answer =>
        String(answer).trim()
    );

    if (answers.some(answer => !answer)) {
        return false;
    }

    addItem("quizzes", {
        title: data.title.trim(),
        question: data.question.trim(),
        answers,
        correctAnswer: data.correctAnswer,
        createdAt: new Date().toISOString()
    });

    renderQuizzes();
    return true;
}

function renderQuizzes() {
    const quizzes = getCollection("quizzes");

    quizList.innerHTML = "";

    if (quizzes.length === 0) {
        quizList.innerHTML = `
            <p class="empty-message">
                Aucun quiz disponible pour le moment.
                Tu pourras bientôt en créer avec MémoCampus IA.
            </p>
        `;
        return;
    }

    quizzes.forEach(quiz => {
        if (
            !Array.isArray(quiz.answers) ||
            !quiz.answers.length
        ) return;

        const card = document.createElement("article");
        card.className = "quiz-card";

        const title = document.createElement("h3");
        title.textContent = quiz.title;

        const question = document.createElement("p");
        question.textContent = quiz.question;

        const answers = document.createElement("div");
        answers.className = "quiz-answers";

        const result = document.createElement("p");
        result.className = "quiz-result";
        result.setAttribute("aria-live", "polite");

        quiz.answers.forEach((answer, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = answer;

            button.addEventListener("click", () => {
                if (answers.dataset.answered === "true") return;

                answers.dataset.answered = "true";

                if (index === quiz.correctAnswer) {
                    result.textContent = "Bonne réponse !";
                    result.className = "quiz-result success";
                } else {
                    result.textContent = "Ce n'est pas la bonne réponse.";
                    result.className = "quiz-result error";
                }

                answers.querySelectorAll("button").forEach(item => {
                    item.disabled = true;
                });
            });

            answers.appendChild(button);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Supprimer le quiz";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            if (confirm("Supprimer ce quiz ?")) {
                deleteItem("quizzes", quiz.id);
                renderQuizzes();
            }
        });

        card.append(title, question, answers, result, deleteButton);
        quizList.appendChild(card);
    });
}
