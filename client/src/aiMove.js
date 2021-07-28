import minimax from './minimax';
import possiblePositions from './possiblePositions';

const aiMove = (board, depth, width, height, aiColour, playerColour) => {
    let max = -Infinity;
    let bestMove;
    let alpha = -Infinity, beta = Infinity;
    const positions = possiblePositions(board, width, height);
    for (let i = 0; i < positions.length; i++) {
        board[positions[i].x][positions[i].y] = aiColour;
        const value = minimax(board, depth - 1, alpha, beta, false, aiColour, playerColour, width, height);
        if (value > max) {
            max = value;
            bestMove = positions[i];
        }
        alpha = Math.max(alpha, value);
        // undo the move
        board[positions[i].x][positions[i].y] = '';
    }
    return { row: bestMove.y, col: bestMove.x };
}

export default aiMove;