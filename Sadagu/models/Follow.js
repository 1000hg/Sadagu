var mongoose = require('mongoose');

var FollowSchema = new mongoose.Schema({
	followId : {type: String, required: true},
	followerId : {type: String, required: true}
});

module.exports = mongoose.model('Follow', FollowSchema); 