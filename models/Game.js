const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = Schema({
    _id: { type: String},
    turn: { type: String }, // red or yellow
    turnTime: { type: Number },
    turnID: { 
        type: Number, 
        default: 0 
    },
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