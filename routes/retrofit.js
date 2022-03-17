const { query } = require('express');
var express = require('express');
var router = express.Router();
var crypto = require("crypto"); // 암호화

const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'dlrlals970425',
    database : 'smarthome'
});

const app = express();

connection.connect();

router.get('/get', function (req, res, next) {
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

    console.log('POST 호출 -> data : ' + id + "," + pw); // 받은 데이터 출력
    console.log('path : ' + req.path);

    connection.query(sql, id, (error, rows) => {
        if (error) throw error;
        console.log('User info is: ', rows);

        if (rows.length === 0) {
            res.send("없음")
            console.log("존재하지 않는 계정입니다.")
        }
        else if (pw == rows[0].password) {
            res.send("일치")
            console.log("App 로그인 성공! " + id + "님 환영합니다!")
        }
        else {
            res.send("불일치")
            console.log("비밀번호가 일치하지 않습니다.")
        }
    });
    // res.send('post success')
});


router.post('/post/signup', function (req, res, next) { // 회원가입
    var id = req.body.id;
    var pw = crypto.createHash('SHA512').update(req.body.pw).digest('base64'); // 비밀번호 암호화
    var name = req.body.name;
    var birth = req.body.birth;
    var number = req.body.number;
    var address = req.body.address;
    var email = req.body.email;

    var sql1 = 'select id from login' // id 중복검사.
    var sql2 = 'insert into login values(?, ?, ?, ?, ?, ?, ?)'; // 회원 아이디에 해당되는 DB 검색
    var params = [id, pw, name, birth, number, address, email];

    console.log('POST 호출 -> data : ' + req); // 받은 데이터 출력
    console.log('path : ' + req.path);

    connection.query(sql1, (error, rows) => {
        if (error) throw error;
        console.log('User info is : ', rows);
        var index;
        for (index = 0; index < rows.length; index++) {
            if (id == rows[index].id) {
                console.log('이미 아이디가 존재합니다.')
                res.send('이미 아이디가 존재합니다.')
                break;
            }
        }
        if(index == rows.length) {
            connection.query(sql2, params, (error, rows) => {
                if (error) throw error;
                console.log('User info is: ', rows);
                res.send('회원가입 성공!')
            }); 
        }
    })
});

router.post('/post/search_id', function (req, res, next) { // id 찾기
    var email = req.body.email;
    var sql = 'select * from login where email = ?'

    console.log('POST 호출 -> data : ' + email); // 받은 데이터 출력
    console.log('path : ' + req.path);

    connection.query(sql, email, (error, rows) => {
        if(error) throw error;
        console.log('User info is: ', rows);

        if(rows.length === 0) {
            res.send("없음")
            console.log("해당 이메일에 가입한 아이디가 존재하지 않습니다.")
        }
        else {
            res.send(rows[0].id)
            console.log("해당 이메일에 가입한 아이디는 \'" + rows[0].id + "\' 입니다.")
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
        console.log(id + '님의 비밀번호가 변경되었습니다!')
    })
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