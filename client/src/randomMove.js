const randomMove = (board, width, height) => {
    while (true) {
        let row = height - 1;
        const col = Math.floor(Math.random() * width);
        while (row >= 0) {
            if (board[col][row] === '') {
                return { row, col };
            }
            row--;
        }
    }
}

export default randomMove;