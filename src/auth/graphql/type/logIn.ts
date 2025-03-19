import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

const logInType = new GraphQLObjectType({
  name: "LogIn",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default logInType;
