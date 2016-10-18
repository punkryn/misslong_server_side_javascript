module.exports = function(){
  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();
  route.get('/add', function(req, res){
    var sql = 'select id,title from topic';
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('topic/add' , {topics:topics, user:req.user});
    });
  });

  route.post('/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'insert into topic (title, description, author) values(?,?,?)';
    conn.query(sql, [title, description, author], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/topic/'+result.insertId);
      }
    })
  })

  route.get(['/:id/edit'], function(req, res){
    var sql = 'select id,title from topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id){
        var sql = 'select * from topic where id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/edit', {topics:topics, topic:topic[0], user:req.user});
          }
        });
      } else {
        console.log('There is no id.');
        res.status(500).send('Internal Server Error');
      }
    })
  });

  route.post(['/:id/edit'], function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic set title=?, description=?, author=? where id=?';
    conn.query(sql, [title, description, author, id], function(err, rows, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/topic/'+id);
      }
    })
  });

  route.get(['/:id/delete'], function(req, res){
    var sql = 'select id,title from topic';
    var id = req.params.id;
    conn.query(sql, function(err, topics, fields){
      var sql = 'select * from topic where id=?';
      conn.query(sql, [id], function(err, topic){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          if(topic.length === 0){
            console.log('There is no record.');
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/delete', {topics:topics, topic:topic[0], user:req.user});
          }
        }
      });
    });
  });

  route.post('/topic/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = 'delete from topic where id=?';
    conn.query(sql, [id], function(err, result){
      res.redirect('/topic/');
    })
  });

  route.get(['/', '/:id'], function(req, res){
    var sql = 'select id,title from topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id){
        var sql = 'select * from topic where id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/view', {topics:topics, topic:topic[0], user:req.user});
          }
        });
      } else {
        res.render('topic/view', {topics:topics, user:req.user});
      }
    })
  });
  return route;
}
