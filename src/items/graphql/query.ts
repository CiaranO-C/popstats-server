import { GraphQLObjectType } from "graphql";
import { ItemsCountType } from "./type/count.js";

const ItemsType = new GraphQLObjectType({
  name: "Items",
  fields: {
    count: { type: ItemsCountType, resolve: () => ({}) },
  },
});

const items = {
  type: ItemsType,
  resolve: async (parent, args, context) => {
    console.log(context.userId);
    return {};
  },
};

export { items };
