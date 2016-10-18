var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'victorica7'
});
var db = server.use('o2');
/*
db.record.get('#21:0').then(function (record) {
  console.log('Loaded records:', record);
})
*/

/*
var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
  console.log(results);
})
*/

/*
var sql = 'SELECT FROM topic WHERE @rid=:id';
var _params = {
  params:{
    id:'#21:0'
  }
};
db.query(sql, _params).then(function(results){
  console.log(results);
})
*/

/*
var sql = "INSERT INTO topic (title, description) VALUES(:title, :desc)";
var param = {
  params:{
    title:'Express',
    desc:'Express is framwork for web'
  }
}
db.query(sql, param).then(function(results){
  console.log(results);
})
*/

/*
var sql = "UPDATE topic SET title=:title WHERE @rid=:rid"
db.query(sql, {
  params:{
    title:'NPM',
    rid:'#22:0'
  }
}).then(function(results){
  console.log(results);
})
*/

/*
var sql = 'DELETE FROM topic WHERE @rid=:rid';
db.query(sql, {
  params:{
    rid:'#21:1'
  }
}).then(function(results){
  console.log(results);
})
*/
