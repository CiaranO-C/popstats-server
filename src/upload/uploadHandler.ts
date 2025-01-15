import { NextFunction, Request, Response } from "express";
import multer from "multer";
import {
  createFileEntry,
  deleteUserFiles,
  validateFile,
} from "./db.js";
import { hashFileData, createSalesData, csvToJson } from "./utils.js";
import { createUser, findUser } from "../user/db.js";
import prisma from "../../config/prisma.js";
import { UserType } from "../user/type.js";

async function retrieveUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.body.userId ?? "";
    const user = await findUser(userId);

    req.body.user = user;
    next();
  } catch (error) {
    console.error("Error in retrieveUser middleware -> ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const upload = multer({
  fileFilter: (req, file, cb) => {
    file.mimetype === "text/csv" ? cb(null, true) : cb(null, false);
  },
});

const recieveFile = upload.single("csv");

async function uploadCsvFile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const errorMap = {
    noFile: { statusCode: 400, message: "No file uploaded" },
    duplicate: { statusCode: 422, message: "Duplicate file" },
  };
  try {
    if (!req.file) throw errorMap.noFile;

    const { file } = req;
    const fileString = file.buffer.toString();
    const fileHash = hashFileData(fileString);
    const parsedData = await csvToJson(fileString);
    let user: UserType | null = req.body.user;
    await prisma.$transaction(async (tx) => {
      //if user null create temporary user
      if (!user) user = await createUser(tx);

      const isValid = await validateFile(fileHash, user.id, tx);
      if (!isValid) throw errorMap.duplicate;

      //remove existing user files to limit temp users to 1
      if (user.role === "TEMPORARY") await deleteUserFiles(user.id, tx);

      await createFileEntry(user.id, fileHash, parsedData, tx);
      await createSalesData(user.id, parsedData, fileHash, tx);
    });
    res.json({
      userId: user?.id,
      message: `Sucessfully uploaded user: ${user?.id} data`,
    });
  } catch (error) {
    if (error.statusCode && error.message) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Error parsing CSV" });
    }
  }
}

export { recieveFile, uploadCsvFile, retrieveUser };
