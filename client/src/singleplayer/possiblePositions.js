const possiblePositions = (board) => {
    const positions = [];
    for (let i = 0; i < board.length; i++) {
        let row = board[i].length - 1;
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