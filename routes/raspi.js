var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
const http = require('http').Server(app);
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const dateUtils = require('date-utils');
var mysql = require('mysql');

var client = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'dlrlals970425',
  database : 'smarthome'
});

router.post('/room1_on', (req,res)=>{
    request('http://112.221.103.174:8888/led1/on', function (error, response, body) {
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the data received
    if(body == undefined){
      res.json(0);
    }else{
      res.json(body);
    }
  });      
});

router.post('/room1_off', (req,res)=>{
  request('http://112.221.103.174:8888/led1/off', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  if(body == undefined){
    res.json(0);
  }else{
    res.json(body);
  }
  });      
});

router.post('/room2_on', (req,res)=>{
  request('http://112.221.103.174:8888/led2/on', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  if(body == undefined){
    res.json(0);
  }else{
    res.json(body);
  }
});      
});

router.post('/room2_off', (req,res)=>{
  request('http://112.221.103.174:8888/led2/off', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  if(body == undefined){
    res.json(0);
  }else{
    res.json(body);
  }
});      
});

router.post('/room3_on', (req,res)=>{
  request('http://112.221.103.174:8888/led3/on', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  if(body == undefined){
    res.json(0);
  }else{
    res.json(body);
  }
});      
});

router.post('/room3_off', (req,res)=>{
  request('http://112.221.103.174:8888/led3/off', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  if(body == undefined){
    res.json(0);
  }else{
    res.json(body);
  }
});      
});

router.post('/led1_check', (req,res)=>{
  request('http://112.221.103.174:8888/led1/check', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  res.json(body);
});      
});

router.post('/led2_check', (req,res)=>{
  request('http://112.221.103.174:8888/led2/check', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  res.json(body);
});      
});

router.post('/led3_check', (req,res)=>{
  request('http://112.221.103.174:8888/led3/check', function (error, response, body) {
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the data received
  res.json(body);
});      
});

router.post('/humid', (req,res)=>{
  const result = 0;
  var newDate = new Date();
  var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  try{
    request('http://112.221.103.174:8888/Humid', function (error, response, body) {
        if(body == undefined){
          res.json(result);
        }else{
          const arr = (body).split(" ");
          // res.send(arr); //Display the response on the website
          client.query('insert into data values(?,?,?)',[time, arr[0], arr[1]]);
          console.log(time + ", " + arr); // Print the data received
          res.json(arr);
        }
      });
  } catch(err){
    console.log('접속실패');
    res.send(0);
  }
});

module.exports = router;