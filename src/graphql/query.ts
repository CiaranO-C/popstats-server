import { GraphQLObjectType } from "graphql";
import { sales } from "../sales/graphql/query";
import { buyers } from "../buyers/graphql/query";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sales,
    buyers,
  },
});

export default RootQuery;
