var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
  secret: '1sad%@f1s5d@%1fs3d13s%d1',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count :'+req.session.count);
});

app.get('/auth/logout', function(req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.authId === id){
      return done(null, user);
    }
  }
  done('There is no user.');
});

passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    for(var i=0; i<users.length; i++){
      var user = users[i];
      if(uname === user.username) {
        return hasher({password:pwd, salt:user.salt},
        function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }
    }
    done(null, false);
  }
));

passport.use(new FacebookStrategy({
    clientID: '306036296441037',
    clientSecret: 'f508de4781436bab124cd80f5c5d0064',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','email','gender','link','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    for(var i=0; i<users.length; i++){
      var user = users[i];
      if(user.authId === authId){
        return done(null, user);
      }
    }
    var newuser = {
      'authId':authId,
      'displayName':profile.displayName,
      'email':profile.emails[0].value
    };
    users.push(newuser);
    done(null, newuser);
  }
));

app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {
      //successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  ),
  function(req, res){
    req.session.save(function(){
      res.redirect('/welcome');
    })
  }
);

app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook',
    {scope:'email'}
  )
);

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
   {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);

var users = [
  {
    authId:'local:egoing',
    username:'egoing',
    password:'dYfmFeOv6xKAHnc0sjrNWVXtdyJ2TbVi5Iw1lnVkQxxiBpE0tPWxcCYNOYEGk/HSCKN3xhBXiNqR4NlxMnOFUv/MXvqBU5opOjKxWohug5bYoVE0QYsw6YhdDCap30eDTQVqfabLm8oPyM1RXO1tTZJdBTeQjTPJBoYPZ4PJ+OI=',
    salt:'k/X42MvOk5ghPOCoZFAmdxRP+Zo+nzFdDedu9dNBoeiPkfxVXMwnwzrV11w55XXYqKtTVGgbvy/ytenBIm8y9w==',
    displayName:'Egoing'
  }
];

app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId:'local:'+req.body.username,
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    };
    var sql = 'insert into users set ?';
    conn.query(sql, user, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        res.redirect('/welcome');
      }
    });
    // req.login(user, function(err){
    //   req.session.save(function(){
    //     res.redirect('/welcome');
    //   });
    // });
  });
});

app.get('/auth/register' , function(req, res){
  var output = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
})

app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  <a href='/auth/facebook'>facebook</a>
  `;
  res.send(output);
});


app.listen(3003, function(){
  console.log('Connected 3003 port !!!');
});
