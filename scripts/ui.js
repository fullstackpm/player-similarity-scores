export function displayPlayers(playersArray, container) {
    container.innerHTML = ''; // Clear existing list items

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
        listItem.setAttribute('data-player-id', player.id);
        listItem.setAttribute('data-player-name', player.player_name);
        container.appendChild(listItem);
    });
}

export function populateSimilarPlayers(distances, container, section) {
    container.innerHTML = ''; // Clear previous content

    if (!distances || distances.length === 0) {
        container.innerHTML = '<li class="list-group-item text-center">No similar players found.</li>';
        section.style.display = 'block'; // Show the section
        return;
    }

    distances.slice(0, 5).forEach(player => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
        ${player.player_name}, ${player.current_club_name}, ${player.age_years}, ${player.player_position} <br>
        Similarity: ${player.similarityScore.toFixed(2) * 100}%
        `;
        container.appendChild(listItem);
    });

    section.style.display = 'block';
}
