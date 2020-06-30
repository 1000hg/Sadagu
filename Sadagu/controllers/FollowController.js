var User = require("../models/User");
var Follow = require("../models/Follow");


var FollowController = {};


FollowController.follow = function(req, res){
	
	req.body.followId = req.session.user_id;
	req.body.followerId = req.params.writeId;
	
	var follow = new Follow(req.body);

	follow.save(function (err) {
		if (err) {

			if (err.code == 11000) {
				console.log("User does not exist");
			}

			console.log("Failed save");
		} else {
			console.log("Success save user");
			res.redirect("/users/sellerInfo/" + req.body.followerId + "/1");
		}

	})
	
	
}

FollowController.find = function(req, res){
	
	var id = req.session.user_id;
	
	Follow.find({followId: id}, function(err, follow) {
			if (!err) {
				console.log(follow);
				res.render('../views/Users/follow', {follow : follow});
			}
			else {
				console.log(err);
			}
		});
}


FollowController.unFollow = function(req, res){
	
	var follow = req.params.follow;
	var follower = req.params.follower;
	
	Follow.remove({followId : follow, followerId : follower}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("deleted");
			res.redirect("/users/main");
		}
	})
	
	
	
}






module.exports = FollowController;