var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('**********req.cookies.name', req.cookies.rememberme);
  res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
  res.render('index', { title: 'Express' });
});

module.exports = router;
