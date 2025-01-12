import { GraphQLObjectType } from "graphql";
import { AllBuyers, BuyersByCountry, RepeatBuyers } from "./type/index.js";
import { getRepeatBuyers } from "./resolver/repeat.js";
import { getBuyersByCountry } from "./resolver/byCountry.js";

const BuyersType = new GraphQLObjectType({
  name: "Buyers",
  fields: {
    all: { type: AllBuyers, resolve: () => ({}) },
    repeat: { type: RepeatBuyers, resolve: getRepeatBuyers },
    byCountry: { type: BuyersByCountry, resolve: getBuyersByCountry },
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
