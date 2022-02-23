var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
const fs = require('fs');
var crypto = require("crypto");
var FileStore = require('session-file-store')(session);


var client = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'dlrlals970425',
  database : 'smarthome'
});

client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.is_logined == true){
    res.render('main',{
      is_logined : req.session.is_logined,
      name : req.session.name
    });
  }else{
    res.render('login', { is_logined: false });
  }
});

router.post('/findUser', function(req, res, next) {
  res.render('findUser');
});

router.get('/regist', function(req, res, next) {
  console.log('회원가입 페이지');
  res.render('regist');
});

router.post('/regist', function(req, res, next) {
  console.log('회원가입 하는중');
  const body = req.body;
  const id = body.id;
  const password = body.password;
  const name = body.name;
  const birth = body.birth + body.month + body.day;
  const number = body.pnumber;
  const email = body.email;

  client.query('select * from login where id=?',[id],(err,data) =>{
    if(data.length == 0){
      console.log('회원가입 성공');
      client.query('insert into login values(?,?,?,?,?,?)',[id,password, name,birth, number,email]);
      res.redirect('/');
    }else{
	console.log('회원가입 실패');
	res.redirect('/');
	}
  })
});

module.exports = router;
