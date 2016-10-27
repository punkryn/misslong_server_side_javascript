var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
// var boot = require('bootstrap');
var app = express();
app.set('view engine', 'pug');
app.set('views', './view');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(session({
//   secret: '1234DSFs@adf1234!@#$asd',
//   resave: false,
//   saveUninitialized: true,
//   store:new MySQLStore({
//     host:'localhost',
//     port:3306,
//     user:'root',
//     password:'kwak625',
//     database:'o2'
//   })
// }));
app.get('/naru', function(req,res){
  res.render('t');
});
app.get('/login', function(req,res){
  res.render('t');
});


app.listen(80 , function(){
  console.log('Connected 80 port!!!');
});
