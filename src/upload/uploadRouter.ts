import { Router } from "express";
import * as handler from "./uploadHandler";

const uploadRouter = Router();

uploadRouter.post("/", handler.recieveFile, handler.uploadCsvFile);

export { uploadRouter };
