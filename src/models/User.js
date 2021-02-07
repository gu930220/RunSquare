const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, //중복불가
        required: true //필수 값임
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model('User', userSchema);