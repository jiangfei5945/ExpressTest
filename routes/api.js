var express = require('express');
var router = express.Router();
var rdsUtility = require('../lib/rds-test');
//var yieldUtility = require('../lib/yield-test');

//promise-test
router.get('/data1', function(req, res, next) {
  res.send({result: 1, msg: 'data-1'});
});

router.get('/data2', function(req, res, next) {
  setTimeout(function(){
    res.send({result: 1, msg: 'data-2'});
  },2000);
});

router.get('/data3', function(req, res, next) {
  res.send({result: 1, msg: 'data-3'});
});

//rds-test
router.get('/rds-test/create-table', function(req, res, next) {
  rdsUtility.createTable();
  res.send({result: 1, msg: 'data-3'});
});

router.get('/rds-test/insert', function(req, res, next) {
  rdsUtility.insert();
  res.send({result: 1, msg: 'data-3'});
});

router.get('/rds-test/select', function(req, res, next) {
  rdsUtility.select().then(function(data){
    res.send(data);
  });
});

router.get('/api-redirect-test', function(req, res, next) {
  res.redirect('/pages/svg-test.html');
});

//CORS
router.get('/api-cors', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:63342");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send({result: 1, msg: 'api-cors'});
});

//JSONP
router.get('/api-jsonp', function (req, res, next) {
  res.jsonp({ result: 1, msg: 'api-jsonp' });
});

//Employee
router.get('/employees', function (req, res, next) {
  res.send({ result: 1, data: [{name:'test1'},{name:'test2'}] });
});

router.post('/employee/add', function (req, res, next) {
  res.send({ result: 1, data: req.body.employee });
});
module.exports = router;
