var User = require("../models/User");
var Write = require("../models/Write");
var express = require('express');
var router = express.Router();



var userController = {};




userController.login = function (req, res) {
	if (req.session.logined)
		res.render('../views/Users/main')
	else {
		res.render('../views/Users/login')
	}
}



userController.postLogin = function (req, res) {
	var id = req.body.id;
	var password = req.body.password;


	User.findOne({
		id: id,
		password: password
	}, function (err, user) {
		if (err) console.log("505Error");
		else if (!user) return res.status(404).json({
			error: 'user not found'
		});
		else {
			req.session.regenerate(function () {
				req.session.logined = true;
				req.session.user_id = id;

				/*res.render('../views/Users/main', {
					session: req.session
				})*/
				
				res.redirect('/users/main');

			})
		}

	});
}


userController.main = function(req, res) {
	
	Write.find({}, function(err, write) {
		if (!err) { 
			res.render('../views/Users/main',{
				write : write
			})
		}
		else {
			console.log(err);
		}
	});
}


userController.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/users/login');
}



userController.create = function (req, res) {
	res.render("../views/Users/create");
}


userController.save = function (req, res) {
	req.body.credit = 0;
	var user = new User(req.body);

	user.save(function (err) {
		if (err) {
			var e = "";
			if (err.code == 11000) {
				e = "User already exists";
				console.log(e);
			}
			
			console.log(err);
			
			console.log("Failed save");
			res.redirect("/users/create");
		} else {
			console.log("Success save");
			saveUserInfo(user);
			res.redirect("/users/login");
		}
	})
}

userController.find = function (req, res) {
	res.render("../views/Users/find");
}

userController.info = function(req, res){
	
	var name = req.body.name;
	var birth = req.body.birth;
	var phoneNum = req.body.phoneNum;
	var eMail = req.body.eMail;
	
	User.findOne({
		name: name,
		birth: birth,
		phoneNum: phoneNum,
		eMail: eMail
	}, function(err, user){
		
		if(err) console.log("505Error");
		
		
		else if (!user) return res.status(404).json({
			error: 'user not found'
		});
		
		else{
			res.render('../views/Users/info',{
				user: user
			});
		}
	})
}





userController.mypage = function (req, res) {
	
	var user = req.session.user_id;

	User.findOne({
		user: user.id
	}, function (err, user) {

		if (err) console.log("505Error");

		else if (!user) return res.status(404).json({
			error: 'user not found'
		});
		else {
			
			Write.find({writer:user.id}, function(err, write) {
			if (req.session.logined)
				res.render('../views/Users/mypage', {
					user: user, 
					write:write
				});
			else
				res.redirect("/users/login");
	});
		}

	})
}





userController.writer = function (req, res) {
	if (req.session.logined)
		res.render('../views/Users/writer');
	else
		res.redirect("/users/login");
}


userController.edit = function(req, res){
		if (req.session.logined)
			res.render('../views/Users/edit');
		else
			res.redirect("/users/login");
}


userController.test = function(req, res){
	res.render('../views/Users/test');

}

userController.test2 = function(req, res){
     console.log(req.file);
	console.log(req.file.filename);


}


userController.update = function(req, res){
	
	var user = req.session.user_id;
	
	var name = req.body.name;
	var password = req.body.password;
	var email = req.body.eMail;
	var address =req.body.address;
	var phoneNum = req.body.phoneNum;
	

	User.findOneAndUpdate({ user: user.id }, { $set: { name:name, password:password, eMail:email, address:address, phoneNum:phoneNum } }, { new: true }, function(err, doc) {
					if(err)
						console.log(err);
					else{
						Write.find({}, function(err, write) {
		if (!err) { 
			res.render('../views/Users/main',{
				write : write
			})
		}
		else {
			console.log(err);
		}
	});
					}
						
				})
}


/*userController.check = function(req, res){
	var id = req.body.id;
	var password = req.body.password;
	
	
	User.findOne({id: id, password: password}, function(err, user){
		if(err) console.log("505Error");
		else if(!user) return res.status(404).json({error: 'user not found'});
		else{
			console.log("login success");
			res.render("../views/Users/main");
		}
	})
}*/







function saveUserInfo(user) {
	var info = {
		_id: user._id,
		name: user.name,
		birth: user.birth,
		phoneNum: user.phoneNum,
		id: user.id,
		password: user.password,
		eMail: user.eMail,
		account: user.account,
		address: user.address,
		credit: user.credit
	}

	var user = new User(info);

	user.save(function (err) {
		if (err) {

			if (err.code == 11000) {
				console.log("User does not exist");
			}

			console.log("Failed save");
		} else {
			console.log("Success save user");
		}

	})
}




module.exports = userController;
