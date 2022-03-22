var fs = require('fs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
var crypto = require("crypto");
var FileStore = require('session-file-store')(session);
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('mysql');

var client = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'dlrlals970425',
  database : 'smarthome'
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var raspi = require('./routes/raspi');
const router = require('./routes/index');
var retrofitRouter = require('./routes/retrofit'); // 레트로핏

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'blackzat',
  resave: false,
  saveUninitialized: true,
  store : new FileStore()
}));

app.use('/', indexRouter);
app.use('/', raspi);
app.use('/users', usersRouter);
app.use('/retrofit', retrofitRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server=app.listen(8888, function(){
  setInterval(function() {
    var newDate = new Date();
    var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
    request('http://112.221.103.174:8888/Humid', function (error, response, body) {
        if(body == undefined || body == null){
          console.log('에러')
        }else{
          const arr = (body).split(" ");
          // res.send(arr); //Display the response on the website
          client.query('insert into data values(?,?,?)',[time, arr[0], arr[1]]);
          // console.log(time + ", " + arr); // Print the data received
        }
      });

    request('http://112.221.103.174:8888/dust', function (error, response, body) {
      if (body == undefined || body == null) {
        console.log('에러')
      } else {
        const arr = (body).split(" ");
        // res.send(arr); //Display the response on the website
        client.query('insert into dust values(?,?,?)',[time, arr[1], arr[0]]);
        // console.log(time + ", " + arr); // Print the data received
      }
    });
  }, 3000);

  // setInterval(function() {
  //   var newDate = new Date();
  //   var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  //   request('http://112.221.103.174:8888/dust', function (error, response, body) {
  //       if(body == undefined || body == null){
  //         console.log('에러')
  //       }else{
  //         const arr = (body).split(" ");
  //         // res.send(arr); //Display the response on the website
  //         // client.query('insert into data values(?,?,?)',[time, arr[0], arr[1]]);
  //         console.log(time + ", " + arr); // Print the data received
  //       }
  //     });
  // }, 3000);
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
