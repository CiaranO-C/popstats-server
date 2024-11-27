import { GraphQLBoolean, GraphQLString } from "graphql";
import { createSalesData } from "./db";
import { CSVFile } from "./type";
import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { UploadError } from "./error";

const uploadFile = {
  type: GraphQLBoolean,
  args: {
    fileData: { type: GraphQLString },
  },

  resolve: async (root: any, { fileData }, context: any) => {
    const parsedData: CSVFile = JSON.parse(fileData);
    console.log("user context --> ", context);
    try {
      const upload = await prisma.$transaction(async (tx) => {
        return await createSalesData(null, parsedData, tx);
      });
      console.log("UPLOAD!", upload);
      return Boolean(upload);
    } catch (error) {
      console.error(error);

      //error while creating prisma entries
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new UploadError(`Database error: ${error.message}`);
      }

      throw new UploadError("Unexpected error during file upload");
    }
  },
};

export { uploadFile };
