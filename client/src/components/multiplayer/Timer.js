import { useState, useEffect } from 'react';
 
const Timer = ({ game }) => {
    const [timer, setTimer] = useState(game.turnTime);
    useEffect(() => {
        setTimer(game.turnTime);
        const interval = setInterval(() => {
            setTimer(timer => timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [game.turnID, game.turn, game.turnTime, setTimer]);
    return ( 
        <h2>{timer}</h2>
    );
}
 
export default Timer;