import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    uploadFile: {
      type: GraphQLBoolean,
      args: {
        fileData: { type: GraphQLString },
      },
      resolve: (root, { fileData }, context) => {
        const parsedData = JSON.parse(fileData);
        console.log("Data recieved --> ", parsedData[0]);
        return Boolean(fileData);
      },
    },
  },
});

export default mutation;
