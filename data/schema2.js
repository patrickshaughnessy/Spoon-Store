import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

function idGen(){
  return Math.floor(Math.random()*Date.now())
}

let spoons = [
  {
    _id: idGen(),
    title: 'Fat Spoon',
    price: 24.50
  },
  {
    _id: idGen(),
    title: 'Skinny Spoon',
    price: 12.30
  }
]

let spoonType = new GraphQLObjectType({
  name: 'Spoon',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID)},
    title: { type: GraphQLString },
    price: { type: GraphQLFloat }
  })
})


let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: ({
      test: {
        type: GraphQLString,
        resolve: () => "Test"
      },
      spoons: {
        type: new GraphQLList(spoonType),
        resolve: () => spoons
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
