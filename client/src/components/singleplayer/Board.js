import { useState, useEffect } from "react";
import '../../css/Board.css';
import hasWon from '../../hasWon';
import isDraw from '../../isDraw';
import generateBoard from '../../generateBoard';
import aiMove from '../../aiMove';

const oppositeColour = (colour) => colour === 'red' ? 'yellow' : 'red'; 

const Board = ({ depth, game, setGame, playerColour, setGameOutcome }) => {
    const aiColour = oppositeColour(playerColour);
    const width = 7;
    const height = 6;
    const [board, setBoard] = useState(generateBoard(width, height));
    useEffect(() => {
        if (game.hasStarted) {
            setBoard(generateBoard(width, height));
        }
    }, [game.hasStarted]);
    useEffect(() => {
        if (game.hasStarted && game.turn === aiColour) {
            const interval = 500 + Math.random() * 500; // ai should make turn after user after a certain time with a bit of randomness
            setTimeout(() => {
                const bestMove = aiMove(board, depth, width, height, aiColour, playerColour);
                makeMove(aiColour, bestMove.row, bestMove.col);
            }, interval);
        }
        // eslint-disable-next-line
    }, [board]);
    const makeMove = (colour, row, col) => {
        board[col][row] = colour;
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
        } else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
        }
        setGame({ ...game });
    }
    const handleClick = (col) => {
        if (!game.hasStarted || game.turn !== playerColour)
            return;
        let row = height - 1;
        while (row >= 0) {
            if (board[col][row] === '') {
                makeMove(playerColour, row, col);
                return;
            }
            row--;
        }
    }
    return (
        <div id='board'>
            {board.map((currentCol, col) => 
                <div className='col' onClick={() => handleClick(col)} key={col}>
                    {board[col].map((cell, row) => 
                        <div className={'cell ' + cell} key={col + ',' + row}></div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Board;