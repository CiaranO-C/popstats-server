import { GraphQLSchema } from "graphql";
//import mutation from "./mutation";
import query from "./query.js";

const schema = new GraphQLSchema({
  query,
  //mutation,
});

export default schema;
