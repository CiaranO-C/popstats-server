import { GraphQLObjectType } from "graphql";

const ItemsType = new GraphQLObjectType({
  name: "Items",
  fields: {},
});

const items = {
  type: ItemsType,
  resolve: async (parent, args, context) => {
    console.log(context.userId);
    return {};
  },
};

export { items };
