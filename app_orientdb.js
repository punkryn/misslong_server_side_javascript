var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage })
var fs = require('fs');
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'victorica7'
});
var db = server.use('o2');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views_orientdb');
app.set('view engine', 'jade');
app.get('/upload', function(req, res){
  res.render('upload');
})
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('uploaded : '+req.file.filename);
})
app.get('/topic/add', function(req, res){
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    if(topics.length === 0){
      console.log('There is no topic record');
      res.status(500).send('Internal Server Error');
    }
  res.render('add' , {topics:topics});
  });
});
app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)';
  db.query(sql, {
    params:{
      title:title,
      desc:description,
      author:author
    }
  }).then(function(results){
    res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
  });
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);
  })
})
app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    var sql = 'SELECT FROM topic WHERE @rid=:rid';
    var id = req.params.id;
    if(id){db.query(sql, {params:{rid:id}}).then(function(topic){
      res.render('view' , {topics:topics, topic:topic[0]});
    })} else {
      res.render('view', {topics:topics});
    }
  })
});
app.listen(3000, function(){
  console.log('Connected, 3000 port!');
})
