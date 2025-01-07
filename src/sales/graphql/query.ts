import { GraphQLObjectType } from "graphql";
import { salesCountType, salesRevenueType } from "./type";

const SalesType = new GraphQLObjectType({
  name: "Sales",
  fields: {
    count: { type: salesCountType, resolve: () => ({}) },
    revenue: { type: salesRevenueType, resolve: () => ({}) },
  },
});

const sales = {
  type: SalesType,
  resolve: async (parent, args, context) => {
    console.log(context.userId);
    return {};
  },
};

export { sales };
