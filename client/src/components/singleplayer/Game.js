import { useState } from 'react';
import StartButton from './StartButton';
import Board from './Board';
import '../../css/SingleplayerGame.css';

const SinglePlayer = ({ difficulty, setDifficulty }) => {
    const [game, setGame] = useState({ hasStarted: false });
    const [yourColour, setYourColour] = useState(null);
    const [aiColour, setAiColour] = useState(null);
    const [gameOutcome, setGameOutcome] = useState(null);
    return (
        <div id="singleplayer">
            <h2>{difficulty.string}</h2>
            {gameOutcome && <h2>{gameOutcome}</h2>}
            {!game.hasStarted && <StartButton game={game} setGame={setGame} setYourColour={setYourColour} setAiColour={setAiColour} setGameOutcome={setGameOutcome} />}
            {game.hasStarted && (game.turn === yourColour ? <h2 className={yourColour + ' highlighted'}>Your turn!</h2>
                                                          : <h2 className={aiColour + ' highlighted'}>AI's turn!</h2>)}
            <Board depth={difficulty.depth} game={game} setGame={setGame} playerColour={yourColour} aiColour={aiColour} setGameOutcome={setGameOutcome} />
            <button id="back" onClick={() => setDifficulty(null)}>Change difficulty</button>
        </div>
    )
}
 
export default SinglePlayer;