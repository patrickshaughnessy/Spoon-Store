
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

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

function idGen(){
  return Math.floor(Math.random()*Date.now())
};
let store = {};
store.spoons = [
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

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
  },
  (obj) => {}
);


let spoonType = new GraphQLObjectType({
  name: 'Spoon',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID)},
    title: { type: GraphQLString },
    price: { type: GraphQLFloat }
  })
})

let {connectionType: spoonConnection} =
  connectionDefinitions({name: 'Spoon', nodeType: spoonType})

let storeType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    id: globalIdField('Store'),
    spoons: {
      type: spoonConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) => {
        return connectionFromArray(obj.spoons, args)
      }
    }
  })
})


let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    store: {
      type: storeType,
      resolve: () => store
    }
  })
})

// let Schema = new GraphQLSchema({
//   query: queryType
// })

  // mutation: new GraphQLObjectType({
  //  name : 'Mutation',
  //  fields: ({
  //    test: {
  //      type: GraphQLString,
  //      resolve: () => "Test"
  //    }
  //  })
  // })
  //});

export var Schema = new GraphQLSchema({
  query: queryType
});
