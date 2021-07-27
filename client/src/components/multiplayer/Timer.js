import { useEffect } from 'react';
 
const Timer = ({ timer, setTimer, isTimerPaused, turnID }) => {
    useEffect(() => {
        if (isTimerPaused) {
            return;
        }
        const interval = setInterval(() => {
            setTimer(timer => timer - 1);
        }, 1000);
        return () => clearTimeout(interval);
    }, [isTimerPaused, setTimer, turnID]);
    return ( 
        <h2>{timer < 0 ? 0 : timer}</h2>
    );
}
 
export default Timer;