import { useState } from 'react';
import '../../css/StartButton.css';

const randomNum = () => Math.floor(Math.random() * 2); // random num between 0 and 1

const StartButton = ({ game, setGame, setPlayerColour, setGameOutcome }) => {
    const [clicked, setClicked] = useState(false);
    const start = () => {
        const playerColour = randomNum() === 0 ? 'red' : 'yellow';
        setPlayerColour(playerColour);
        game.hasStarted = true;
        game.turn = randomNum() === 0 ? 'red' : 'yellow';
        setGame({...game});
        setGameOutcome(null);
    }
    const startGame = () => {
        setClicked(true);
        start();
    };
    if (clicked)
        return null;
    return (
        <button id="start-button" onClick={startGame}>Start Game</button>
    );
};

export default StartButton;