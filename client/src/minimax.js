import hasWon from './hasWon';
import isDraw from './isDraw';
import possiblePositions from './possiblePositions';

// https://en.wikipedia.org/wiki/Minimax

const minimax = (board, depth, alpha, beta, maximizingPlayer, aiColour, humanColour, width, height) => {
    if (hasWon(aiColour, board, width, height)) {
        return 1000 + depth;
    } else if (hasWon(humanColour, board, width, height)) {
        return -1000 - depth;
    } else if (isDraw(board, width, height)) {
        return 0;
    } else if (depth === 0) {
        // randomness
        return Math.floor(Math.random() * 200) - 100;
    }
    const positions = possiblePositions(board, width, height);
    if (maximizingPlayer) {
        let max = -Infinity;
        for (let i = 0; i < positions.length; i++) {
            board[positions[i].x][positions[i].y] = aiColour;
            const value = minimax(board, depth - 1, alpha, beta, false, aiColour, humanColour, width, height);
            max = Math.max(max, value);
            alpha = Math.max(alpha, value);
            // undo the move
            board[positions[i].x][positions[i].y] = '';
            if (alpha >= beta) break;
        }
        return max;
    } else {
        let min = Infinity;
        for (let i = 0; i < positions.length; i++) {
            board[positions[i].x][positions[i].y] = humanColour;
            const value = minimax(board, depth - 1, alpha, beta, true, aiColour, humanColour, width, height);
            min = Math.min(min, value);
            beta = Math.min(beta, value);
            // undo the move
            board[positions[i].x][positions[i].y] = '';
            if (beta <= alpha) break;
        }
        return min;
    }
}

export default minimax;