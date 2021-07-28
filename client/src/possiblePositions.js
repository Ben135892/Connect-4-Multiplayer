const possiblePositions = (board, width, height) => {
    const positions = [];
    for (let i = 0; i < width; i++) {
        let row = height - 1;
        while (row >= 0) {
            if (board[i][row] === '') {
                positions.push({ x: i, y: row });
                break;
            }
            row--;
        }
    }
    return positions;
}

export default possiblePositions;