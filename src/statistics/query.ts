import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { getMostPopularCategory } from "./resolvers";
import {
  averageSales,
  salesByDate,
  totalSales,
} from "./sales/query";

const SalesAnalyticsType = new GraphQLObjectType({
  name: "SalesAnalytics",
  fields: {
    salesByDate,
    totalSales,
    averageSales,
    //averageSaleValue: { type: GraphQLFloat, resolve: getAverageSaleValue },
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
