import { GraphQLBoolean, GraphQLString } from "graphql";
import { uploadFileResolver } from "./resolvers";

const uploadFile = {
  type: GraphQLBoolean,
  args: {
    fileData: { type: GraphQLString },
  },
  resolve: uploadFileResolver,
};

export { uploadFile };
