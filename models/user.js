const mongoose = require('mongoose');

const { Schema } = mongoose;

//create schema for user collection
const userSchema = new Schema({
	googleId: String,
	credits: { type: Number, default: 0 },
});

//create model class
mongoose.model('users', userSchema);
