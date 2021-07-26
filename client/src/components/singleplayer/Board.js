import { useState, useEffect } from "react";
import '../../css/Board.css';
import hasWon from '../../hasWon';
import isDraw from '../../isDraw';
import generateBoard from '../../generateBoard';
import possiblePositions from '../../possiblePositions';
import minimax from '../../minimax';

const Board = ({ depth, game, setGame, playerColour, aiColour, setGameOutcome }) => {
    const width = 7;
    const height = 6;
    const [board, setBoard] = useState(generateBoard(width, height));
    const aiMove = () => {
        let max = -Infinity;
        let bestMove;
        let alpha = -Infinity, beta = Infinity;
        const positions = possiblePositions(board);
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
        makeMove(aiColour, bestMove.y, bestMove.x);
    }
    useEffect(() => {
        if (game.hasStarted) {
            setBoard(generateBoard(width, height));
        }
    }, [game.hasStarted]);
    useEffect(() => {
        if (game.hasStarted && game.turn === aiColour) {
            aiMove();
        }
        // eslint-disable-next-line
    }, [board]);
    const makeMove = async (colour, row, colIndex) => {
        board[colIndex][row] = colour;
        setBoard([...board]);
        // turn over
        if (hasWon(colour, board, width, height)) {
            game.hasStarted = false;
            if (colour === playerColour) {
                setGameOutcome('You won!');
            } else {
                setGameOutcome('You lost!');
            }
        } else if (isDraw(board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('Draw');
        }
        else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
        }
        setGame({ ...game });
    }
    const handleClick = (colIndex) => {
        if (!game.hasStarted || game.turn !== playerColour)
            return;
        let row = height - 1;
        while (row >= 0) {
            if (board[colIndex][row] === '') {
                makeMove(playerColour, row, colIndex);
                return;
            }
            row--;
        }
    }
    const renderCell = (cell, colIndex, rowIndex) => {
        if (cell !== '') {
            return <div className={'cell ' + cell} key={colIndex + ',' + rowIndex}></div>
        } else {
            return <div className='cell' key={colIndex + ',' + rowIndex}></div>
        }
    }
    return (
        <div id='board'>
            {board.map((currentCol, colIndex) => 
                <div className='col' onClick={() => handleClick(colIndex)} key={colIndex}>
                    {board[colIndex].map((cell, rowIndex) => 
                        renderCell(cell, colIndex, rowIndex)
                    )}
                </div>
            )}
        </div>
    );
}

export default Board;