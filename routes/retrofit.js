const { query } = require('express');
var express = require('express');
var router = express.Router();
var crypto = require("crypto"); // 암호화
var request = require('request'); // request 추가된 코드
// const http = require('http').Server(app); // 추가된 코드 2

const mysql = require('mysql');
const { data } = require('jquery');
// const { request } = require('http'); // 원래 코드
const connection = mysql.createConnection({ // DB 연결
    host: 'localhost',
    user: 'root',
    password: 'dlrlals970425',
    database: 'smarthome'
});
x``
const app = express();

connection.connect();

router.get('/get', function (req, res, next) { // get통신 test
    console.log('GET 호출 / data : ' + req.query.data);
    console.log('path : ' + req.path);

    connection.query('select id from login where name = \'효석\'', (error, rows, fields) => {
        if (error) throw error;
        console.log('User info is: ', rows);
        res.send(rows[0].id)
    });
    // connection.end();
    // res.send('get success')
});

router.post('/post/login', function (req, res, next) { // 로그인
    var id = req.body.id;
    var pw = crypto.createHash('SHA512').update(req.body.pw).digest('base64'); // 비밀번호 암호화
    var sql = 'select * from login where id = ?'; // 회원 아이디에 해당되는 DB 검색

    // console.log('[App] Retrofit POST 호출 -> data : ' + id + "," + pw); // 받은 데이터 출력
    // console.log('path : ' + req.path);

    connection.query(sql, id, (error, rows) => {
        if (error) throw error;
        // console.log('User info is: ', rows); // DB정보 출력
        if (rows.length === 0) {
            res.send("없음")
            console.log("[App] 존재하지 않는 계정입니다.")
        }
        else if (pw == rows[0].password) {
            res.send("일치")
            console.log("[App] 로그인 성공!")
        }
        else {
            res.send("불일치")
            console.log("[App] 비밀번호가 일치하지 않습니다.")
        }
    });
});


router.post('/post/signup', function (req, res, next) { // 회원가입
    var id = req.body.id;
    var pw = crypto.createHash('SHA512').update(req.body.pw).digest('base64'); // 비밀번호 암호화
    var name = req.body.name;
    var birth = req.body.birth;
    var number = req.body.number;
    var address = req.body.address;
    var email = req.body.email;

    var sql1 = 'select * from login where id = ?' // id가 DB에 있는지 검색하는 sql문
    var sql2 = 'insert into login values(?, ?, ?, ?, ?, ?, ?)'; // DB에 저장하는 sql문
    var params = [id, pw, name, birth, number, address, email]; 

    // console.log('POST 호출 -> data : ' + req); // 받은 데이터 출력
    // console.log('path : ' + req.path);

    connection.query(sql1, id, (error, result) => {
        if(error) throw error;
        
        if(result.length !== 0) { // 입력한 id가 DB에 존재하면
            console.log('[App] 이미 아이디가 존재합니다.')
            res.send('이미 아이디가 존재합니다.')
        }
        else { // 입력한 id가 DB에 없으면
            connection.query(sql2, params, (error, rows) => {
                if (error) throw error;
                console.log('[App] 회원가입 성공!')
                res.send('회원가입 성공!')
            }); 
        }
    })
});

router.post('/post/search_id', function (req, res, next) { // id 찾기
    var email = req.body.email;
    var sql = 'select * from login where email = ?'

    // console.log('POST 호출 -> data : ' + email); 
    // console.log('path : ' + req.path);

    connection.query(sql, email, (error, rows) => {
        if(error) throw error;
        // console.log('User info is: ', rows);

        if(rows.length === 0) {
            res.send("없음")
            console.log("[App] 해당 이메일에 가입한 아이디가 존재하지 않습니다.")
        }
        else {
            res.send(rows[0].id)
            console.log("[App] 해당 이메일에 가입한 아이디는 \'" + rows[0].id + "\' 입니다.")
        }
    })
});

router.post('/post/search_pw', function (req, res, next) { // 비밀번호 찾기
    var id = req.body.id;
    var name = req.body.name;
    var params = [id, name];
    var sql = 'select * from login where id = ? and name = ?'

    console.log('POST 호출 -> data : ' + id + " , " + name); // 받은 데이터 출력
    console.log('path : ' + req.path);

    connection.query(sql, params, (error, rows) => {
        if(error) throw error;
        console.log('User info is: ', rows);

        if(rows.length === 0) {
            res.send("없음")
            console.log("정보가 일치하지 않습니다.")
        }
        else {
            res.send("일치")
            console.log("정보가 일치합니다.")
        }
    })
});

router.post('/post/update_pw', function (req, res, next) { // 비밀번호 변경
    var id = req.body.id;
    var pw = crypto.createHash('SHA512').update(req.body.pw).digest('base64'); // 비밀번호 암호화
    var params = [pw, id];
    var sql = 'update login set password = ? where id = ?';

    console.log('POST 호출 -> data : ' + id + "," + pw); // 받은 데이터 출력
    console.log('path : ' + req.path);

    connection.query(sql, params, (error, rows) => {
        if(error) throw error;
        console.log('User info is: ', rows);

        res.send('비밀번호가 변경되었습니다!');
        console.log("[App] "+ id + '님의 비밀번호가 변경되었습니다!')
    })
});



// 라즈베리파이 
router.post('/post/room1_led', function(req, res) {
    var state = req.body.state;
    if(state) {
        request('http://112.221.103.174:8888/led1/on', function (error, response, body) {
        if(body == undefined){
            res.send("실패")
            // res.json(0); 
        } else {
            // res.json(body); 
            res.send("성공");
        }
    });  
    } else {
        request('http://112.221.103.174:8888/led1/off', function (error, response, body) {
        if(body == undefined){
            res.send("실패")
            // res.json(0); 
        } else {
            // res.json(body); 
            res.send("성공");
        }
    }); 
    }
});

router.post('/post/room2_led', function(req, res) {
    var state = req.body.state;
    if(state) {
        request('http://112.221.103.174:8888/led2/on', function (error, response, body) {
        if(body == undefined){
            res.send("실패")
            // res.json(0); 
        } else {
            // res.json(body); 
            res.send("성공");
        }
    });  
    } else {
        request('http://112.221.103.174:8888/led2/off', function (error, response, body) {
        if(body == undefined){
            res.send("실패")
            // res.json(0); 
        } else {
            // res.json(body); 
            res.send("성공");
        }
    }); 
    }
});

router.post('/post/room3_led', function(req, res) {
    var state = req.body.state;

    if(state) {
        request('http://112.221.103.174:8888/led3/on', function (error, response, body) {
        if(body == undefined){
            res.send("실패")
            // res.json(0); 
        } else {
            // res.json(body); 
            res.send("성공");
        }
    });  
    } else {
        request('http://112.221.103.174:8888/led3/off', function (error, response, body) {
        if(body == undefined){
            res.send("실패")
            // res.json(0); 
        } else {
            // res.json(body); 
            res.send("성공");
        }
    }); 
    }
});

router.post('/post/temp_humi', function (req, res) { 
    // console.log("온습도" + req.body)    
    var sql = 'select * from data'; 
    // console.log('POST 호출 -> data : ' + req.body); // 받은 데이터 출력
    // console.log('path : ' + req.path);
    request('http://112.221.103.174:8888/Humid', function (error, response, body) {
        if(body == undefined){ // 플라스크 서버 닫혀있을 때
            var Temp = -1
            var Humi = -1
            res.json({
                'temp': Temp,
                'humi': Humi
            }); 
        } else {
            connection.query(sql, (error, rows) => {
                if (error) throw error;
                // console.log('User info is: ', rows);
                var Temp = (rows[rows.length - 1].Temp)
                var Humi = (rows[rows.length - 1].Humi)
                res.json({
                    'temp': Temp,
                    'humi': Humi
                });
                // console.log(Temp)
                // console.log(Humi)
            });
        }
    }); 
});

router.post('/post/dust', function (req, res) {     
    var sql = 'select * from dust';
    var PM10
    var PM25
    request('http://112.221.103.174:8888/dust', function (error, response, body) {
        if(body == undefined){ // 플라스크 서버 닫혀있을 때
            PM10 = -1
            PM25 = -1
            res.json({
                'PM10': PM10,
                'PM25': PM25
            }); 
        } else {
            connection.query(sql, (error, rows) => {
                if (error) throw error;
                // console.log('User info is: ', rows);
                PM10 = (rows[rows.length - 1].PM10)
                PM25 = (rows[rows.length - 1].PM25)
                res.json({
                    'PM10': PM10,
                    'PM25': PM25
                });
                // console.log(PM10)
                // console.log(PM25)
            });
        }
    }); 
});


router.post('/post/led1_check', function(req, res) {
    var Check

    request('http://112.221.103.174:8888/led1/check', function (error, response, body) {
        if(body == undefined){ // 접속실패
            Check = -1
            res.json({
                'check': Check
            });
        } 
        else // 라즈베리파이 플라스크 서버와 연결 성공
        {
        Check = body // 0(off) 또는 1(on)
        // console.log("LED1 : " + Check)
        res.json({
            'check': Check
        });
    }
});
});

router.post('/post/led2_check', function(req, res) {
    var Check

    request('http://112.221.103.174:8888/led2/check', function (error, response, body) {
        if(body == undefined){ // 접속실패
            Check = -1
            res.json({
                'check': Check
            });
        } 
        else // 라즈베리파이 플라스크 서버와 연결 성공
        {
        Check = body // 0(off) 또는 1(on)
        // console.log("LED1 : " + Check)
        res.json({
            'check': Check
        });
    }
});
});

router.post('/post/led3_check', function(req, res) {
    var Check

    request('http://112.221.103.174:8888/led3/check', function (error, response, body) {
        if(body == undefined){ // 접속실패
            Check = -1
            res.json({
                'check': Check
            });
        } 
        else // 라즈베리파이 플라스크 서버와 연결 성공
        {
        Check = body // 0(off) 또는 1(on)
        // console.log("LED1 : " + Check)
        res.json({
            'check': Check
        });
    }
});
});

router.post('/post/gas', function(req, res) {
    var gas
    request('http://112.221.103.174:8888/gas', function(error, response, body) {
        if(body == undefined) { // 접속실패
            gas = -1
            res.json({
                'gas' : gas
            });
        } else {
            gas = body
            res.json({
                'gas' : gas
            });
        }  
    });
});



  router.post('/post/out_info', function (req, res, next) { // 명균
    var id = req.body.id
    var sql = 'select * from login where id = ?'; // 회원 아이디에 해당되는 DB 검색

    console.log('[명균 POST 호출] -> data : '); // 받은 데이터 출력
    console.log('path : ' + req.path);

    connection.query(sql, id, (error, rows) => {
        if (error) throw error;
        console.log('User info is: ', rows[0].address);
        res.send(rows[0].address);
        // if (rows.length === 0) {
        //     res.send("없음")
        //     console.log("존재하지 않는 계정입니다.")
        // }
        // else if (pw == rows[0].password) {
        //     res.send("일치")
        //     console.log("App 로그인 성공! " + id + "님 환영합니다!")
        // }
        // else {
        //     res.send("불일치")
        //     console.log("비밀번호가 일치하지 않습니다.")
        // }
    });
    // res.send('post success')
});










router.put('/put/:id', function (req, res, next) {
    console.log('UPDATE 호출 / id : ' + req.params.id);
    console.log('body : ' + req.body.data);
    console.log('path : ' + req.path);
    res.send('put success')
});

router.delete('/delete/:id', function (req, res, next) {
    console.log('DELETE 호출 / id : ' + req.params.id);
    console.log('path : ' + req.path);
    res.send('delete success')
});

module.exports = router;