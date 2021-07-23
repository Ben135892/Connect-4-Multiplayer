const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = Schema({
    turn: { type: String },
    turnTime: { type: Number },
    hasStarted: {
        type: Boolean,
        default: false
    },
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }],
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;