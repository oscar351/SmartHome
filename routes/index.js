var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
const fs = require('fs');
var crypto = require("crypto");
var FileStore = require('session-file-store')(session);
const http = require('http');


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

router.post('/', function(req,res,next){
  const body = req.body;
  const user_id = body.user_id;
  const user_password = body.user_password;

  client.query('select count(*) cnt from login where id=? and password=?',[user_id, user_password],(err,data)=>{
    // 로그인 확인
    var cnt = data[0].cnt;
    if(cnt == 1){
        console.log('로그인 성공');
        // 세션에 추가
        req.session.is_logined = true;
        req.session.name = data.name;
        req.session.id = data.id;
        req.session.password = data.password;
        req.session.save(function(){ // 세션 스토어에 적용하는 작업
            res.render('main',{ // 정보전달
                name : data[0].name,
                id : data[0].id,
                is_logined : true
            });
        });
    }else{
        console.log('로그인 실패');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<script>alert("일치한 정보가 없습니다. 다시 입력하여주세요.")</script>');
        res.write('<script>window.location="../"</script>');
        res.end();
    }
});
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
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("회원가입이 완료되었습니다!")</script>');
      res.write('<script>window.location="../"</script>');
      res.end();
    }else{
	console.log('회원가입 실패');
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("회원가입에 실패하였습니다. 다시 한번 확인해주세요!")</script>');
      res.write('<script>window.location="../regist"</script>');
      res.end();
	}
  })
});
router.get('/logout',(req,res)=>{
  console.log('로그아웃 성공');
  req.session.destroy(function(err){
      // 세션 파괴후 할 것들
      res.redirect('/');
  });
});
module.exports = router;
