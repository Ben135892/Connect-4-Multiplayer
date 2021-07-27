import { useEffect, useState } from "react";
import '../../css/Board.css';
import socket from '../../socketConfig'
import hasWon from '../../hasWon';
import isDraw from '../../isDraw';

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

const Board = ({ game, setGame, playerColour, setGameOutcome, setTimer, setIsTimerPaused }) => {
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
    useEffect(() => {
        // for forced move due to time running out. In this this case, make a random move
        socket.on('make-move', ({ turnID }) => {
            if (!game.hasStarted || turnID !== game.turnID || game.turn !== playerColour) {
                return;
            }
            const move = randomMove(board, width, height);
            makeMove(move.row, move.col);
        });
        return () => socket.off('make-move');
        // eslint-disable-next-line
    }, [game, playerColour, board]);
    const makeMove = (row, colIndex) => {
        board[colIndex][row] = playerColour;
        setBoard([...board]);
        const gameID = game._id.toString();
        socket.emit('update-board', { gameID, row, col: colIndex, colour: playerColour });
        // turn over
        if (hasWon(playerColour, board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('You won!');
            setTimer(null);
            socket.emit('game-over', { gameID, result: 'You lost!' });
        } else if (isDraw(board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('Draw');
            setTimer(null);
            socket.emit('game-over', { gameID, result: 'Draw!' });
        }
        else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            socket.emit('change-turn', { gameID });
            setTimer(game.turnTime);
        }
        setIsTimerPaused(true); 
        setGame({ ...game });
    }
    const handleClick = (colIndex) => {
        if (!game.hasStarted || game.turn !== playerColour)
            return;
        let row = height - 1;
        while (row >= 0) {
            if (board[colIndex][row] === '') {
                makeMove(row, colIndex);
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