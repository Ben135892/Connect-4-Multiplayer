import { useEffect, useState } from "react";
import '../css/Board.css';
import socket from './socketConfig'
import hasWon from '../hasWon';
import isDraw from '../isDraw';

const Board = ({ game, setGame, player, setGameOutcome, timer, setTimer }) => {
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
    // run this code once
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
    // runs whenever board is updated/rerendered
    useEffect(() => {
        // if timer has ran out for players turn, make a random move
        if (game.hasStarted && player.colour === game.turn && timer <= 0) {
            while (true) {
                let row = height - 1;
                const column = Math.floor(Math.random() * width);
                while (row >= 0) {
                    if (board[column][row] === '') {
                        makeMove(row, column);
                        return;
                    }
                    row--;
                }
            }
        }
    });
    const makeMove = (row, colIndex) => {
        board[colIndex][row] = player.colour;
        setBoard([...board]);
        socket.emit('update-board', { gameID: game._id.toString(), row, col: colIndex, colour: player.colour });
        // turn over
        if (hasWon(player.colour, board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('You won!');
            socket.emit('game-over', { gameID: game._id.toString(), result: 'You lost!' });
        } else if (isDraw(board, width, height)) {
            game.hasStarted = false;
            setGameOutcome('Draw');
            socket.emit('game-over', { gameID: game._id.toString(), result: 'Draw!' });
        }
        else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            socket.emit('change-turn', { gameID: game._id.toString() });
            setTimer(game.turnTime);
        }
        setGame({ ...game });
    }
    const handleClick = (colIndex) => {
        if (!game.hasStarted || game.turn !== player.colour)
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