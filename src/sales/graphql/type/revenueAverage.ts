import {
  GraphQLFloat,
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

const AverageSalesByDate = new GraphQLObjectType({
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

export default AverageSalesByDate;
