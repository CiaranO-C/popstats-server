import { GraphQLInt, GraphQLObjectType } from "graphql";

const byDateType = new GraphQLObjectType({
  name: "SalesCountByDate",
  fields: {
    all: { type: GraphQLInt },
  },
});

const salesCountScalars = {
  sales: { type: GraphQLInt }, //total num of sales
  refunds: { type: GraphQLInt }, //total num of refunds
  bundles: { type: GraphQLInt }, //total num of bundles
};

const salesCountType = new GraphQLObjectType({
  name: "SalesCount",
  fields: {
    ...salesCountScalars,
    byDate: { type: byDateType },
  },
});

export { salesCountType };
