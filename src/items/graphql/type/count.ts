import { GraphQLInt, GraphQLObjectType } from "graphql";
import { getItemCount } from "../resolver/count.js";

const ItemsCountType = new GraphQLObjectType({
    name: "ItemsCountType",
    fields: {
        all: { type: GraphQLInt, resolve: getItemCount }
    }
});

export { ItemsCountType }