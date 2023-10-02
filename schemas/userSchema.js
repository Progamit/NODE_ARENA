const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: false,
        default: 200
    },
    spins: {
        type: Number,
        required: false,
        default: 0
    },
    lostAmount: {
        type: Number,
        required: false,
        default: 0
    },

});

const user = mongoose.model("type16_users_casino", userSchema);

module.exports = user;