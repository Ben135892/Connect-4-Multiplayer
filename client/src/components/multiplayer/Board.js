import { useEffect, useState } from "react";
import '../../css/Board.css';
import socket from '../../socketConfig'
import hasWon from '../../hasWon';
import isDraw from '../../isDraw';
import randomMove from '../../randomMove';

const Board = ({ game, setGame, playerColour, setGameOutcome }) => {
    const width = 7;
    const height = 6;
    const generateBoard = () => {
        const matrix = new Array(width);
        for (let i = 0; i < width; i++) {
            matrix[i] = new Array(height).fill('');
        }
        return matrix;
    };
    const [board, setBoard] = useState(generateBoard());
    useEffect(() => {
        socket.on('restart', () => {
            setGameOutcome(null);
            setBoard(generateBoard());
        });
        socket.on('update-board', ({ row, col, colour }) => {
            setBoard(board => {
                board[col][row] = colour;
                return [...board];
            });
        });
        return () => {
            socket.off('restart');
            socket.off('update-board');
        };
    }, [setGameOutcome]);
    const forcedMove = (turnID) => {
        if (!game.hasStarted || turnID !== game.turnID || game.turn !== playerColour) {
            return;
        }
        const move = randomMove(board, width, height);
        makeMove(move.row, move.col);
    }
    useEffect(() => {
        // for forced move due to time running out. In this this case, make a random move
        socket.on('make-move', ({ turnID }) => forcedMove(turnID));
        return () => socket.off('make-move');
    });
    const makeMove = (row, col) => {
        board[col][row] = playerColour;
        setBoard([...board]);
        // turn over
        if (hasWon(playerColour, board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('You won!');
            socket.emit('game-over-and-update-board', { gameID: game._id, result: 'You lost!', row, col, colour: playerColour });
        } else if (isDraw(board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('Draw');
            socket.emit('game-over-and-update-board', { gameID: game._id, result: 'Draw!', row, col, colour: playerColour });
        }
        else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            socket.emit('change-turn-and-board', { gameID: game._id, row, col, colour: playerColour });
        }
        setGame({ ...game });
    }
    const handleClick = (col) => {
        if (!game.hasStarted || game.turn !== playerColour)
            return;
        let row = height - 1;
        while (row >= 0) {
            if (board[col][row] === '') {
                makeMove(row, col);
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