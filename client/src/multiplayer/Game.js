import socket from './socketConfig';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Messages from './Messages';
import PlayerList from './PlayerList'
import GameInfo from './GameInfo';
import Board from './Board';
import Timer from './Timer';
import '../css/Game.css'

// get the player object corresponding to the socket ID
const getPlayer = (players) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].socketID === socket.id)
            return players[i];
    }
    return { _id: '' };
}

const Game = ({ game, setGame, players }) => {
    const player = getPlayer(players);
    const [gameOutcome, setGameOutcome] = useState(null);
    const [timer, setTimer] = useState(null);
    useEffect(() => {
        socket.on('game-over', result => setGameOutcome(result));
        socket.on('update-timer', time => setTimer(time));
        socket.on('remove-timer', () => setTimer(null));
        return () => {
            socket.off('game-over');
            socket.off('update-timer');
            socket.off('remove-timer');
            if (player._id !== '') {
                socket.emit('leave-game');
            } 
        }
    }, [player._id]);
    if (player._id === '')
        return <Redirect to="/" />;
    return (
        <div id="game">
            <h2>Game Code: {game.joinID}</h2>
            <GameInfo game={game} player={player} gameOutcome={gameOutcome} />
            {game.hasStarted && <Timer timer={timer} setTimer={setTimer} />}
            <div id="main">
                <PlayerList playerID={player._id} players={players} />
                <Board game={game} setGame={setGame} player={player} setGameOutcome={setGameOutcome} timer={timer} setTimer={setTimer}/>
                <Messages gameID={game._id.toString()} nickName={player.nickName} />
            </div>
        </div>
    );
};

export default Game;
