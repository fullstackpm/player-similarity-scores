import { loadData, createPlayerLookupTable } from './data.js';
import { displayPlayers, populateSimilarPlayers } from './ui.js';
import { filterPlayers, calculateEuclideanDistance, calculateSimilarityScore } from './filters.js';



const search = document.querySelector('.search input');
const list = document.querySelector('.players');
const similarPlayersSection = document.querySelector('.similar-players-section');
const similarPlayersList = document.querySelector('.similar-players');

let data;
let players = {};
let currentSelectedPlayer = null;

async function initialize() {
    data = await loadData('player_data.json');
    if (!data) return;

    players = createPlayerLookupTable(data.players);
    displayPlayers(data.players, list);
}

function selectPlayer(playerItem) {
    resetSelection();

    currentSelectedPlayer = playerItem;
    playerItem.classList.add('selected');

    Array.from(list.children).forEach(item => {
        if (item !== playerItem) {
            item.classList.add('filtered');
        }
    });

    const playerId = parseInt(playerItem.getAttribute('data-player-id'), 10);
    const playerName = playerItem.getAttribute('data-player-name');

    const playerData = players[playerName].find(p => p.id === playerId);

    if (playerData) {
        console.log('Selected Player:', playerData);
        calculateDistances(playerData);
    }
}

function calculateDistances(selectedPlayer) {
    const maxDistance = 100;

    const distances = data.players.map(otherPlayer => {
        if (otherPlayer.id === selectedPlayer.id) return null;

        const distance = calculateEuclideanDistance(selectedPlayer, otherPlayer);
        const similarityScore = calculateSimilarityScore(distance, maxDistance);

        return { ...otherPlayer, similarityScore };
    }).filter(Boolean);

    distances.sort((a, b) => b.similarityScore - a.similarityScore);

    populateSimilarPlayers(distances, similarPlayersList, similarPlayersSection);

    return distances;
}

function resetSelection() {
    Array.from(list.children).forEach(item => {
        item.classList.remove('filtered', 'selected');
    });

    currentSelectedPlayer = null;
    similarPlayersSection.style.display = 'none';
}

search.addEventListener('keyup', () => {
    const term = search.value.trim();
    filterPlayers(term, list);
});

list.addEventListener('click', (e) => {
    let targetItem = e.target;

    if (targetItem.classList.contains('cross')) {
        resetSelection();
        return;
    }

    while (targetItem && !targetItem.classList.contains('list-group-item')) {
        targetItem = targetItem.parentElement;
    }

    if (targetItem && targetItem !== currentSelectedPlayer) {
        selectPlayer(targetItem);
    }
});

initialize();
