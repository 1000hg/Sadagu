var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name : {type: String, required: true},
	id : {type: String, required: true, unique: true},
	password : {type: String, required: true, unique: true},
	birth : {type: String, required: true},
	phoneNum : {type: String, required: true, unique: true},
	eMail : {type: String, required: true, unique: true},
	account : {type: String, required: true, unique: true},
	address : {type: String, required: true},
	credit : {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema); 