import io from 'socket.io-client';
//const socket = io('/'); for deploymnet, io('http://localhost:3001') for local testing
const socket = io(process.env.PORT ? '/' : 'http://localhost:3001');
export default socket;