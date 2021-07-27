import { useState, useEffect, useRef } from 'react';
import socket from '../../socketConfig';
import '../../css/Messages.css';

const Messages = ({ gameID, nickName }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        socket.on('message', msg => {
            setMessages(messages => messages.concat([ msg ]));
        });
        return () => socket.off('message');
    }, []);
    useEffect(scrollToBottom,
        [messages]
    );
    const onSubmit = (e) => {
        e.preventDefault();
        if (input === '')
            return;
        const message = nickName + ': ' + input;
        setMessages(messages => messages.concat([ message ]));
        setInput('');
        socket.emit('message', { gameID, message });
    }
    return (
        <div id="message-div">
            <form onSubmit={onSubmit}>
                <label htmlFor="message">Send Message: </label>
                <br></br>
                <input autoComplete="off" type="text" id="message" value={input} onChange={(e) => setInput(e.target.value)} />
                <button>Send</button>
            </form>
            <div id="messages">
                {messages.map((message, index) => 
                    <p key={index}>{message}</p>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

export default Messages;