const search = document.querySelector('.search input');
const list = document.querySelector('.players');
const similarPlayersForm = document.querySelector('.add.similar-players');

let data;
let players = {}; // Lookup table with players stored by name and unique IDs
let currentSelectedPlayer = null; // Track the selected player

// Load data from JSON and display players
async function loadData() {
    try {
        const response = await fetch('player_data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        data = await response.json();
        createPlayerLookupTable(data.players);
        displayPlayers(data.players);
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

// Function to create a lookup table from the player data
function createPlayerLookupTable(playersArray) {
    playersArray.forEach((player, index) => {
        player.id = index; // Assign a unique ID based on the index
        if (!players[player.player_name]) {
            players[player.player_name] = []; // Initialize an array for players with the same name
        }
        players[player.player_name].push(player); // Store each player with a unique ID
    });
}

// Function to display players in the <ul> element, sorted alphabetically by name
function displayPlayers(playersArray) {
    const listGroup = document.querySelector('.list-group.players');
    listGroup.innerHTML = ''; // Clear any existing list items

    // Sort players array by player name in alphabetical order
    const sortedPlayers = playersArray.sort((a, b) => 
        a.player_name.localeCompare(b.player_name)
    );

    sortedPlayers.forEach(player => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        listItem.innerHTML = `
            <span>${player.player_name}, ${player.current_club_name}, ${player.age_years}, ${player.player_position}</span>
            <i class="fas fa-times cross"></i>
        `;
        listItem.setAttribute('data-player-id', player.id); // Use unique ID as data attribute
        listItem.setAttribute('data-player-name', player.player_name); // Set player name as a data attribute
        listGroup.appendChild(listItem);
    });
}

// Function to filter players based on search term
function filterPlayers(term) {
    const searchTerm = term.trim().toLowerCase();

    Array.from(list.children).forEach(player => {
        const playerText = player.textContent.trim().toLowerCase();

        // If search term is in player text, show the player, else hide it
        if (searchTerm === "" || playerText.includes(searchTerm)) {
            player.classList.remove('filtered');
        } else {
            player.classList.add('filtered');
        }
    });
}

// Placeholder for Euclidean distance calculation
function calculateEuclideanDistance(playerA, playerB) {
    const attributes = [
        'crosses_into_penalty_area', 'interceptions', 'key_passes',
        'passes_into_final_third', 'passes_into_penalty_area', 
        'progressive_carries', 'shots_on_target_per_90', 'shots_per_90',
        'successful_take_ons', 'tackles', 'take_ons_attempted', 
        'through_balls', 'total_carries'
    ];

    let sumSquares = 0;

    attributes.forEach(attr => {
        const a = playerA[attr] || 0; // Use 0 if the attribute is missing
        const b = playerB[attr] || 0;
        const diff = a - b;
        sumSquares += diff * diff;
    });

    return Math.sqrt(sumSquares);
}

// Function to reverse distance to similarity score
function calculateSimilarityScore(distance, maxDistance) {
    return 1 - distance / maxDistance; // Reversing the similarity
}

// Function to populate the similar players section
function populateSimilarPlayers(distances) {
    const similarPlayersSection = document.querySelector('.similar-players-section');
    const similarPlayersList = document.querySelector('.similar-players');

    similarPlayersList.innerHTML = ''; // Clear previous list

    if (!distances || distances.length === 0) {
        similarPlayersList.innerHTML = '<li class="list-group-item text-center">No similar players found.</li>';
        similarPlayersSection.style.display = 'block'; // Show the section
        return;
    }

    // Add players to the similar players list (up to 5)
    distances.slice(0, 5).forEach(player => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = `${player.player_name} (Similarity: ${player.similarityScore.toFixed(2)})`;

        similarPlayersList.appendChild(listItem);
    });

    similarPlayersSection.style.display = 'block'; // Show the section
}

// Function to calculate distances of all players from the selected player
function calculateDistances(selectedPlayer) {
    if (!selectedPlayer) {
        console.log("No player selected for comparison.");
        return;
    }

    const maxDistance = 100; // Adjust this based on the expected range of the Euclidean distance

    const distances = data.players.map(otherPlayer => {
        if (otherPlayer.id === selectedPlayer.id) return null; // Skip the selected player

        const distance = calculateEuclideanDistance(selectedPlayer, otherPlayer);
        const similarityScore = calculateSimilarityScore(distance, maxDistance);

        return { ...otherPlayer, similarityScore };
    }).filter(Boolean); // Remove null entries

    // Sort by similarity score (highest to lowest)
    distances.sort((a, b) => b.similarityScore - a.similarityScore);

    // Populate the similar players section
    populateSimilarPlayers(distances);

    return distances; // Return sorted distances
}

// Function to select a player
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

        // Calculate distances for the selected player
        calculateDistances(playerData);
    } else {
        console.log("No player found with that ID.");
    }
}

// Function to reset player selection
function resetSelection() {
    // Unselect all list items and remove any filtering
    Array.from(list.children).forEach(item => {
        item.classList.remove('filtered', 'selected');
    });

    // Clear the current selection
    currentSelectedPlayer = null;

    // Hide the similar players section
    const similarPlayersSection = document.querySelector('.similar-players-section');
    if (similarPlayersSection) {
        similarPlayersSection.style.display = 'none'; // Safely hide the section
    }
}

// Event listener for player selection
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

// Event listener for search input
search.addEventListener('keyup', () => {
    const term = search.value.trim();
    filterPlayers(term); 
});

// Load data when the page is ready
loadData();
