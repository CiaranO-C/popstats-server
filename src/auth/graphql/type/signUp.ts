import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const signUpType = new GraphQLObjectType({
  name: "SignUp",
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

export default signUpType;
