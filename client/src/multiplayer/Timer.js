import { useEffect } from 'react';
 
const Timer = ({ timer, setTimer }) => {
    useEffect(() => {
        const interval = setTimeout(() => {
            setTimer(timer => timer - 1);
        }, 1000);
        return () => clearTimeout(interval);
    });
    return ( 
        <h2>{timer < 0 ? 0 : timer}</h2>
    );
}
 
export default Timer;