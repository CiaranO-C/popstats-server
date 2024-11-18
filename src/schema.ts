import {
  buildSchema,
  graphql,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

const buyerData = {
  1: {
    id: 123424,
    username: "buyer1",
    city: "London",
    country: "UK",
  },
};

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
        const buyer = buyerData[id];
        console.log("Found buyer", buyer);
        return buyer;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    uploadFile: {
      type: GraphQLBoolean,
      args: {
        fileData: { type: GraphQLString },
      },
      resolve: (root, { fileData }, context) => {
        const parsedData = JSON.parse(fileData);
        console.log("Data recieved --> ", parsedData[0]);
        return Boolean(fileData);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export { schema };
