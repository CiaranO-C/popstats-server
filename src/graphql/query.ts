import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const BuyerType = new GraphQLObjectType({
  name: "Buyer",
  fields: {
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getBuyer: {
      type: BuyerType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, { id }) => {
        console.log("Found buyer");
      },
    },
  },
});

export default RootQuery;
