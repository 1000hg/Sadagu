var express = require('express');
var router = express.Router();
var user = require('../controllers/UserController.js');
var write = require('../controllers/WriteController.js');



router.get('/login', user.login);

router.post('/login', user.postLogin);

router.post('/logout', user.logout);

router.get('/main', user.main);

router.get('/create', user.create);

router.post('/save', user.save);

router.get('/find', user.find);

router.post('/info', user.info);

router.get('/mypage', user.mypage);

router.get('/writer', user.writer);

router.post('/writer/submit', write.submit);

router.post('/writer/delete/:id', write.delete);

router.get('/writer/read/:id', write.read);


//router.post('/check', user.check);


module.exports = router;