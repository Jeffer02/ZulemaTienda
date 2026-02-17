import { database, ref, onValue } from "./firebase-config.js";

const productContainer = document.getElementById("productContainer");
const filterButtons = document.querySelectorAll(".chip");

let allGames = [];
let currentFilter = "todos";

function renderGames(list) {
    if (!list || list.length === 0) {
        productContainer.innerHTML = '<p style="color:#8791af;">No hay juegos disponibles</p>';
        return;
    }

    productContainer.innerHTML = list.map(game => `
        <article class="card" data-console="${game.console}">
            <img src="${game.image}" alt="${game.name}" class="card-image">
            <span class="tag-console">${game.console}</span>
            <h3 class="card-title">${game.name}</h3>
            <p class="card-genre">${game.genre}</p>
            <p class="card-desc">${game.description}</p>
            <div class="card-bottom">
                <span class="price">S/ ${Number(game.price).toFixed(2)}</span>
                <a class="btn primary" href="https://wa.me/51999291695?text=Hola,%20quiero%20comprar%20${encodeURIComponent(game.name)}%20-%20${game.console}" target="_blank">
                    WhatsApp
                </a>
            </div>
        </article>
    `).join("");
}

function applyFilter() {
    if (currentFilter === "todos") {
        renderGames(allGames);
    } else {
        const filtered = allGames.filter(g => g.console === currentFilter);
        renderGames(filtered);
    }
}

function loadGames() {
    const gamesRef = ref(database, "games");
    onValue(
        gamesRef,
        snapshot => {
            const data = snapshot.val();
            allGames = [];
            if (data) {
                Object.keys(data).forEach(id => {
                    allGames.push({ id, ...data[id] });
                });
            }
            applyFilter();
        },
        error => {
            productContainer.innerHTML = `<p style="color:#ff4d6a;">Error al cargar juegos: ${error.message}</p>`;
        }
    );
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("chip-active"));
        btn.classList.add("chip-active");
        currentFilter = btn.getAttribute("data-filter");
        applyFilter();
    });
});

document.addEventListener("DOMContentLoaded", loadGames);
