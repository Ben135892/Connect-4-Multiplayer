import socket from '../../socketConfig';
import { useState } from 'react';
import '../../css/StartButton.css';

const StartButton = ({ gameID }) => {
    const [clicked, setClicked] = useState(false);
    const startGame = () => {
        setClicked(true);
        socket.emit('start-game', { gameID });
    };
    if (clicked)
        return null;
    return (
        <button id="start-button" onClick={startGame}>Start Game</button>
    );
};

export default StartButton;