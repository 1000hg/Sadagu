var User = require("../models/User");
var Write = require("../models/Write");
var express = require('express');
var router = express.Router();
var fs = require('fs')
var ejs = require('ejs')

const nodemailer = require('nodemailer');
const app = express();



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
		if (err) res.render('../views/Users/err1');
		else if (!user) res.render('../views/Users/err1')
		else {
			req.session.regenerate(function () {
				req.session.logined = true;
				req.session.user_id = id;
				console.log(req.session.user_id);

				/*res.render('../views/Users/main', {
					session: req.session
				})*/

				res.redirect('/users/main');

			})
		}

	});
}


userController.main = function (req, res) {

	if (req.session.logined) {
		Write.find().sort('-watcher').exec(function (err, write1) {
			if (err) {
				console.log(err);
			} else {
				Write.find().sort('-buyCount').exec(function (err, write2) {
					if (err) {
						console.log(err);
					} else {
						res.render('../views/Users/main', {
							write1: write1,
							write2: write2
						})
					}
				})
			}
		})
	} else {
		res.render('../views/Users/login')
	}


}


userController.img = function (req, res) {

	Write.findOne({
		_id: req.params.id
	}, function (err, write) {
		if (err) console.log("505Error");

		else if (!write) return res.status(404).json({
			error: 'write not found'
		});
		else {
			res.contentType(write.img.contentType);
			res.send(write.img.data);
		}

	})
}


userController.logout = function (req, res) {
	req.session.destroy(function () {
		req.session;
	});
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
				res.render('../views/Users/err3.ejs')
			} else {
				res.render('../views/Users/err2.ejs')
			}

		} else {
			saveUserInfo(user);
			res.redirect("/users/login");
		}
	})
}

userController.find = function (req, res) {
	res.render("../views/Users/find");
}

userController.info = function (req, res) {


	var eMail = req.body.eMail;


	console.log(eMail);
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'alxzkf123@gmail.com', // gmail 계정 아이디를 입력
			pass: 'pairy1@3tail' // gmail 계정의 비밀번호를 입력
		}
	});

	User.findOne({
		eMail: eMail
	}, function (err, user) {

		if (err) console.log("505Error");

		else if (!user) res.render('../views/Users/err1')
		else {
			let mailOptions = {
				from: 'alxzkf', // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
				to: eMail, // 수신 메일 주소
				subject: '[Sadagu] Find Your account', // 제목
				text: 'your Id : ' + user.id + '\n\ and your Password : ' + user.password // 내용
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					res.render('../views/Users/err1');
				} else {
					console.log('Email sent: ' + info.response);
					res.redirect("/users/login");
				}
			});
		}
	})



}


userController.sellerInfo = function (req, res) {

	var id = req.params.id;

	var page = req.params.page;

	var writeInfo = {
		page_num: 4
	};
	writeInfo.page = Number(page);

	if (req.session.logined) {
		User.findOne({
			id: id
		}, function (err, user) {
			if (err) console.log("505Error");

			else if (!user) return res.status(404).json({
				error: 'user not found'
			});
			else {
				Write.find({
					writer: user.id
				}, function (err, write) {
					Write.count({}, function (err, result) {
						if (req.session.logined) {
							writeInfo.name = write.name;
							writeInfo.length = result;
							res.render('../views/Users/info', {
								user: user,
								write: write,
								writeInfo: writeInfo
							});
						} else
							res.redirect("/users/login");
					});
				});
			}
		})
	} else {
		res.render('../views/Users/login')
	}

}






userController.mypage = function (req, res) {

	var user = req.session.user_id;
	

	var page = req.params.page;
	var writeInfo = {
		page_num: 4
	};
	writeInfo.page = Number(page);

	User.findOne({
		id: user
	}, function (err, user) {

		if (err) console.log("505Error");
		else {
			Write.find({
				writer: user.id
			}, function (err, write) {
				if (req.session.logined) {
					res.render('../views/Users/mypage', {
						user: user,
						write: write,
						writeInfo: writeInfo
					});
				} else
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


userController.edit = function (req, res) {
	if (req.session.logined)
		res.render('../views/Users/edit');
	else
		res.redirect("/users/login");
}


userController.update = function (req, res) {

	var user = req.session.user_id;

	var name = req.body.name;
	var password = req.body.password;
	var email = req.body.eMail;
	var address = req.body.address;
	var phoneNum = req.body.phoneNum;


	User.findOneAndUpdate({
		user: user.id
	}, {
		$set: {
			name: name,
			password: password,
			eMail: email,
			address: address,
			phoneNum: phoneNum
		}
	}, {
		new: true
	}, function (err, doc) {
		if (err)
			res.render('../vuews/Users/err2')
		else {
			Write.find({}, function (err, write) {
				if (!err) {
					res.render('../views/Users/main', {
						write: write
					})
				} else {
					console.log(err);
				}
			});
		}

	})
}


userController.giveCredit = function (req, res) {

	var writeId = req.params.writeId;

	User.findOne({
		id: writeId
	}, function (err, user) {
		if (err) console.log("505Error");
		else if (!user) return res.status(404).json({
			error: 'user not found'
		});
		else {
			var credit = user.credit + 1;
			console.log(credit);
			User.findOneAndUpdate({
				id: writeId
			}, {
				$set: {
					credit: credit
				}
			}, {
				new: true
			}, function (err, doc) {
				if (err)
					console.log(err);
				else {
					Write.find({}, function (err, write) {
						if (!err) {
							res.redirect("/users/sellerInfo/" + user.id + "/1");
						} else {
							console.log(err);
						}
					});
				}

			})
		}
	});
}


userController.deletCredit = function(req, res){
	
	var writeId = req.params.writeId;
	
	User.findOne({
		id: writeId
	}, function (err, user) {
		if (err) console.log("505Error");
		else if (!user) return res.status(404).json({
			error: 'user not found'
		});
		else {
			var credit = user.credit - 1;
			console.log(credit);
			User.findOneAndUpdate({
				id: writeId
			}, {
				$set: {
					credit: credit
				}
			}, {
				new: true
			}, function (err, doc) {
				if (err)
					console.log(err);
				else {
					Write.find({}, function (err, write) {
						if (!err) {
							res.redirect("/users/sellerInfo/" + user.id + "/1");
						} else {
							console.log(err);
						}
					});
				}

			})
		}
	});
	
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
