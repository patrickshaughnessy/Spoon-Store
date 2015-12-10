import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: ({
      test: {
        type: GraphQLString, 
        resolve: () => "Test"
      }
    })
  }) 

  // mutation: new GraphQLObjectType({
  //  name : 'Mutation',
  //  fields: ({
  //    test: {
  //      type: GraphQLString, 
  //      resolve: () => "Test" 
  //    }
  //  })
  // })
});

export default schema;
