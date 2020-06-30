var mongoose = require('mongoose');

var WriteSchema = new mongoose.Schema({
	img: { data: Buffer, contentType: String },
	minPrice : {type: String, required: true},
	maxPrice : {type: Number, required: true},
	unit : {type: Number, required: true},
	minTime : {type: Date, required: true},
	maxTime : {type: Date, required: true},
	explain : {type: String, required: true},
	origin : {type: String},
	count : {type: String, required: true},
	name : {type: String, required: true},
	deliverWay : {type: String, required: true},
	deliverPrice : {type: String},
	bindingWay : {type: String},
	writer : {type: String, required: true},
	buyer : {type: String},
	watcher : {type: Number},
	buyCount : {type:Number}
	
});

module.exports = mongoose.model('Write', WriteSchema); 




//url 이미지 여러 장 가능 최대 3장


//minPrice 최소 가격(입찰 전 가격)
//maxPrice 최대 가격(현재 가격 겸 낙찰가)
//unit 최소 상승액 단위


//minTime 입찰 시작 시간
//maxTime 입찰 종료 시간


//explain 부가 설명



//origin 원산지
//count 재고 수량
//name 물품 이름


//deliverWay 베송 방법
//deliverPrice 배송 비용


//bindingWay 입찰 방식


//writer 작성자
//buyer 구매자
