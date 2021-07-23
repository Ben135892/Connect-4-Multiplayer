const hasWon = (colour, board, width, height) => {
    // check columns
    for (let i = 0; i < width; i++) {
        for (let j = 0; j <= height - 4; j++) {
            if (board[i][j] === colour && board[i][j + 1] === colour && board[i][j + 2] === colour && board[i][j + 3] === colour)
                return true;
        }
    }
    // check rows
    for (let j = 0; j < height; j++) {
        for (let i = 0; i <= width - 4; i++) {
            if (board[i][j] === colour && board[i + 1][j] === colour && board[i + 2][j] === colour && board[i + 3][j] === colour)
                return true;
        }
    }
    // diagonals
    // right down
    for (let i = 0; i <= width - 4; i++) {
        for (let j = 0; j <= height - 4; j++) {
            if (board[i][j] === colour && board[i + 1][j + 1] === colour && board[i + 2][j + 2] === colour && board[i + 3][j + 3] === colour)
                return true;
        }
    }
    // left down
    for (let i = 3; i < width; i++) {
        for (let j = 0; j <= height - 4; j++) {
            if (board[i][j] === colour && board[i - 1][j + 1] === colour && board[i - 2][j + 2] === colour && board[i - 3][j + 3] === colour)
                return true;
        }
    }
    return false;
}

export default hasWon;