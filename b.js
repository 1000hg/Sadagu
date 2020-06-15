var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgPath = 'C:\\Users\\user\\Desktop\\12\\sign\\beach.jpg';

mongoose.connect('mongodb://localhost:27017/test').then(() => console.log("connect Success")).catch((err) => console.log(err));

var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

var A = mongoose.model('A', schema);

mongoose.connection.on('open', function () {
  console.log('mongo is open');

  A.remove(function (err) {
    if (err) throw err;

    console.log('removed old docs');

    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
	  console.log(a.img.data);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.log('saved img to mongo');

      var app = express();
      app.get('/', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
        });
      });


      app.listen(3000, () => console.log(`http://localhost:${3000}`))
    });
  });

});