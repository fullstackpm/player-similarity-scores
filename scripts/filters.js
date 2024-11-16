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

export function calculateEuclideanDistance(playerA, playerB) {
    const attributes = [
        'crosses_into_penalty_area', 'interceptions', 'key_passes',
        'passes_into_final_third', 'passes_into_penalty_area', 
        'progressive_carries', 'shots_on_target_per_90', 'shots_per_90',
        'successful_take_ons', 'tackles', 'take_ons_attempted', 
        'through_balls', 'total_carries'
    ];

    let sumSquares = 0;

    attributes.forEach(attr => {
        const a = playerA[attr] || 0;
        const b = playerB[attr] || 0;
        const diff = a - b;
        sumSquares += diff * diff;
    });

    return Math.sqrt(sumSquares);
}

export function calculateSimilarityScore(distance, maxDistance) {
    return 1 - distance / maxDistance;
}
