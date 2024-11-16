// compare.js

let currentSelectedPlayerData = null;
let currentSimilarPlayers = [];

// Function to create the "Compare" button
export function createCompareButton() {
    const button = document.querySelector('.compareButton');
    // if (existingButton) return;

    // const compareButton = document.createElement('button');
    // compareButton.textContent = 'Compare';
    // compareButton.classList.add('btn', 'btn-primary', 'compare-button');
    // compareButton.style.marginTop = '10px';

    const similarPlayersSection = document.querySelector('.similar-players-section');
    similarPlayersSection.appendChild(button);

    button.addEventListener('click', () => {
        displayComparisonTable();
    });
}

// Function to display the comparison table
function displayComparisonTable() {
    if (!currentSelectedPlayerData || currentSimilarPlayers.length === 0) {
        console.error("No players available for comparison.");
        return;
    }

    const tableSection = document.querySelector('.comparison-table-section') || createComparisonTableSection();
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'comparison-table');

    const headerRow = document.createElement('tr');
    table.appendChild(headerRow);

    const attributesRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Attribute</th>`;
    const allPlayers = [currentSelectedPlayerData, ...currentSimilarPlayers];

    // Add player headers in the table
    allPlayers.forEach(player => {
        const playerHeader = document.createElement('th');
        playerHeader.textContent = player.player_name;
        headerRow.appendChild(playerHeader);
    });

    // Attributes for comparison
    const attributes = [
        'crosses_into_penalty_area', 'interceptions', 'key_passes', 
        'passes_into_final_third', 'passes_into_penalty_area',
        'progressive_carries', 'shots_on_target_per_90', 'shots_per_90',
        'successful_take_ons', 'tackles', 'take_ons_attempted',
        'through_balls', 'total_carries'
    ];

    // Create rows for each attribute
    attributes.forEach(attr => {
        const row = document.createElement('tr');
        const attrCell = document.createElement('td');
        attrCell.textContent = formatAttributeName(attr);
        row.appendChild(attrCell);

        allPlayers.forEach(player => {
            const valueCell = document.createElement('td');
            valueCell.textContent = player[attr] ? player[attr] : '-';
            row.appendChild(valueCell);
        });

        table.appendChild(row);
    });

    // Append the table to the table section
    tableSection.innerHTML = '';
    tableSection.appendChild(table);
}

// Helper function to create the comparison table section
function createComparisonTableSection() {
    const tableSection = document.createElement('div');
    tableSection.classList.add('comparison-table-section');
    const container = document.querySelector('.container');
    container.appendChild(tableSection);
    return tableSection;
}

// Format attribute names for display
function formatAttributeName(attribute) {
    return attribute
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}

// Function to set the current selected player and similar players for comparison
export function setComparisonData(selectedPlayer, similarPlayers) {
    currentSelectedPlayerData = selectedPlayer;
    currentSimilarPlayers = similarPlayers;
}
