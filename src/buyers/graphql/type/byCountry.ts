import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

const BuyersByCountry = new GraphQLList(
  new GraphQLObjectType({
    name: "BuyersByCountry",
    fields: {
      country: { type: GraphQLString },
      buyers: { type: GraphQLInt },
    },
  }),
);

export { BuyersByCountry };
