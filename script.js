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

// Function to handle selecting a player
function selectPlayer(playerItem) {
    resetSelection(); // Clear previous selections

    currentSelectedPlayer = playerItem;
    playerItem.classList.add('selected'); // Mark as selected to show the cross icon

    // Hide all other list items except the selected one
    Array.from(list.children).forEach(item => {
        if (item !== playerItem) {
            item.classList.add('filtered'); // Hide non-selected items
        }
    });

    // Show the similar players form
    similarPlayersForm.style.display = 'block'; // Show the similar players section

    // Retrieve player data using the unique ID
    const playerId = parseInt(playerItem.getAttribute('data-player-id'), 10);
    const playerName = playerItem.getAttribute('data-player-name');

    // Find the exact player data by ID
    const playerData = players[playerName].find(p => p.id === playerId);

    if (playerData) {
        console.log(playerData); // Log full player data
    } else {
        console.log("No player found with that ID.");
    }
}

// Function to reset selection and show all players
function resetSelection() {
    Array.from(list.children).forEach(item => {
        item.classList.remove('filtered', 'selected'); // Remove filtering and selection
    });
    currentSelectedPlayer = null; // Clear the selected player

    // Hide the similar players form when no player is selected
    similarPlayersForm.style.display = 'none'; // Hide the similar players section
}

// Event listener for player selection
list.addEventListener('click', (e) => {
    let targetItem = e.target;

    // If the cross icon is clicked, reset the selection
    if (targetItem.classList.contains('cross')) {
        resetSelection();
        return;
    }

    // Traverse up to find the parent <li> if a child was clicked
    while (targetItem && !targetItem.classList.contains('list-group-item')) {
        targetItem = targetItem.parentElement;
    }

    // Check if this item is already selected or not
    if (targetItem && targetItem !== currentSelectedPlayer) {
        selectPlayer(targetItem); // Select this player if not already selected
    }
});

// Event listener for search input
search.addEventListener('keyup', () => {
    const term = search.value.trim();
    filterPlayers(term); // Filter players based on the search term
});

// Load data when the page is ready
loadData();
