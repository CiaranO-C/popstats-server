import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const AverageDateFields = {
  average: { type: GraphQLFloat },
  date: { type: GraphQLString },
};

const AverageSalesMonthly = new GraphQLList(
  new GraphQLObjectType({
    name: "AverageSalesMonthly",
    fields: AverageDateFields,
  }),
);

const AverageSalesDaily = new GraphQLList(
  new GraphQLObjectType({
    name: "AverageSalesDaily",
    fields: AverageDateFields,
  }),
);

const AvgSalesByDate = new GraphQLObjectType({
  name: "AverageSalesByDate",
  fields: {
    monthly: {
      type: AverageSalesMonthly,
    },
    daily: {
      type: AverageSalesDaily,
    },
  },
});

const AvgSalesByHour = new GraphQLList(
  new GraphQLObjectType({
    name: "AverageSalesByHour",
    fields: {
      hour: { type: GraphQLInt },
      average: { type: GraphQLFloat },
    },
  }),
);

export { AvgSalesByDate, AvgSalesByHour };
