var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var { graphqlHTTP } = require('express-graphql');
var schema = require('../lib/schema');
class Doctor {
  constructor() {
    this.name = 'doctor1';
    this.hosp = 'xiehe';
  }
}

class Person {
  constructor() {
    this.id = 123;
    this.name = 'jf';
    this.signDoctor = new Doctor();
  }
}

// root 规定了顶层的 API 入口端点
const root = {
  getPerson: function () {
    return new Person();
  }
}

router.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

module.exports = router;
