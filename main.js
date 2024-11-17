import { loadData, createPlayerLookupTable } from './data.js';
import { displayPlayers, populateSimilarPlayers } from './ui.js';
import { setComparisonData, displayComparisonTable } from './compare.js';
import { 
    filterPlayers, computeAttributeStats,
    calculateEuclideanDistance, calculateSimilarityScore 
} from './filters.js';

const searchBar = document.querySelector('.search');
const search = document.querySelector('.search input');
const list = document.querySelector('.players');
const similarPlayersSection = document.querySelector('.similar-players-section');
const similarPlayersList = document.querySelector('.similar-players');
const compareButton = document.querySelector('.compareButton');
const backButton = document.querySelector('.back-button');

const attributes = [
    'crosses_into_penalty_area', 'interceptions', 'key_passes',
    'passes_into_final_third', 'passes_into_penalty_area', 
    'progressive_carries', 'shots_on_target_per_90', 'shots_per_90',
    'successful_take_ons', 'tackles', 'take_ons_attempted', 
    'through_balls', 'total_carries'
];

let data;
let players = {};
let currentSelectedPlayer = null;
let attributeStats = null; // Initialize as null, it will be set after data is loaded

async function initialize() {
    // Load the player data asynchronously
    data = await loadData('player_data.json');
    if (!data) return;

    // Create the player lookup table
    players = createPlayerLookupTable(data.players);

    
    // Compute the attribute stats after data is loaded
    attributeStats = computeAttributeStats(data.players, attributes);

    // Display players in the UI
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
        const similarPlayers = calculateDistances(playerData);

        // Set data for the comparison table
        setComparisonData(playerData, similarPlayers.slice(0, 5)); // Top 5 similar players

        // Show the Compare button
        const compareButton = document.querySelector('.compareButton');
        compareButton.style.display = 'inline-block'; // Make it visible
    }
}


function resetSelection() {
    Array.from(list.children).forEach(item => {
        item.classList.remove('filtered', 'selected');
    });

    currentSelectedPlayer = null;
    similarPlayersSection.style.display = 'none';

    // Hide the Compare button
    compareButton.style.display = 'none'; // Hide it

    // Hide the comparison table when the cross is clicked
    const tableContainer = document.querySelector('.table-responsive');
    tableContainer.style.display = 'none';
}

function calculateDistances(selectedPlayer) {
    const maxDistance = 100;

    // Filter players by position
    const samePositionPlayers = data.players.filter(player => player.player_position === selectedPlayer.player_position);

    // Use raw player data directly for distance calculation
    const distances = samePositionPlayers.map(otherPlayer => {
        if (otherPlayer.id === selectedPlayer.id) return null;

        const distance = calculateEuclideanDistance(selectedPlayer, otherPlayer, attributes);
        const similarityScore = calculateSimilarityScore(distance, maxDistance);

        return { ...otherPlayer, similarityScore };
    }).filter(Boolean);

    distances.sort((a, b) => b.similarityScore - a.similarityScore);

    populateSimilarPlayers(distances, similarPlayersList, similarPlayersSection);

    return distances;
}



compareButton.addEventListener('click', () => {
    if (!currentSelectedPlayer) {
        console.error("No player selected for comparison.");
        return;
    }

    // Trigger the comparison table display logic
    const playerId = parseInt(currentSelectedPlayer.getAttribute('data-player-id'), 10);
    const playerName = currentSelectedPlayer.getAttribute('data-player-name');

    const playerData = players[playerName].find(p => p.id === playerId);
    if (playerData) {
        const similarPlayers = calculateDistances(playerData);
        setComparisonData(playerData, similarPlayers.slice(0, 5)); // Top 5 similar players
        displayComparisonTable();

        const backButton = document.querySelector('.back-button');
        backButton.style.display = 'inline-block';

        // Hide everything else
        list.style.display = 'none';
        similarPlayersSection.style.display = 'none';
        compareButton.style.display = 'none';
        searchBar.style.display = 'none'; // Hide search bar
    }
});


// Modify the back button logic
backButton.addEventListener('click', () => {
    // Hide the comparison table
    const tableContainer = document.querySelector('.table-responsive');
    tableContainer.style.display = 'none';

    // Show the similar players section and other UI elements
    similarPlayersSection.style.display = 'block';
    compareButton.style.display = 'inline-block';
    list.style.display = 'block';
    searchBar.style.display = 'block'; // Show search bar

    // Hide the back button
    backButton.style.display = 'none';
});



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
