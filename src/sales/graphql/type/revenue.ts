import { GraphQLFloat, GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import {
  avgRevenueByDate,
  avgRevenueByHour,
  revenueByDate,
  sumRevenue,
} from "../resolver/revenue";
import { AvgSalesByDate, AvgSalesByHour } from "./averageByDate";

const dateGroupedScalars = {
  total: { type: GraphQLFloat },
  date: { type: GraphQLDateTime },
};

const RevenueByDate = new GraphQLList(
  new GraphQLObjectType({
    name: "DateGroupedTotal",
    fields: dateGroupedScalars,
  }),
);

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

const salesRevenueType = new GraphQLObjectType({
  name: "SalesRevenue",
  fields: {
    total: { type: GraphQLFloat, resolve: sumRevenue },
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
