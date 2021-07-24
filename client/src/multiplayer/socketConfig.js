import io from 'socket.io-client';
//const socket = io('/'); for deploymnet, io('http://localhost:3001') for local 
const socket = io('/');
export default socket;