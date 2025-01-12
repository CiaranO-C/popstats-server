import { GraphQLObjectType } from "graphql";
import { sales } from "../sales/graphql/query.js";
import { buyers } from "../buyers/graphql/query.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sales,
    buyers,
  },
});

export default RootQuery;
