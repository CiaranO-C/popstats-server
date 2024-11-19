import { GraphQLObjectType } from "graphql";
import { uploadFile } from "../file/mutation";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    uploadFile,
  },
});

export default mutation;
