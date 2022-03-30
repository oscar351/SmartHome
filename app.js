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

// FCM 추가

var FCM = require('fcm-node');
const { isGeneratorFunction } = require('util/types');
var serverKey = 'AAAAgjNrBOI:APA91bHh0dnAnekccfQiCVyP5Ik7z4pS36mGvTSOWrrKGh9CmTsHY5IDQCnDT_qjlLFdrYG7aposFvW1mar8hwtje06OW1IxXqD_aIUZqDI-lMVgHbNMy8TngVjl3gJqZ-0ECbx9JFdb';
var fcm = new FCM(serverKey);

var gas_message = {
    // to: 'fWldt3IlTv2cwwHj7lz-Ck:APA91bGHubkOJ0_Ve9j6gftqiNP6mHFtpYZM7hjxF_ZJclwUTeiQxDTRIu4tTuT79BKc5HsODV7X5NEM5DRR7bIFiIDrdAv0kLoLxWPxFrvy4RN97hFAw3wc3EzOxbDBLAQV5PkksoCY',
    // to: 'dsK2Vxv-QP-5qdGS6QpoyB:APA91bGTyitpuHgZRz6goxb0ubnjUmyAlJKoZNxvNIc6UgcB3g3SWdbUqQiXaRKoVQVHgp1GKdAQw9aRuwmudv1GXwW0gvIKCz2xYUy_UxUlURBBQdMKzIVbeNAhalcyZ_HwQiCz46_T',
    to: 'c5YoaFFSTG-iM5hjg2P7iQ:APA91bFEWAuXLbAnbu2kFF6IPP0S2lG9O1pdDTbbPP5RY4D2Fou6tGPgT_UAKKfng4rOLqBxTG4A8P1fY0r9r51z4s0-OnkczdXTDbr2xy_juNOdw-fWVnacqCda0EvGBL68BlvZ0UG_',

    // notification: {
    //     title: '화재시스템',
    //     body: '가스가 노출되었습니다!'
    // },

    data: {
        title: '🔥 화제시스템 경보발생 🚨',
        body: '가스 노출이 감지되었습니다!'
    },
    android: {
      ttl: 3600 * 1000, // 1 hour in milliseconds
      priority: 'high'
  },
};

var temp_message = {
  // to: 'fWldt3IlTv2cwwHj7lz-Ck:APA91bGHubkOJ0_Ve9j6gftqiNP6mHFtpYZM7hjxF_ZJclwUTeiQxDTRIu4tTuT79BKc5HsODV7X5NEM5DRR7bIFiIDrdAv0kLoLxWPxFrvy4RN97hFAw3wc3EzOxbDBLAQV5PkksoCY',
  // to: 'dsK2Vxv-QP-5qdGS6QpoyB:APA91bGTyitpuHgZRz6goxb0ubnjUmyAlJKoZNxvNIc6UgcB3g3SWdbUqQiXaRKoVQVHgp1GKdAQw9aRuwmudv1GXwW0gvIKCz2xYUy_UxUlURBBQdMKzIVbeNAhalcyZ_HwQiCz46_T',
  to: 'c5YoaFFSTG-iM5hjg2P7iQ:APA91bFEWAuXLbAnbu2kFF6IPP0S2lG9O1pdDTbbPP5RY4D2Fou6tGPgT_UAKKfng4rOLqBxTG4A8P1fY0r9r51z4s0-OnkczdXTDbr2xy_juNOdw-fWVnacqCda0EvGBL68BlvZ0UG_',

  // notification: {
  //     title: '화재시스템',
  //     body: '온도가 비정상적으로 높습니다!'
  // },

  data: {
      title: '🌡 화제시스템 경보발생 🚨',
      body: '온도가 비정상적으로 높습니다!'
  },
  android: {
    ttl: 3600 * 1000, // 1 hour in milliseconds
    priority: 'high'
},
};




var gas_count = 9; // n분에 한번 씩 FCM 보내게끔 카운터 구현

const gas_timer = setInterval(() => {
  gas_count++;
  request('http://112.221.103.174:8888/gas', function(error, response, body) {
    // if(body != undefined) {
    //   var n = 10;
    //   console.log(parseInt(body))
    //   console.log(n)
    //   console.log("test")
    // }
    // console.log("gas fcm test count : " + gas_count)
    if(parseInt(body) > 300 && gas_count >= 10) { // 가스 수치가 300 이상이면 
      fcm.send(gas_message, function(err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Sucessfully sent with response : ", response);
        }
    });
    gas_count = 0;
    }
  })
}, 10000) // 3초마다 반복


var temp_count = 4;
const temp_timer = setInterval(() => {
  temp_count++;
  request('http://112.221.103.174:8888/Humid', function(error, response, body) {
    // console.log("temp fcm test count : " + temp_count)

    if(body != undefined) {
    const arr = (body).split(" ");

    if(parseInt(arr[0]) > 50 && temp_count >= 5) {
      fcm.send(temp_message, function(err, response) {
        if (err) {
          console.log("Something has gone wrong!")
        } else {
          console.log("Sucessfully sent with response : ", response);
        }
      });
      temp_count = 0;
    }
  }
  })
}, 10000) // 3초마다 반복

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
  }, 10000);
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
