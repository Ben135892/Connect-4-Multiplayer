import { useEffect } from 'react';
 
const Timer = ({ timer, setTimer }) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    });
    return ( 
        <h2>{timer}</h2>
    );
}
 
export default Timer;