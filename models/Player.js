const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlayerSchema = Schema({
    socketID: { type: String },
    colour: {
        type: String, 
        default: ''
    },
    isHosting: {
        type: Boolean,
        default: false
    },
    nickName: {
        type: String
    },
    room: {
        type: String
    }
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;