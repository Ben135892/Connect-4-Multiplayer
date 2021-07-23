const isDraw = (board, width, height) => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (board[i][j] === '')
                return false;
        }
    }
    return true;
}

export default isDraw;