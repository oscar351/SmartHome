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
  port: 3306,
  user : 'root',
  password : '1234',
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
  const id = req.id;
  const password = req.password;
  const name = req.name;
  const date_of_birth = req.birth + req.month + req.day;
  const phone_number = req.pnumber;
  const email = req.email;

  client.query('select * from login where id=?',[id],(err,data) =>{
    if(data.length == 0){
      console.log('회원가입 성공');
      client.query('insert into login values(?,?,?,?,?,?)',[id,password, name, date_of_birth, phone_number,email]);
      res.redirect('/');
    }else{
      console.log('회원가입 실패');
      res.send('<script>alert("회원가입 실패");</script>');
      res.redirect('/login');
    }
  })
});

module.exports = router;
