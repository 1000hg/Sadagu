var Write = require("../models/Write");
var Usr = require("../models/User");
var express = require('express');
var router = express.Router();

var writeController = {};




writeController.submit = function(req, res){
	var today = new Date()
	var user = req.session.user_id;
	req.body.writer = user;
	req.body.url = "aa";
	req.body.maxPrice = "0";
	req.body.minTime = today.toLocaleString();
	//console.log(req.body);
	var writer = new Write(req.body);
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



module.exports = writeController;

