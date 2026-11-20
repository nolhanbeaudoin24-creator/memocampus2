
/* =========================================
   MÉMOCAMPUS — STORAGE
   Gestion des données et sauvegardes
========================================= */

const STORAGE_KEY = "memocampus_data_v1";

const defaultData = {
    courses: [],
    files: [],
    websites: [],
    notes: [],
    quizzes: [],
    mindmaps: [],
    history: [],
    settings: {
        version: 1
    }
};

function cloneDefaultData() {
    return JSON.parse(JSON.stringify(defaultData));
}

/* =========================================
   CHARGEMENT DES DONNÉES
========================================= */

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return cloneDefaultData();
        }

        const parsed = JSON.parse(saved);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return cloneDefaultData();
        }

        const data = {
            ...cloneDefaultData(),
            ...parsed
        };

        for (const key of Object.keys(defaultData)) {
            if (key === "settings") continue;

            if (!Array.isArray(data[key])) {
                data[key] = [];
            }
        }

        data.settings = {
            ...defaultData.settings,
            ...(data.settings || {})
        };

        return data;

    } catch (error) {
        console.error("Erreur de lecture des données :", error);
        return cloneDefaultData();
    }
}

let appData = loadData();

/* =========================================
   SAUVEGARDE
========================================= */

function saveData() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(appData)
        );

        return true;

    } catch (error) {
        console.error("Erreur de sauvegarde :", error);

        alert(
            "La sauvegarde a échoué. L'espace de stockage est peut-être insuffisant."
        );

        return false;
    }
}

/* =========================================
   RÉCUPÉRATION DES DONNÉES
========================================= */

function getData() {
    return appData;
}

function getCollection(name) {
    if (!Array.isArray(appData[name])) {
        return [];
    }

    return appData[name];
}

/* =========================================
   AJOUT D'UN ÉLÉMENT
========================================= */

function addItem(collection, item) {
    if (!Array.isArray(appData[collection])) {
        console.error("Collection inconnue :", collection);
        return null;
    }

    const newItem = {
        ...item,
        id: item?.id || (
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`
        ),
        createdAt: item?.createdAt || new Date().toISOString()
    };

    appData[collection].push(newItem);

    if (!saveData()) {
        appData[collection].pop();
        return null;
    }

    return newItem;
}

/* =========================================
   SUPPRESSION D'UN ÉLÉMENT
========================================= */

function deleteItem(collection, id) {
    if (!Array.isArray(appData[collection])) {
        return false;
    }

    const index = appData[collection].findIndex(
        item => item.id === id
    );

    if (index === -1) {
        return false;
    }

    const removed = appData[collection].splice(index, 1)[0];

    if (!saveData()) {
        appData[collection].splice(index, 0, removed);
        return false;
    }

    return true;
}

/* =========================================
   MODIFICATION D'UN ÉLÉMENT
========================================= */

function updateItem(collection, id, changes) {
    if (!Array.isArray(appData[collection])) {
        return false;
    }

    const item = appData[collection].find(
        entry => entry.id === id
    );

    if (!item) {
        return false;
    }

    const previous = { ...item };

    Object.assign(item, changes);

    if (!saveData()) {
        Object.assign(item, previous);
        return false;
    }

    return true;
}

/* =========================================
   HISTORIQUE
========================================= */

function addHistory(action, details = "") {
    const result = addItem("history", {
        action,
        details,
        date: new Date().toISOString()
    });

    if (!result) return false;

    if (appData.history.length > 100) {
        appData.history = appData.history.slice(-100);
        saveData();
    }

    return true;
}

/* =========================================
   EXPORTATION
========================================= */

function exportData() {
    return JSON.parse(JSON.stringify(appData));
}

/* =========================================
   IMPORTATION
========================================= */

function importData(imported) {
    if (
        !imported ||
        typeof imported !== "object" ||
        Array.isArray(imported)
    ) {
        return false;
    }

    const newData = cloneDefaultData();

    for (const key of Object.keys(defaultData)) {
        if (key === "settings") continue;

        if (imported[key] !== undefined) {
            if (!Array.isArray(imported[key])) {
                alert("Cette sauvegarde contient des données invalides.");
                return false;
            }

            newData[key] = imported[key];
        }
    }

    if (
        imported.settings !== undefined &&
        (
            !imported.settings ||
            typeof imported.settings !== "object" ||
            Array.isArray(imported.settings)
        )
    ) {
        alert("Les paramètres de cette sauvegarde sont invalides.");
        return false;
    }

    newData.settings = {
        ...defaultData.settings,
        ...(imported.settings || {})
    };

    const previous = appData;

    appData = newData;

    if (!saveData()) {
        appData = previous;
        return false;
    }

    return true;
}

/* =========================================
   EXPORTS
========================================= */

export {
    getData,
    getCollection,
    addItem,
    deleteItem,
    updateItem,
    addHistory,
    saveData,
    exportData,
    importData
};
