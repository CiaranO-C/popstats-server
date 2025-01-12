import { GraphQLFloat, GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import {
  avgRevenueByDate,
  avgRevenueByHour,
  revenueByDate,
  sumNetRevenue,
  sumRevenue,
} from "../resolver/revenue.js";
import { AvgSalesByDate, AvgSalesByHour } from "./revenueAverage.js";

const AvgRevenue = new GraphQLObjectType({
  name: "AverageSales",
  fields: {
    byDate: {
      type: AvgSalesByDate,
      resolve: avgRevenueByDate,
    },
    byTime: {
      type: AvgSalesByHour,
      resolve: avgRevenueByHour,
    },
  },
});

const dateGroupedScalars = {
  total: { type: GraphQLFloat },
  net: { type: GraphQLFloat },
  date: { type: GraphQLDateTime },
  shipping: { type: GraphQLFloat },
};

const RevenueByDate = new GraphQLList(
  new GraphQLObjectType({
    name: "DateGroupedTotal",
    fields: dateGroupedScalars,
  }),
);

const salesRevenueType = new GraphQLObjectType({
  name: "SalesRevenue",
  fields: {
    total: { type: GraphQLFloat, resolve: sumRevenue },
    net: { type: GraphQLFloat, resolve: sumNetRevenue },
    byDate: {
      type: new GraphQLObjectType({
        name: "SalesRevenueByDate",
        fields: {
          all: { type: RevenueByDate, resolve: revenueByDate },
        },
      }),
      resolve: () => ({}),
    },
    average: { type: AvgRevenue, resolve: () => ({}) },
  },
});

export { salesRevenueType };
