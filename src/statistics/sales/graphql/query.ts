import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from "graphql";
import {
  getAverageSaleByDate,
  getDateGroupedTotal,
  getTotalRevenue,
} from "../resolver";
import { GraphQLDateTime } from "graphql-scalars";
import { AverageSalesByDate } from "./type";

const totalSales = {
  type: new GraphQLObjectType({
    name: "TotalSales",
    fields: {
      totalRevenue: {
        type: new GraphQLObjectType({
          name: "TotalRevenue",
          fields: {
            salesCount: { type: GraphQLInt },
            revenue: { type: GraphQLFloat },
          },
        }),
        resolve: getTotalRevenue,
      },
      dateGroupedTotal: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: "DateGroupedTotal",
            fields: {
              total: { type: GraphQLFloat },
              date: { type: GraphQLDateTime },
            },
          }),
        ),
        resolve: getDateGroupedTotal,
      },
    },
  }),
};

const averageSales = {
  type: new GraphQLObjectType({
    name: "AverageSales",
    fields: {
      byDate: {
        type: AverageSalesByDate,
        resolve: getAverageSaleByDate,
      },
      byTime: {
        type: GraphQLFloat,
        resolve: () => {
          /*get average sales by time of day*/
        },
      },
    },
  }),
  resolve: () => ({}),
};

export { totalSales, averageSales };
