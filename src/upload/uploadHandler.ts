import { NextFunction, Request, Response } from "express";
import { parse } from "@fast-csv/parse";
import multer from "multer";
import { createFileEntry, validateFile } from "./db";
import { hashFileData, createSalesData } from "./utils";
import { createTemporaryUser } from "../user/db";
import prisma from "../../config/prisma";

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

    let user = req.body.user;
    const upload = await prisma.$transaction(async (tx) => {
      //if (!user) user = await createTemporaryUser(tx);
      const user = { id: 22 };
      const fileString = req.file.buffer.toString();
      const fileHash = hashFileData(fileString);
      const isValid = await validateFile(fileHash, user.id, tx);
      if (isValid) {
        await createFileEntry(user.id, fileHash, tx);
      } else {
        res.status(422).json({ error: "Duplicate file" });
        return;
      }

      const parsedData = await csvToJson(fileString);
      const uploaded = await createSalesData(user.id, parsedData, tx);
      console.log("upload success -> ", uploaded);
      res.json({ message: "Success!" })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error parsing CSV" });
  }
}

async function csvToJson(fileString: string) {
  const rows = [];

  await new Promise<void>((resolve, reject) => {
    const stream = parse({ headers: true })
      .on("error", (error) => reject(error))
      .on("data", (row) => rows.push(row))
      .on("end", (rowCount: number) => resolve());
    stream.write(fileString);
    stream.end();
  });

  return rows;
}

const uploadSingleFile = [recieveFile, uploadCsvFile];

export { recieveFile, uploadCsvFile };
