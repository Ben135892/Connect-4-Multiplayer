import { useState } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import '../../css/SingleplayerGame.css';

const SinglePlayer = ({ difficulty, setDifficulty }) => {
    const [game, setGame] = useState({ hasStarted: false });
    const [playerColour, setPlayerColour] = useState(null);
    const [gameOutcome, setGameOutcome] = useState(null);
    return (
        <div id="singleplayer">
            <h2>{difficulty.string}</h2>
            <GameInfo game={game} setGame={setGame} playerColour={playerColour} setPlayerColour={setPlayerColour} gameOutcome={gameOutcome} setGameOutcome={setGameOutcome} />
            <Board depth={difficulty.depth} game={game} setGame={setGame} playerColour={playerColour} setGameOutcome={setGameOutcome} />
            <button id="back" onClick={() => setDifficulty(null)}>Change difficulty</button>
        </div>
    )
}
 
export default SinglePlayer;