const cheerio = require('cheerio');
const request = require('request');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');


var RealTimePriceController = {};


RealTimePriceController.move = function(req, res){
	if (req.session.logined)
		res.render('../views/Users/realTimePrice');
	else 
		res.render('../views/Users/login')
}


RealTimePriceController.search = function(req, res){
	var word = req.query.name;
	
 	var goodsArray = new Array();
    var goodsInfo = new Object();

	var url = 'https://www.gsshop.com/shop/search/main.gs?lseq=392814&tq=' + encodeURI(word);

	const request = require('request');
	const cheerio = require('cheerio');


	request(url, function (error, response, body) {
		if(error) throw error
		var $ = cheerio.load(body);

		$('.prd-info').each(function(item){
			var name = $(this).find('.prd-name').text().trim(); var price = $(this).find('.set-price').text().trim(); 
			
			goodsInfo.name = name;
			goodsInfo.price = price;
			
			goodsArray.push(goodsInfo);
			
			goodsInfo = new Object();

		});

		res.render("../views/Users/goodsSearch.ejs", {goods:goodsArray});

	});
}




module.exports = RealTimePriceController;