import io from 'socket.io-client';
//const socket = io('/'); for deploymnet, io('http://localhost:3001') for local 
const socket = io('http://localhost:3001');
export default socket;