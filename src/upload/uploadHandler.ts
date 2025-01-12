import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { createFileEntry, deleteTempUserFiles, validateFile } from "./db.js";
import { hashFileData, createSalesData, csvToJson } from "./utils.js";
import { createUser } from "../user/db.js";
import prisma from "../../config/prisma.js";

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
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const { file } = req;
    let user = req.body.user;
    await prisma.$transaction(async (tx) => {
      if (!user) user = await createUser(tx);

      const fileString = file.buffer.toString();
      const fileHash = hashFileData(fileString);
      const isValid = await validateFile(fileHash, user.id, tx);
      if (!isValid) {
        res.status(422).json({ error: "Duplicate file" });
        return;
      }

      const parsedData = await csvToJson(fileString);
      await deleteTempUserFiles(user.id, tx);
      await createFileEntry(user.id, fileHash, parsedData, tx);
      const uploaded = await createSalesData(user.id, parsedData, fileHash, tx);
      console.log("upload success -> ", uploaded);
      res.json({
        userId: user.id,
        message: `Sucessfully uploaded user: ${user.id} data`,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error parsing CSV" });
  }
}

export { recieveFile, uploadCsvFile };
