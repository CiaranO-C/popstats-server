import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const SalesAnalyticsType = new GraphQLObjectType({
  name: "SalesAnalytics",
  fields: {
    totalSales: { type: GraphQLInt },
    averageSaleValue: { type: GraphQLFloat },
    totalRevenue: { type: GraphQLFloat },
    mostPopularCategory: { type: GraphQLString },
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
  args: {
    preferences: { type: new GraphQLList(GraphQLString) },
  },
  resolve: async (obj, { preferences }, context) => {
    console.log("pref:", preferences);
    
    if (!context?.user) return await getDefaultAnalytics();
  },
};

async function getAnalytics() {
  console.log("hello");

  return { totalSales: 999 };
}

export { salesAnalytics };
