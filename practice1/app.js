var express = require('express');
var app = express();
app.use(express.static('root/public'));
app.set('view engine', 'jade');
app.set('views', './views');
app.get('/index', function(req, res){
  res.render('index')
})

app.listen(80, function(){
  console.log('Connected 3000 port!');
});
