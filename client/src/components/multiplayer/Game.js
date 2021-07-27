import socket from '../../socketConfig';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Messages from './Messages';
import PlayerList from './PlayerList'
import GameInfo from './GameInfo';
import Board from './Board';
import Timer from './Timer';
import '../../css/Game.css'

// get the player object corresponding to the socket ID
const getPlayer = (players) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].socketID === socket.id)
            return players[i];
    }
    return { _id: '' };
}

const Game = ({ game, setGame, players, setPlayers }) => {
    const player = getPlayer(players);
    const [gameOutcome, setGameOutcome] = useState(null);
    const [timer, setTimer] = useState(null);
    const [isTimerPaused, setIsTimerPaused] = useState(true);
    useEffect(() => {
        socket.on('game-over', result => {
            setGameOutcome(result);
            setTimer(null);
            setIsTimerPaused(true);
        });
        socket.on('update-timer', time => {
            setTimer(time);
            setIsTimerPaused(false);
        });
        socket.on('remove-timer', () => {
            setTimer(null);
            setIsTimerPaused(true);
        });
        return () => {
            socket.off('game-over');
            socket.off('update-timer');
            if (player._id !== '') {
                socket.emit('leave-game');
                setGame({});
                setPlayers([]);
            } 
        }
    }, [player._id, setGame, setPlayers]);
    if (player._id === '')
        return <Redirect to="/" />;
    return (
        <div id="game">
            <h2>Game Code: {game.joinID}</h2>
            <GameInfo game={game} player={player} gameOutcome={gameOutcome} />
            {timer !== null && <Timer timer={timer} setTimer={setTimer} isTimerPaused={isTimerPaused} turnID={game.turnID}/>}
            <div id="main">
                <PlayerList playerID={player._id} players={players} />
                <Board game={game} setGame={setGame} playerColour={player.colour} setGameOutcome={setGameOutcome} setTimer={setTimer} setIsTimerPaused={setIsTimerPaused}/>
                <Messages gameID={game._id.toString()} nickName={player.nickName} />
            </div>
        </div>
    );
};

export default Game;
