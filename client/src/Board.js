import { useEffect, useState } from "react";
import './css/Board.css';
import socket from './socketConfig'

const Board = ({ game, setGame, player, setGameOutcome, timer }) => {
    console.log('rendering board');
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
        if (game.hasStarted && player.colour === game.turn && timer !== null && timer <= 0) {
            // make random move
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
    const isDraw = () => {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (board[i][j] === '')
                    return false;
            }
        }
        return true;
    }
    const hasWon = (colour) => {
        // check columns
        for (let i = 0; i < width; i++) {
            for (let j = 0; j <= height - 4; j++) {
                if (board[i][j] === colour && board[i][j + 1] === colour && board[i][j + 2] === colour && board[i][j + 3] === colour)
                    return true;
            }
        }
        // check rows
        for (let j = 0; j < height; j++) {
            for (let i = 0; i <= width - 4; i++) {
                if (board[i][j] === colour && board[i + 1][j] === colour && board[i + 2][j] === colour && board[i + 3][j] === colour)
                    return true;
            }
        }
        // diagonals
        // right down
        for (let i = 0; i <= width - 4; i++) {
            for (let j = 0; j <= height - 4; j++) {
                if (board[i][j] === colour && board[i + 1][j + 1] === colour && board[i + 2][j + 2] === colour && board[i + 3][j + 3] === colour)
                    return true;
            }
        }
        // left down
        for (let i = 3; i < width; i++) {
            for (let j = 0; j <= height - 4; j++) {
                if (board[i][j] === colour && board[i - 1][j + 1] === colour && board[i - 2][j + 2] === colour && board[i - 3][j + 3] === colour)
                    return true;
            }
        }
        return false;
    }
    const makeMove = (row, colIndex) => {
        console.log('making move');
        board[colIndex][row] = player.colour;
        setBoard([...board]);
        socket.emit('update-board', { row, col: colIndex, colour: player.colour });
        // turn over
        if (hasWon(player.colour)) {
            game.hasStarted = false;
            setGameOutcome('You won!');
            socket.emit('game-over', { result: 'You lost!' });
        } else if (isDraw()) {
            game.hasStarted = false;
            setGameOutcome('Draw');
            socket.emit('game-over', { result: 'Draw!' });
        }
        else {
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            socket.emit('change-turn');
        }
        setGame({ ...game });
        console.log('finished move');
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