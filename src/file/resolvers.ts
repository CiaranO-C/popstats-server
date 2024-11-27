import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { createSalesData } from "./db";
import { CSVFile } from "./type";
import { UploadError } from "./error";

const uploadFileResolver = async (
  root: any,
  { fileData }: { fileData: string },
  context: any,
) => {
  const parsedData: CSVFile = JSON.parse(fileData);
  try {
    const upload = await prisma.$transaction(async (tx) => {
      return await createSalesData(null, parsedData, tx);
    });

    return Boolean(upload);
  } catch (error) {
    console.error(error);

    //error while creating prisma entries
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new UploadError(`Database error: ${error.message}`);
    }

    throw new UploadError("Unexpected error during file upload");
  }
};

export { uploadFileResolver };
