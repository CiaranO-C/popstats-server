import { Router } from "express";
import * as handler from "./uploadHandler.js";

const uploadRouter = Router();

uploadRouter.post("/", handler.recieveFile, handler.retrieveUser, handler.uploadCsvFile);

export { uploadRouter };
