var graphql = require('graphql');

var count = 5;

var schmea = new graphql.buildSchema(`
type Doctor {
  name: String
  hosp: String
}

type Person {
  id: Int
  name: String
  signDoctor: Doctor
}

type Query {
  getPerson: Person
}
`);

module.exports = schmea;