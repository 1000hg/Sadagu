var User = require("../models/User");

var userController = {};



userController.main = function(req, res){
	res.render("../views/Users/main");
}

userController.create = function(req, res){
	res.render("../views/Users/create");
}


userController.save = function(req, res){
	var user = new User(req.body);
	
	user.save(function(err){
		if(err){
			var e = "";
			if(err.code == 11000){
				e = "User already exists";
				console.log(e);
			}
			console.log("Failed save");
			res.redirect("/users/create");
		}
		else
		{
			console.log("Success save");
			saveUserInfo(user);
			res.redirect("/users");
		}
	})
}

function saveUserInfo(user){
	var info = {id: user._id, name: user.name, birth: user.birth, phoneNum: user.phoneNum, id: user.id, password: user.password, eMail: user.eMail, account: user.account, address: user.address}
	
	var user = new User(info);
		
	user.save(function(err){
		if(err){
			
			if(err.code == 11000){
				console.log("Character does not exist");
			}
			
			console.log("Failed save");
		}
		else{
			console.log("Success save char");
		}
	
	})
}



module.exports = userController;
		