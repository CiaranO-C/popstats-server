import { GraphQLObjectType } from "graphql";
import { salesAnalytics } from "../sales/query";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    salesAnalytics,
  },
});

export default RootQuery;
