var graphql = require('graphql');

var count = 5;

var schmea = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name:'RootQueryType',
    fields:{
      count:{
        type:graphql.GraphQLInt,
        description: 'The count!',
        resolve:function(){
          return count;
        }
      }
    }
  })
});

module.exports = schmea;