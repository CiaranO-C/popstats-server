import { GraphQLBoolean, GraphQLString } from "graphql";

const uploadFile = {
  type: GraphQLBoolean,
  args: {
    fileData: { type: GraphQLString },
  },
  //update any type for production
  resolve: (root: any, { fileData }, context: any) => {
    const parsedData = JSON.parse(fileData);
    console.log("Data recieved --> ", parsedData[0]);
    return Boolean(fileData);
  },
};

export { uploadFile }
