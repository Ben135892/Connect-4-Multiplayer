import { useState } from 'react';
import '../css/StartButton.css';

const randomNum = () => Math.floor(Math.random() * 2); // random num between 0 and 1
const oppositeColour = (colour) => colour === 'red' ? 'yellow' : 'red'; 

const StartButton = ({ game, setGame, setYourColour, setAiColour, setGameOutcome }) => {
    const [clicked, setClicked] = useState(false);
    const start = () => {
        const yourColour = randomNum() === 0 ? 'red' : 'yellow';
        setYourColour(yourColour);
        setAiColour(oppositeColour(yourColour));
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