import { GraphQLObjectType } from "graphql";
import { AllBuyers, BuyersByCountry, RepeatBuyers } from "./type";
import { getRepeatBuyers } from "./resolver/repeat";

const BuyersType = new GraphQLObjectType({
  name: "Buyers",
  fields: {
    all: { type: AllBuyers, resolve: () => ({}) },
    repeat: { type: RepeatBuyers, resolve: getRepeatBuyers },
    byCountry: { type: BuyersByCountry, resolve: () => ({}) },
  },
});

const buyers = {
  type: BuyersType,
  resolve: async (parent, args, context) => {
    console.log(context.userId);
    return {};
  },
};

export { buyers };
