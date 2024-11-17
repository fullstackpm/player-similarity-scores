export async function loadData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}

export function createPlayerLookupTable(playersArray) {
    const players = {};
    playersArray.forEach((player, index) => {
        player.id = index; // Assign a unique ID
        if (!players[player.player_name]) {
            players[player.player_name] = [];
        }
        players[player.player_name].push(player);
    });
    return players;
}
