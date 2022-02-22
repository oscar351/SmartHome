var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/findUser', function(req, res, next) {
  res.render('findUser');
});

router.post('/regist', function(req, res, next) {
  res.render('regist');
});

module.exports = router;
