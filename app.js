const express = require('express');
const app = express();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirame, 'client/build', 'index.html'));
    });
}
const server = app.listen(port, () => console.log('listening'));
const io = socketio(server, {
    cors: {
        origin:'*'
    }
}); 

const Game = require('./models/Game');
const Player = require('./models/Player');

require('dotenv').config();
const db = process.env.CONNECTION_STRING;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.catch(err => console.log(err));

const turnTime = 10; // how many seconds for each turn

const getPlayers = async (game) => {
    const players = [];
    for (let i = 0; i < game.players.length; i++) {
        const playerID = game.players[i];
        const player = await Player.findById(playerID);
        players.push(player);
    }
    return players;
}

const leaveGame = async (socket) => {
    try {
        const player = await Player.findOne({ socketID: socket.id });
        if (player === null)
            return;

        const gameID = player.room.toString();
        await Player.findByIdAndDelete(player._id);
        const game = await Game.findById(player.room);
        game.players.remove(player._id);
        game.hasStarted = false;

        if (game.players.length == 0) {
            // if there are no players left, remove the game from the database
            await Game.findByIdAndDelete(game._id);
        } else {
            // update the current host of the room?
            const lastPlayer = await Player.findById(game.players[0]._id);
            lastPlayer.isHosting = true;
            await lastPlayer.save();
            const playerArray = [ lastPlayer ];
            
            socket.leave(gameID);
            io.in(gameID).emit('update-game-and-players', {game, players: playerArray});
            io.in(gameID).emit('message', player.nickName + ' has left!');
            await game.save();
        }     
    }
    catch(err) {
        console.log(err);
    }
}

io.on('connection', socket => {
    socket.on('create-game', async ({ nickName }) => {
        try {
            // create player
            const player = new Player({
                socketID: socket.id,
                isHosting: true,
                nickName,
            });
            // create room
            const game = new Game({ players: [ player._id ] });
            game.turnTime = turnTime;
            player.room = game._id;
            await player.save();
            await game.save();
            
            const players = [ player ];
            const gameID = game._id.toString();
            socket.join(gameID);

            socket.emit('update-game-and-players', {game, players});
            socket.emit('join-game');
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('join-game', async ({ nickName, gameID }) => {
        try {
            // check if ID is valid
            if (!mongoose.isValidObjectId(gameID)) {
                socket.emit('error', 'Invalid Room ID');
                return;
            }
            const game = await Game.findById(gameID);
            // check if game room exists
            if (game === null) {
                socket.emit('error', 'Room does not exist');
                return;
            }
            // check if game is open
            if (game.players.length === 2) {
                socket.emit('error', 'Room is full');
                return;
            }
            // create player
            const player = new Player({
                socketID: socket.id,
                nickName,
                room: game._id
            });
            game.players.push(player._id);
            
            await player.save();
            await game.save();

            const players = await getPlayers(game);
            socket.join(gameID);

            socket.emit('update-game-and-players', {game, players});
            socket.emit('join-game');

            socket.broadcast.to(gameID).emit('message', nickName + ' has joined!');
            socket.broadcast.to(gameID).emit('update-game-and-players', {game, players});
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('message', async ({ gameID, message }) => {
        try {
            socket.broadcast.to(gameID).emit('message', message);
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('start-game', async ({ gameID }) => {
        try {
            const game = await Game.findById(gameID);
            // update game
            game.hasStarted = true;
            game.turn = (Math.floor(Math.random() * 2) === 0) ? 'red' : 'yellow';
            await game.save();

            const player1 = await Player.findById(game.players[0]);
            const player2 = await Player.findById(game.players[1]);
            player1.colour = (Math.floor(Math.random() * 2) === 0) ? 'red' : 'yellow';
            player2.colour = player1.colour === 'red' ? 'yellow' : 'red';
            await player1.save();
            await player2.save();

            const players = [player1, player2];
            io.in(gameID).emit('restart');
            io.in(gameID).emit('update-timer', turnTime);
            io.in(gameID).emit('update-game-and-players', {game, players});
        } catch(err) {
            console.log(err)
        }
    });

    socket.on('update-board', async ({ gameID, row, col, colour }) => {
        try {
            socket.broadcast.to(gameID).emit('update-board', { row, col, colour });
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('change-turn', async ({ gameID }) => {
        try {
            const game = await Game.findById(gameID);
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            await game.save();
            io.in(gameID).emit('update-timer', turnTime);
            // make sure timer is reset for client by emitting game back to client as well
            io.in(gameID).emit('update-game', game);
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('game-over', async ({ gameID, result }) => {
        try {
            const game = await Game.findById(gameID);
            game.hasStarted = false;
            await game.save();
            socket.broadcast.to(gameID).emit('game-over', result);
            socket.broadcast.to(gameID).emit('update-game', game);
            io.in(gameID).emit('remove-timer');
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('leave-game', () => {
        leaveGame(socket);
    });

    socket.on('disconnect', async () => {
        leaveGame(socket);
    });
});
