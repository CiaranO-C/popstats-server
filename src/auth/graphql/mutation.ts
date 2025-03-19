import { GraphQLObjectType } from "graphql";
import logInType from "./type/logIn";
import signUpType from "./type/signUp";
import handleSignUp from "./resolver/signUp";
import handleLogIn from "./resolver/logIn";

const AuthType = new GraphQLObjectType({
  name: "Auth",
  fields: {
    signUp: { type: signUpType, resolve: handleSignUp },
    logIn: { type: logInType, resolve: handleLogIn },
  },
});

const auth = {
  type: AuthType,
  resolve: async (parent, args, context) => {
    console.log(context.userId);
    return {};
  },
};

export { auth };
