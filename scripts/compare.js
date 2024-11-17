let currentSelectedPlayerData = null;
let currentSimilarPlayers = [];

// Function to create the "Compare" button
export function createCompareButton() {
    const existingButton = document.querySelector('.compare-button');
    if (existingButton) return;

    const compareButton = document.createElement('button');
    compareButton.textContent = 'Compare';
    compareButton.classList.add('btn', 'btn-primary', 'compare-button');
    compareButton.style.marginTop = '10px';

    const similarPlayersSection = document.querySelector('.similar-players-section');
    similarPlayersSection.appendChild(compareButton);

    compareButton.addEventListener('click', () => {
        displayComparisonTable();
    });
}

// Function to display the comparison table
export function displayComparisonTable() {
    if (!currentSelectedPlayerData || currentSimilarPlayers.length === 0) {
        console.error("No players available for comparison.");
        return;
    }

    const tableContainer = document.querySelector('.table-responsive');
    const tableBody = document.querySelector('.table tbody');

    // Clear the table body
    tableBody.innerHTML = '';

    // Combine the selected player with the similar players
    const allPlayers = [currentSelectedPlayerData, ...currentSimilarPlayers];

    // Populate rows
    allPlayers.forEach((player, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${player.player_name}</td>
            <td>${player.age_years}</td>
            <td>${player.player_position}</td>
            <td>${player.crosses_into_penalty_area || '-'}</td>
            <td>${player.key_passes || '-'}</td>
            <td>${player.passes_into_final_third || '-'}</td>
            <td>${player.passes_into_penalty_area || '-'}</td>
            <td>${player.progressive_carries || '-'}</td>
            <td>${player.shots_on_target_per_90 || '-'}</td>
            <td>${player.shots_per_90 || '-'}</td>
            <td>${player.successful_take_ons || '-'}</td>
            <td>${player.tackles || '-'}</td>
            <td>${player.interceptions || '-'}</td>
            <td>${player.take_ons_attempted || '-'}</td>
            <td>${player.through_balls || '-'}</td>
            <td>${player.total_carries || '-'}</td>
        `;

        tableBody.appendChild(row);
    });

    // Show the table
    tableContainer.style.display = 'block';
}


// Set selected player and similar players
export function setComparisonData(selectedPlayer, similarPlayers) {
    currentSelectedPlayerData = selectedPlayer;
    currentSimilarPlayers = similarPlayers;
}
