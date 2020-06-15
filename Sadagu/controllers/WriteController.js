var Write = require("../models/Write");
var Usr = require("../models/User");
var express = require('express');
var router = express.Router();
var fs = require('fs');

var writeController = {};




writeController.submit = function(req, res){
	var today = new Date()
	var user = req.session.user_id;
	
	//req.body.img.contentType = 'image/png';
	req.body.writer = user;
	req.body.url = "aa";
	req.body.maxPrice = 0;
	req.body.buyCount = 0;
	req.body.watcher = 0;
	req.body.minTime = today.toLocaleString();
	//console.log(req.body);
	var writer = new Write(req.body);
	
	writer.img.data = fs.readFileSync(req.file.path);
	writer.img.contentType = 'image/png';
	//console.log(writer);

	
	writer.save(function (err) {
		if (err) {
			var e = "";
			if (err.code == 11000) {
				e = "User already exists";
				console.log(e);
			}
			
			console.log("Failed save");
			res.redirect("/users/login");
		} else {
			console.log("Success save");
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
			//res.redirect("/users/login");
		}
	})	
	
}


writeController.delete = function(req, res){
	
	var writeId = req.params.id;
	
	Write.remove({_id:writeId}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("writer deleted");
			res.redirect("/users/main");
		}
	})
}



writeController.read = function(req, res){


	Write.findOne({
		_id: req.params.id
	}, function (err, write) {

		if (err) console.log("505Error");

		else if (!write) return res.status(404).json({
			error: 'write not found'
		});
		else {
			if (req.session.logined)
				res.render('../views/Users/reader', {
					write: write
				});
			else
				res.redirect("/users/login");
		}

	})
	
}



writeController.search = function(req, res){
	
	
	var name = new RegExp(req.body.name);
	
	Write.find({name: name}, function(err, write) {
		if (!err) {
			res.render('../views/Users/writerSearch', {write:write});
		}
		else {
			console.log(err);
		}
	});
}



writeController.buy = function(req, res){
	
	var writeId = req.params.id;
	var money = req.body.money;
	
	Write.findOne({_id:writeId}, function(err, write){
		if (!err) {
			if(Number(money) < write.unit){
				console.log(money + "     " + write.unit);
				console.log("이건 좀..");
			}
			else{
				var addUnit = write.maxPrice + Number(money);
				Write.findOneAndUpdate({ _id: write._id }, { $set: { maxPrice: addUnit } }, { new: true }, function(err, doc) {
					if(err)
						console.log(err);
					else
						res.redirect('/users/writer/read/' + writeId);
				});
			}
	
}
	})}



module.exports = writeController;

