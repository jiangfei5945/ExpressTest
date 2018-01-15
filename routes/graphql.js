var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var graphql = require('graphql');
var schema = require('../lib/schema');

router.use(bodyParser.text({type:'application/graphql'}));

router.post('/', function (req, res, next) {
  graphql.graphql(schema,req.body).then(function(result){
    res.send(JSON.stringify(result, null, 2));
  });
});

module.exports = router;
