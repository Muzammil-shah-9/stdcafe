const mongoose = require('mongoose');
const authSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:3,
        maxlength:45
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
});

const User = mongoose.model('User',authSchema);
module.exports = User;