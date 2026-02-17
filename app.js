let games = JSON.parse(localStorage.getItem('games')) || [];

function displayGames(gamesToDisplay = games) {
    const container = document.getElementById('productosContainer');

    if (gamesToDisplay.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="lead">No hay juegos disponibles</p></div>';
        return;
    }

    container.innerHTML = gamesToDisplay.map(game => `
        <div class="col-md-4 col-lg-3">
            <div class="card product-card h-100">
                <span class="stock-badge ${game.stock === 0 ? 'out-of-stock' : ''}">${game.stock > 0 ? 'Disponible' : 'Agotado'}</span>
                <span class="badge bg-primary">${game.platform}</span>
                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text flex-grow-1">${game.description}</p>
                    <p class="price-tag mb-3">S/ ${game.price.toFixed(2)}</p>
                    <a href="https://wa.me/51999291695?text=Hola, estoy interesado en ${encodeURIComponent(game.name)} - ${game.platform}" 
                       class="btn btn-whatsapp w-100 ${game.stock === 0 ? 'disabled' : ''}" 
                       target="_blank"
                       ${game.stock === 0 ? 'onclick="return false;"' : ''}>
                        <i class="bi bi-whatsapp"></i> Consultar
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

document.getElementById('searchInput').addEventListener('input', filterGames);
document.getElementById('filterPlatform').addEventListener('change', filterGames);

function filterGames() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const platform = document.getElementById('filterPlatform').value;

    let filtered = games;

    if (searchTerm) {
        filtered = filtered.filter(game => 
            game.name.toLowerCase().includes(searchTerm) || 
            game.description.toLowerCase().includes(searchTerm)
        );
    }

    if (platform !== 'todos') {
        filtered = filtered.filter(game => game.platform === platform);
    }

    displayGames(filtered);
}

window.addEventListener('storage', function(e) {
    if (e.key === 'games') {
        games = JSON.parse(e.newValue) || [];
        displayGames();
    }
});

displayGames();