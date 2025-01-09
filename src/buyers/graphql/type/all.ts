import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { countAllBuyers, getAllBuyersList } from "../resolver/all";

const AllBuyersList = new GraphQLList(GraphQLString);

const AllBuyers = new GraphQLObjectType({
  name: "AllBuyers",
  fields: {
    buyers: { type: AllBuyersList, resolve: getAllBuyersList },
    count: { type: GraphQLInt, resolve: countAllBuyers },
  },
});

export { AllBuyers };
