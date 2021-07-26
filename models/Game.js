const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = Schema({
    joinID: { type: String },
    turn: { type: String },
    turnTime: { type: Number },
    turnID: { type: Number, default: 0 },
    turnStartTime: { type: Number },
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