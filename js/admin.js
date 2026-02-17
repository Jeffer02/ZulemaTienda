import { database, ref, onValue, push, set, remove, update } from "./firebase-config.js";

const adminTableBody = document.getElementById("adminTableBody");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const addModal = document.getElementById("addModal");
const editModal = document.getElementById("editModal");
const saveGameBtn = document.getElementById("saveGameBtn");
const updateGameBtn = document.getElementById("updateGameBtn");
const addErrorMsg = document.getElementById("addErrorMsg");
const editErrorMsg = document.getElementById("editErrorMsg");

function openModal(modal) {
    if (modal) modal.classList.add("open");
}

function closeModal(modal) {
    if (modal) modal.classList.remove("open");
}

document.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", () => {
        const id = el.getAttribute("data-close");
        const modal = document.getElementById(id);
        closeModal(modal);
    });
});

window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal(addModal);
        closeModal(editModal);
    }
});

function validateGame(data) {
    const { name, console, price, genre, image, description } = data;
    if (!name || !console || !price || !genre || !image || !description) {
        return "Todos los campos son obligatorios";
    }
    if (Number(price) < 0) {
        return "El precio debe ser mayor o igual a 0";
    }
    return "";
}

function loadAdminGames() {
    const gamesRef = ref(database, "games");
    onValue(
        gamesRef,
        snapshot => {
            const data = snapshot.val();
            adminTableBody.innerHTML = "";
            if (!data) {
                adminTableBody.innerHTML = '<tr><td colspan="5" style="color:#8791af;">No hay juegos registrados</td></tr>';
                return;
            }
            Object.keys(data).forEach(id => {
                const game = data[id];
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><img src="${game.image}" class="thumb" alt="${game.name}"></td>
                    <td>${game.name}</td>
                    <td>${game.console}</td>
                    <td>S/ ${Number(game.price).toFixed(2)}</td>
                    <td>
                        <button class="btn ghost btn-small" data-edit="${id}">Editar</button>
                        <button class="btn primary btn-small" data-delete="${id}">Eliminar</button>
                    </td>
                `;
                adminTableBody.appendChild(tr);
            });
            attachRowEvents();
        },
        error => {
            adminTableBody.innerHTML = `<tr><td colspan="5" style="color:#ff4d6a;">Error: ${error.message}</td></tr>`;
        }
    );
}

function attachRowEvents() {
    document.querySelectorAll("[data-edit]").forEach(btn => {
        btn.onclick = () => openEdit(btn.getAttribute("data-edit"));
    });
    document.querySelectorAll("[data-delete]").forEach(btn => {
        btn.onclick = () => deleteGame(btn.getAttribute("data-delete"));
    });
}

openAddModalBtn.addEventListener("click", () => {
    const form = document.getElementById("addGameForm");
    if (form) form.reset();
    addErrorMsg.classList.add("hidden");
    openModal(addModal);
});

saveGameBtn.addEventListener("click", () => {
    const gameData = {
        name: document.getElementById("gameName").value.trim(),
        console: document.getElementById("gameConsole").value,
        price: document.getElementById("gamePrice").value,
        genre: document.getElementById("gameGenre").value.trim(),
        image: document.getElementById("gameImage").value.trim(),
        description: document.getElementById("gameDescription").value.trim(),
        createdAt: new Date().toISOString()
    };
    const error = validateGame(gameData);
    if (error) {
        addErrorMsg.textContent = error;
        addErrorMsg.classList.remove("hidden");
        return;
    }
    addErrorMsg.classList.add("hidden");
    const gamesRef = ref(database, "games");
    const newRef = push(gamesRef);
    set(newRef, gameData)
        .then(() => {
            const form = document.getElementById("addGameForm");
            if (form) form.reset();
            closeModal(addModal);
        })
        .catch(err => {
            addErrorMsg.textContent = "Error al guardar: " + err.message;
            addErrorMsg.classList.remove("hidden");
        });
});

function openEdit(id) {
    const gameRef = ref(database, "games/" + id);
    onValue(
        gameRef,
        snapshot => {
            const game = snapshot.val();
            if (!game) return;
            document.getElementById("editGameId").value = id;
            document.getElementById("editGameName").value = game.name;
            document.getElementById("editGameConsole").value = game.console;
            document.getElementById("editGamePrice").value = game.price;
            document.getElementById("editGameGenre").value = game.genre;
            document.getElementById("editGameImage").value = game.image;
            document.getElementById("editGameDescription").value = game.description;
            editErrorMsg.classList.add("hidden");
            openModal(editModal);
        },
        error => {
            editErrorMsg.textContent = "Error al cargar juego: " + error.message;
            editErrorMsg.classList.remove("hidden");
        },
        { onlyOnce: true }
    );
}

updateGameBtn.addEventListener("click", () => {
    const id = document.getElementById("editGameId").value;
    const updated = {
        name: document.getElementById("editGameName").value.trim(),
        console: document.getElementById("editGameConsole").value,
        price: document.getElementById("editGamePrice").value,
        genre: document.getElementById("editGameGenre").value.trim(),
        image: document.getElementById("editGameImage").value.trim(),
        description: document.getElementById("editGameDescription").value.trim(),
        updatedAt: new Date().toISOString()
    };
    const error = validateGame(updated);
    if (error) {
        editErrorMsg.textContent = error;
        editErrorMsg.classList.remove("hidden");
        return;
    }
    editErrorMsg.classList.add("hidden");
    const gameRef = ref(database, "games/" + id);
    update(gameRef, updated)
        .then(() => {
            closeModal(editModal);
        })
        .catch(err => {
            editErrorMsg.textContent = "Error al actualizar: " + err.message;
            editErrorMsg.classList.remove("hidden");
        });
});

function deleteGame(id) {
    if (!confirm("¿Eliminar este juego?")) return;
    const gameRef = ref(database, "games/" + id);
    remove(gameRef).catch(err => {
        alert("Error al eliminar: " + err.message);
    });
}

document.addEventListener("DOMContentLoaded", loadAdminGames);
