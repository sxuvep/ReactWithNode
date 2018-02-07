const mongoose = require('mongoose');

const { Schema } = mongoose;

//create schema for user collection
const userSchema = new Schema({
	googleId: String,
});

//create model class
mongoose.model('users', userSchema);
