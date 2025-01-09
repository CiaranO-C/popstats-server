import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const RepeatBuyerList = new GraphQLList(
  new GraphQLObjectType({
    name: "RepeatBuyerList",
    fields: {
      bought: { type: GraphQLInt },
      buyer: { type: GraphQLString },
    },
  }),
);

const RepeatBuyers = new GraphQLObjectType({
  name: "RepeatBuyers",
  fields: {
    buyers: { type: RepeatBuyerList },
    count: { type: GraphQLInt },
  },
});

export { RepeatBuyers };
