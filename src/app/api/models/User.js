const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Agent", "User","Admin"],
    },
    nid: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
