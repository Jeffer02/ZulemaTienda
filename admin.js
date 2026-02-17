let games = JSON.parse(localStorage.getItem('games')) || [];
let editingGameId = null;

function saveGames() {
    localStorage.setItem('games', JSON.stringify(games));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function displayGamesTable() {
    const tbody = document.getElementById('gamesTableBody');

    if (games.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay juegos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = games.map(game => `
        <tr>
            <td><img src="${game.image}" alt="${game.name}"></td>
            <td>${game.name}</td>
            <td><span class="badge bg-primary">${game.platform}</span></td>
            <td>S/ ${game.price.toFixed(2)}</td>
            <td><span class="badge ${game.stock > 0 ? 'bg-success' : 'bg-danger'}">${game.stock}</span></td>
            <td>
                <button class="btn btn-sm btn-warning btn-action" onclick="openEditModal('${game.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteGame('${game.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('addGameForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newGame = {
        id: generateId(),
        name: document.getElementById('gameName').value,
        price: parseFloat(document.getElementById('gamePrice').value),
        platform: document.getElementById('gamePlatform').value,
        image: document.getElementById('gameImage').value,
        description: document.getElementById('gameDescription').value,
        stock: parseInt(document.getElementById('gameStock').value)
    };

    games.push(newGame);
    saveGames();
    displayGamesTable();
    this.reset();

    alert('Juego agregado exitosamente');
});

function openEditModal(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;

    editingGameId = id;
    document.getElementById('editGameId').value = id;
    document.getElementById('editGameName').value = game.name;
    document.getElementById('editGamePrice').value = game.price;
    document.getElementById('editGamePlatform').value = game.platform;
    document.getElementById('editGameImage').value = game.image;
    document.getElementById('editGameDescription').value = game.description;
    document.getElementById('editGameStock').value = game.stock;

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

document.getElementById('editGameForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const gameIndex = games.findIndex(g => g.id === editingGameId);
    if (gameIndex === -1) return;

    games[gameIndex] = {
        id: editingGameId,
        name: document.getElementById('editGameName').value,
        price: parseFloat(document.getElementById('editGamePrice').value),
        platform: document.getElementById('editGamePlatform').value,
        image: document.getElementById('editGameImage').value,
        description: document.getElementById('editGameDescription').value,
        stock: parseInt(document.getElementById('editGameStock').value)
    };

    saveGames();
    displayGamesTable();

    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();

    alert('Juego actualizado exitosamente');
});

function deleteGame(id) {
    if (!confirm('¿Estás seguro de eliminar este juego?')) return;

    games = games.filter(g => g.id !== id);
    saveGames();
    displayGamesTable();

    alert('Juego eliminado exitosamente');
}

displayGamesTable();