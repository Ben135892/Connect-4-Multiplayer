import { useState } from 'react';
import socket from './socketConfig';
import './css/Form.css'

const CreateGame = () => {
    const [nickName, setNickName] = useState('');
    const [clicked, setClicked] = useState(false);
    const onChange = e => {
        setNickName(e.target.value);
    }  
    const onSubmit = e => {
        e.preventDefault();
        setClicked(true);
        socket.emit('create-game', { nickName });
    }
    if (clicked)
        return null;
    return ( 
        <div className="form">
            <h1>Create Game</h1>
            <form onSubmit={onSubmit}>
                <label htmlFor="nickName">Enter Nick Name</label>
                <input onChange={onChange} type="text" id="nickName" />
                <button>Submit</button>
            </form>
        </div>
    );
}
 
export default CreateGame;