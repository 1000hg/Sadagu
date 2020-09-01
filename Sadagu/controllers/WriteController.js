var Write = require("../models/Write");
var Usr = require("../models/User");
var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');

var writeController = {};




writeController.submit = function (req, res) {
	var user = req.session.user_id;

	//req.body.img.contentType = 'image/png';
	req.body.writer = user;
	req.body.maxPrice = req.body.minPrice;
	req.body.buyCount = 0;
	req.body.watcher = 0;
	req.body.buyer = "없음";
	//console.log(req.body);
	var writer = new Write(req.body);

	writer.img.data = fs.readFileSync(req.file.path);
	writer.img.contentType = 'image/png';
	//console.log(writer);


	writer.save(function (err) {

		if (err) {
			console.log("Failed save");
			res.render("../views/Users/err4");
		} else {
			console.log("Success save");
			Write.find({}, function (err, write) {
				if (!err) {
					res.redirect('/users/main')
				} else {
					console.log(err);
				}
			});
			//res.redirect("/users/login");
		}
	})

}


writeController.delete = function (req, res) {

	var writeId = req.params.id;

	Write.remove({
		_id: writeId
	}, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("writer deleted");
			res.redirect("/users/mypage/1");
		}
	})
}


writeController.edit = function (req, res) {

	var writeId = req.params.id;
	console.log(writeId);

	Write.findOne({
		_id: writeId
	}, function (err, write) {
		if (err) {
			console.log(err);
		} else {
			console.log(write);
			if (req.session.logined)
				res.render('../views/Users/writeEdit', {
					write: write
				});
			else
				res.redirect("/users/login");
		}
	})
}



writeController.editWrite = function(req, res){
	
	var writeId = req.params.writeId;
	
	var writer = new Write(req.body);
	
	console.log(writer);

	writer.img.data = fs.readFileSync(req.file.path);
	writer.img.contentType = 'image/png';
	
	
	
	Write.findOneAndUpdate({
		_id: writeId
	}, {
		$set: {
			name : writer.name,
			explain : writer.explain,
			deliverPrice : writer.deliverPrice,
			deliverWay : writer.deliverWay,
			maxTime : writer.maxTime,
			minPrice : writer.minPrice,
			unit : writer.unit,
			origin : writer.origin,
			count : writer.count,
			img : { data : writer.img.data, contentType : writer.img.contentType}
		}
	}, {
		new: true
	}, function (err, doc) {
		if (err)
			console.log(err);
		else {
			Write.find({}, function (err, write) {
				if (!err) {
					res.redirect('/users/mypage/1');
				} else {
					console.log(err);
				}
			});
		}

	})
}


writeController.update = function (req, res) {

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
			console.log(err);
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



writeController.read = function (req, res) {


	Write.findOne({
		_id: req.params.id
	}, function (err, write) {

		if (err) console.log("505Error");

		else if (!write) return res.status(404).json({
			error: 'write not found'
		});
		else {
			var watcher = write.watcher + 1;
			
			Write.findOneAndUpdate({
				_id: req.params.id
			}, {
				$set: {
					watcher: watcher
				}
			}, {
				new: true
			}, function (err, doc) {
				if (err)
					console.log(err);
				else {
					console.log("success");
				}

			})
			

			let today = new Date();

			var t1_Time = new Date(moment(today).format('YYYY-MM-DD hh:mm:ss'));
			var t2_Time = new Date(moment(write.maxTime).format('YYYY-MM-DD hh:mm:ss'));

			var time = compareTime(t1_Time, t2_Time);

			var t1_Date = new Date(moment(today).format('YYYY-MM-DD'));
			var t2_Date = new Date(moment(write.maxTime).format('YYYY-MM-DD'));

			var date = compareDate(t1_Date, t2_Date);


			if (req.session.logined)
				res.render('../views/Users/reader', {
					write: write,
					moment: moment,
					time: time,
					date: date
				});
			else
				res.redirect("/users/login");
		}

	})

}


function countDown(maxTime) {

	var timeInfo = {}

	setInterval(function () {
		var now = new Date().getTime();
		var distance = maxTime - now;

		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		timeInfo.days = days;
		timeInfo.hours = hours;
		timeInfo.minutes = minutes;
		timeInfo.seconds = seconds;


		if (distance < 0) {
			clearInterval(x);
		}
	}, 1000);
	
	console.log(timeInfo);
	return timeInfo;
}



function compareTime(t1, t2) {
	var value = t2 - t1;

	var hour = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minute = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
	var second = Math.floor((value % (1000 * 60)) / 1000);

	console.log(hour + "시간 " + minute + "분 " + second + "초");

	var time = {
		hour: hour,
		minute: minute,
		second: second
	}

	return time;

}

function compareDate(t1, t2) {
	var value = t2 - t1;


	var daySecond = 24 * 60 * 60 * 1000;

	var date = {
		day: parseInt(value / daySecond)
	}

	return date;

}



writeController.search = function (req, res) {

	var page = req.params.page;
	var writeInfo = {
		page_num: 4
	};
	writeInfo.page = Number(page);
	writeInfo.name = req.body.name;

	var name = new RegExp(req.body.name);


	Write.count({
		name: name
	}, function (err, result) {
		Write.find({
			name: name
		}, function (err, write) {
			if (!err) {
				writeInfo.length = result;
				console.log(write);
				res.render('../views/Users/writerSearch', {
					write: write,
					writeInfo: writeInfo
				});
			} else {
				console.log(err);
			}
		});
	});

}



writeController.buy = function (req, res) {


	console.log("here");
	var writeId = req.params.id;
	var money = req.body.money;

	Write.findOne({
		_id: writeId
	}, function (err, write) {
		if (!err) {
			if (Number(money) < write.unit) {
				res.render("../views/Users/err5");
			} else {
				var buyCount = write.buyCount + 1;
				var addUnit = write.maxPrice + Number(money);
				Write.findOneAndUpdate({
					_id: write._id
				}, {
					$set: {
						maxPrice: addUnit,
						buyer: req.session.user_id,
						buyCount: buyCount
					}
				}, {
					new: true
				}, function (err, doc) {
					if (err)
						console.log(err);
					else
						res.redirect('/users/writer/read/' + writeId);
				});
			}

		}
	})
}



writeController.buyList = function (req, res) {

	var id = req.session.user_id;

	var page = req.params.page;
	var writeInfo = {
		page_num: 2
	};
	writeInfo.page = Number(page);


	Write.find({
		buyer: id
	}, function (err, write) {
		Write.count({}, function (err, result) {
			if (req.session.logined) {
				writeInfo.length = result;
				console.log(write[0]);
				res.render('../views/Users/buyList', {
					writeInfo: writeInfo,
					write: write
				});
			} else
				res.redirect("/users/login");
		});
	});



}



module.exports = writeController;
