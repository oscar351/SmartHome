var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var request = require('request');
var session = require('express-session');
const fs = require('fs');
var crypto = require("crypto");
var FileStore = require('session-file-store')(session);
var app = express();
const http = require('http').Server(app);
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const log = console.log;

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
      name : req.session.name,
      address : req.session.address
    });
  }else{
    res.render('login', { is_logined: false });
  }
});

router.post('/', function(req,res,next){
  const body = req.body;
  const user_id = body.user_id;
  const user_password = crypto.createHash('sha512').update(body.user_password).digest('base64');

  client.query('select count(*) cnt from login where id=? and password=?',[user_id, user_password],(err,data)=>{
    // 로그인 확인
    var cnt = data[0].cnt;
    if(cnt == 1){
        console.log('로그인 성공');
        // 세션에 추가
        client.query('select * from login where id=? and password=?',[user_id, user_password],(err,data)=>{
          req.session.is_logined = true;
          req.session.name = data[0].name;
          req.session.id = data[0].id;
          req.session.password = data[0].password;
          req.session.address = data[0].address;
          req.session.save(function(){ // 세션 스토어에 적용하는 작업
              res.render('main',{ // 정보전달
                  name : data[0].name,
                  id : data[0].id,
                  is_logined : true,
                  address : data[0].address
              });
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

router.get('/findUser', function(req, res, next) {
  console.log('아이디 / 비밀번호 찾기 페이지');
  res.render('findUser');
});

router.post('/findid', function(req, res, next) {
  const body = req.body;
  const email = body.findemail;

  client.query('select * from login where email=?',[email],(err,data) =>{
    if(data.length == 0){
      console.log('데이터 없음');
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("일치하는 정보가 없습니다.")</script>');
      res.write('<script>window.location="../findUser"</script>');
      res.end();
    }else{
	console.log('데이터 검색 완료!');
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("회원님의 아이디 : ' + data[0].id + '")</script>');
      res.write('<script>window.location="../findUser"</script>');
      res.end();
	}
  });
});

router.post('/findpw', (req,res)=>{
  var userid = req.body.userID;
  var username = req.body.userNAME;
  var result = 0;

  client.query('select * from login where id=? and name=?', [userid, username],(err,data)=>{
    if(data.length == 0){
      result = 0;
    }else{
      result = 1;
    }
    res.json(result);
  });
});

router.post('/new_password', function(req, res, next) {
  const body = req.body;
  var userid = body.findID;
  var password1 = crypto.createHash('sha512').update(body.new_password1).digest('base64');

  client.query('UPDATE login SET password=? WHERE id=?',[password1, userid],(err,data) =>{
    if(err){
      console.log(err);
    } else {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.write('<script>alert("새로운 비밀번호 저장이 완료되었습니다!")</script>');
      res.write('<script>window.location="../"</script>');
      res.end();
    }
  });
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
  const birth = body.birth;
  const number = '010' + body.pnumber;
  const address = body.h_area2;
  const email = body.email + '@' + body.email2;
  const kpassword = crypto.createHash('sha512').update(password).digest('base64');

  client.query('select * from login where id=?',[id],(err,data) =>{
    if(data.length == 0){
      console.log('회원가입 성공');
      client.query('insert into login values(?,?,?,?,?,?,?)',[id,kpassword, name,birth, number,address,email]);
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

router.post('/checkid', (req,res)=>{
  var userID = req.body.userID;
  var result = 0;

  client.query('select * from login where id=?', [userID],(err,data)=>{
    if(data.length == 0){
      result = 1;
    }else{
      result = 0;
    }
    res.json(result);
  });
});

router.post('/weather', (req,res)=>{
  var address = req.session.address;
  const getHtml = async () => {
    try {
      return await axios.get(`https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=${encodeURIComponent(address+"날씨")}`);
    } catch (error) {
      console.error(error);
    }
  };

  getHtml()
    .then(html => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      const weatherdata = $('#main_pack > section.sc_new.cs_weather_new._cs_weather > div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div').children('div.weather_info');

      weatherdata.each(function(i, elem) {
        ulList[i] = {
          title: $(this).find('div > div.weather_graphic > div.temperature_text').text(),
          nalsi: $(this).find('div > div.temperature_info > p > span.weather.before_slash').text(),
          humi: $(this).find('div > div.temperature_info > dl > dd:nth-child(4)').text(),
          wind: $(this).find('div > div.temperature_info > dl > dd:nth-child(6)').text(),
          munji: $(this).find('div > div.report_card_wrap').text(),
      };
      });
      const data = {
        ondo: ulList[0].title,
        nalsi: ulList[0].nalsi,
        humi : ulList[0].humi,
        wind : ulList[0].wind,
        munji : ulList[0].munji,
        address1 : req.session.address
      };
      res.json(data);
      return data;
    })
    .then((res) => log(res));
});

// ORDER BY Time DESC LIMIT 1
router.post('/getChartData', function(req, res) {
  client.query('SELECT * FROM data ORDER BY Time DESC LIMIT 1',(err,data) =>{
    if(err){
      console.log('에러');
    }
      res.json(data);
  });
});

router.post('/getChartData1', function(req, res) {
  client.query('SELECT * FROM data',(err,data) =>{
    if(err){
      console.log('에러');
    }
    res.json(data);
  });
});

router.get('/logout',(req,res)=>{
  console.log('로그아웃 성공');
  req.session.destroy(function(err){
      // 세션 파괴후 할 것들
      res.redirect('/');
  });
});
module.exports = router;
