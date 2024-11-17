export function filterPlayers(term, list) {
    const searchTerm = term.trim().toLowerCase();

    Array.from(list.children).forEach(player => {
        const playerText = player.textContent.trim().toLowerCase();
        if (searchTerm === "" || playerText.includes(searchTerm)) {
            player.classList.remove('filtered');
        } else {
            player.classList.add('filtered');
        }
    });
}

export function computeAttributeStats(players, attributes) {
    const stats = {};

    attributes.forEach(attr => {
        const values = players.map(player => player[attr] || 0); // Handle missing values as 0
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        stats[attr] = { mean, stdDev };
    });

    return stats;
}


export function calculateEuclideanDistance(playerA, playerB, attributes) {
    let sumSquares = 0;

    attributes.forEach(attr => {
        // Use the raw attribute values without standardization
        const a = playerA[attr] || 0; // Default to 0 if the attribute is missing
        const b = playerB[attr] || 0;
        const diff = a - b;
        sumSquares += diff * diff;
    });

    return Math.sqrt(sumSquares);
}

export function calculateSimilarityScore(distance, maxDistance) {
    return 1 - distance / maxDistance;
}
