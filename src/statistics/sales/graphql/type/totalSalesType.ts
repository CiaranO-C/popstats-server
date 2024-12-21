import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";

const TotalRevenue = new GraphQLObjectType({
  name: "TotalRevenue",
  fields: {
    salesCount: { type: GraphQLInt },
    revenue: { type: GraphQLFloat },
  },
});

const DateGroupedTotal = new GraphQLList(
  new GraphQLObjectType({
    name: "DateGroupedTotal",
    fields: {
      total: { type: GraphQLFloat },
      date: { type: GraphQLDateTime },
    },
  }),
);

export { DateGroupedTotal, TotalRevenue };
