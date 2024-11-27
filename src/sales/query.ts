import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import prisma from "../../config/prisma";

const SalesAnalyticsType = new GraphQLObjectType({
  name: "SalesAnalytics",
  fields: {
    totalSales: { type: GraphQLInt, resolve: getTotalSales },
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

async function getTotalSales(parent, args, context) {
  const sales = await prisma.sale.count();

  return sales;
}

async function getAverageSaleValue(parent, args, context) {
  const average = await prisma.sale.aggregate({
    _avg: {
      total: true,
    },
  });
  const rounded = average._avg.total.toFixed(2);

  return rounded;
}

async function getMostPopularCategory(parent, args, context) {
  const [popular] = await prisma.item.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: "desc",
      },
    },
    take: 1,
  });

  return popular.category;
}

const salesAnalytics = {
  type: SalesAnalyticsType,
  args: {
    preferences: { type: new GraphQLList(GraphQLString) },
  },
  resolve: async (parent, { preferences }, context) => ({}),
};

export { salesAnalytics };
