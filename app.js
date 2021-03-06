const express = require('express');
const app = express();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const randomize = require('randomatic');

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
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

const turnTime = 15; // how many seconds for each turn

// return array of player objects
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

        const gameID = player.room;
        await Player.findByIdAndDelete(player._id);
        const game = await Game.findById(player.room);
        game.players.remove(player._id);
        game.hasStarted = false;

        if (game.players.length == 0) {
            // if there are no players left, remove the game from the database
            await Game.findByIdAndDelete(game._id);
        } else {
            // update the current host of the room
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

            // create random game ID
            game._id = randomize('A', 6);
            player.room = game._id;
            await player.save();
            await game.save();
            
            const players = [ player ];
            socket.join(game._id);
            socket.emit('update-game-and-players', {game, players});
            socket.emit('join-game');
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('join-game', async ({ nickName, gameID }) => {
        try {
            const game = await Game.findById(gameID);
            // check if game room exists
            if (game === null) {
                socket.emit('error', 'Room does not exist');
                return;
            }

            // check if game is open (less than 2 players)
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
            socket.join(game._id);    

            io.in(game._id).emit('update-game-and-players', {game, players});
            socket.emit('join-game');
            socket.broadcast.to(game._id).emit('message', nickName + ' has joined!');
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

            // update player colours 
            const player1 = await Player.findById(game.players[0]);
            const player2 = await Player.findById(game.players[1]);
            player1.colour = Math.floor(Math.random() * 2) === 0 ? 'red' : 'yellow';
            player2.colour = player1.colour === 'red' ? 'yellow' : 'red';
            await player1.save();
            await player2.save();

            // update game
            game.hasStarted = true;
            game.turn = Math.floor(Math.random() * 2) === 0 ? 'red' : 'yellow';
            // make sure turnID is unique
            game.turnID++;
            await game.save();
        
            const players = [player1, player2];
            io.in(gameID).emit('restart');
            io.in(gameID).emit('update-game-and-players', {game, players});
            setTimeout(() => io.in(gameID).emit('make-move', { turnID: game.turnID }), 1000 * turnTime);
        } catch(err) {
            console.log(err)
        }
    });

    socket.on('change-turn-and-board', async ({ gameID, row, col, colour }) => {
        try {
            console.log(typeof gameID);
            const game = await Game.findById(gameID);
            game.turn = game.turn === 'red' ? 'yellow' : 'red';
            game.turnID++;
            await game.save();

            socket.broadcast.to(gameID).emit('update-board', { row, col, colour });
            io.in(gameID).emit('update-game', game);
            setTimeout(() => io.in(gameID).emit('make-move', { turnID: game.turnID }), 1000 * turnTime);
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('game-over-and-update-board', async ({ gameID, result, row, col, colour }) => {
        try {
            const game = await Game.findById(gameID);
            game.hasStarted = false;
            await game.save();

            socket.broadcast.to(gameID).emit('update-board', { row, col, colour });
            socket.broadcast.to(gameID).emit('game-over', result);
            socket.broadcast.to(gameID).emit('update-game', game);
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
