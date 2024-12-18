import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { getAverageSaleValue, getMostPopularCategory } from "./resolvers";
import {
  getAverageSaleByDate,
  getSalesByDate,
  getTotalSales,
} from "./sales/resolver";
import { GraphQLDateTime } from "graphql-scalars";

const SalesAnalyticsType = new GraphQLObjectType({
  name: "SalesAnalytics",
  fields: {
    salesByDate: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "SalesByDate",
          fields: {
            total: { type: GraphQLFloat },
            date: { type: GraphQLDateTime },
          },
        }),
      ),
      resolve: getSalesByDate,
    },
    totalSales: {
      type: new GraphQLObjectType({
        name: "TotalSales",
        fields: {
          sales: { type: GraphQLInt },
          revenue: { type: GraphQLFloat },
        },
      }),
      resolve: getTotalSales,
    },
    averageSales: {
      type: new GraphQLObjectType({
        name: "AverageSales",
        fields: {
          byDate: {
            type: new GraphQLObjectType({
              name: "AverageSalesByDate",
              fields: {
                monthly: {
                  type: new GraphQLList(
                    new GraphQLObjectType({
                      name: "AverageSalesMonthly",
                      fields: {
                        average: { type: GraphQLFloat },
                        month: { type: GraphQLString },
                      },
                    }),
                  ),
                },
                daily: {
                  type: new GraphQLList(
                    new GraphQLObjectType({
                      name: "AverageSalesDaily",
                      fields: {
                        average: { type: GraphQLFloat },
                        date: { type: GraphQLString },
                      },
                    }),
                  ),
                },
              },
            }),
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
    },
    averageSaleValue: { type: GraphQLFloat, resolve: getAverageSaleValue },
    totalRevenue: { type: GraphQLFloat },
    mostPopularCategory: {
      type: GraphQLString,
      resolve: getMostPopularCategory,
    },
    topPaymentMethod: { type: GraphQLString },
    bundlesSold: { type: GraphQLInt },
    totalRefunds: { type: GraphQLInt },
    topBrands: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "TopBrands",
          fields: {
            brand: { type: GraphQLString },
            soldCount: { type: GraphQLInt },
          },
        }),
      ),
    },
  },
});

const salesAnalytics = {
  type: SalesAnalyticsType,
  resolve: async (parent, args, context) => {
    console.log(context.userId);
    return {};
  },
};

export { salesAnalytics };
