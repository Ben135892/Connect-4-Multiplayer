import { useState, useEffect } from 'react';
import socket from './socketConfig';
import '../css/Form.css'

const JoinGame = () => {
    const [nickName, setNickName] = useState('');
    const [gameID, setGameID] = useState('');
    const [error, setError] = useState(false);
    const [clicked, setClicked] = useState(false);
    useEffect(() => {
        socket.on('error', errorMessage => {
            setError(errorMessage);
            setClicked(false);
        });
        return () => socket.off('error');
    }, []);
    const onNameChange = e => {
        setNickName(e.target.value);
    }  
    const onIDChange = e => {
        setGameID(e.target.value);
    }
    const onSubmit = e => {
        e.preventDefault();
        setClicked(true);
        socket.emit('join-game', { nickName, gameID });
    }
    if (clicked)
        return null;
    return ( 
        <div className="form">
            <h1>Join Game</h1>
            <form onSubmit={onSubmit}>
                {error && <div class="error">{error}</div>}
                <label htmlFor="nickName">Enter Nick Name</label>
                <input autoComplete="off" value={nickName} onChange={onNameChange} type="text" id="nickName" />
                <label htmlFor="gameID">Enter Room ID</label>
                <input autoComplete="off" value={gameID} onChange={onIDChange} type="text" id="gameID" />
                <button>Submit</button>
            </form>
        </div>
    );
}

export default JoinGame;