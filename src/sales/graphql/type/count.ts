import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { countByDate, countSaleItems } from "../resolver/count.js";
import { GraphQLDateTime } from "graphql-scalars";

const salesCountScalars = {
  sales: { type: GraphQLInt }, //total num of sales
  refunds: { type: GraphQLInt }, //total num of refunds
  bundles: { type: GraphQLInt }, //total num of bundles
};

const CountByDate = new GraphQLList(
  new GraphQLObjectType({
    name: "CountByDate",
    fields: {
      date: { type: GraphQLDateTime },
      ...salesCountScalars,
    },
  }),
);

const SaleItemsByDate = new GraphQLList(
  new GraphQLObjectType({
    name: "SaleItemsByDate",
    fields: {
      date: { type: GraphQLDateTime },
      items: { type: GraphQLInt },
      boosted: { type: GraphQLInt },
    },
  }),
);

const byDateType = new GraphQLObjectType({
  name: "SalesCountByDate",
  fields: {
    all: { type: CountByDate, resolve: countByDate },
    items: { type: SaleItemsByDate, resolve: countSaleItems },
  },
});

const salesCountType = new GraphQLObjectType({
  name: "SalesCount",
  fields: {
    ...salesCountScalars,
    byDate: { type: byDateType, resolve: () => ({}) },
  },
});

export { salesCountType };
