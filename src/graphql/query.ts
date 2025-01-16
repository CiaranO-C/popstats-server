import { GraphQLObjectType } from "graphql";
import { sales } from "../sales/graphql/query.js";
import { buyers } from "../buyers/graphql/query.js";
import { items } from "../items/graphql/query.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sales,
    buyers,
    items,
  },
});

export default RootQuery;
