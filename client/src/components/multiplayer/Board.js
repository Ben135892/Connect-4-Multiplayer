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
                return board;
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
    const makeMove = (row, colIndex) => {
        board[colIndex][row] = playerColour;
        setBoard([...board]);
        socket.emit('update-board', { gameID: game._id, row, col: colIndex, colour: playerColour });
        // turn over
        if (hasWon(playerColour, board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('You won!');
            socket.emit('game-over', { gameID: game._id, result: 'You lost!' });
        } else if (isDraw(board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('Draw');
            socket.emit('game-over', { gameID: game._id, result: 'Draw!' });
        }
        else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            socket.emit('change-turn', { gameID: game._id });
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