import { useEffect } from 'react';
 
const Timer = ({ timer, setTimer, isTimerPaused, startTime }) => {
    useEffect(() => {
        if (isTimerPaused) {
            return;
        }
        const time = new Date().getTime();
        const timeElapsed = (time - startTime) / 1000; // time elapsed since turn started in seconds
        let intervalTime = 1000 * (1 - (timeElapsed - Math.floor(timeElapsed))); // time till next whole second decrease in time remaining
        const interval = setTimeout(() => {
            setTimer(timer => timer - 1);
        }, intervalTime);
        return () => clearTimeout(interval);
    });
    return ( 
        <h2>{timer < 0 ? 0 : timer}</h2>
    );
}
 
export default Timer;